const { collectHistoricalData, fetchNeoData, saveNeoData } = require('../services/neoService');

const getHistoricalData = async (req, res) => {
    const { startDate, endDate } = req.query;
    await collectHistoricalData(startDate, endDate);
    res.send('Historical NEO data collected and saved.');
};

const getCurrentData = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const data = await fetchNeoData(today, today);
    await saveNeoData(data);
    res.send('Current NEO data collected and saved.');
};

module.exports = { getHistoricalData, getCurrentData };
