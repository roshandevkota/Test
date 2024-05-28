const axios = require('axios');
const Neo = require('../models/Neo');
const dotenv = require('dotenv');
const logger = require('../logger'); // Import the logger

dotenv.config();
const { NASA_API_KEY } = process.env;

const fetchNeoData = async (startDate, endDate) => {
    logger.info(`Fetching data from NASA API... Start date: ${startDate}, End date: ${endDate}`);
    try {
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
        const response = await axios.get(url);
        return response.data.near_earth_objects;
    } catch (error) {
        logger.error('Error fetching NEO data', error);
        throw error;
    }
};

const saveNeoData = async (neoData) => {
    try {
        for (const date in neoData) {
            for (const neo of neoData[date]) {
                const newNeo = new Neo({
                    name: neo.name,
                    nasa_jpl_url: neo.nasa_jpl_url,
                    is_potentially_hazardous_asteroid: neo.is_potentially_hazardous_asteroid,
                    close_approach_date: new Date(neo.close_approach_data[0].close_approach_date),
                    relative_velocity: neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
                    miss_distance: neo.close_approach_data[0].miss_distance.kilometers,
                });
                await newNeo.save();
            }
        }
    } catch (error) {
        logger.error('Error saving NEO data', error);
        throw error;
    }
};

const collectHistoricalData = async (startDate, endDate) => {
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 7);
        const endDateRange = nextDate > end ? end.toISOString().split('T')[0] : nextDate.toISOString().split('T')[0];
        try {
            const data = await fetchNeoData(currentDate.toISOString().split('T')[0], endDateRange);
            await saveNeoData(data);
        } catch (error) {
            logger.error(`Error on dates ${currentDate.toISOString().split('T')[0]} to ${endDateRange}. Skipping...`, error);
        }
        currentDate = nextDate;
    }
};

module.exports = { fetchNeoData, saveNeoData, collectHistoricalData };
