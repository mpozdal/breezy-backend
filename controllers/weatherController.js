const weatherModel = require('../models/weatherModel');

const getWeather = async (req, res) => {
	const { latitude, longitude } = req.query;
	if (!latitude || !longitude) {
		return res.status(400).send('Latitude and longitude are required');
	}

	try {
		const weatherData = await weatherModel.getWeatherData(
			latitude,
			longitude
		);
		res.json(weatherData);
	} catch (error) {
		res.status(500).send('Error fetching weather data');
	}
};

const getWeeklyInfo = async (req, res) => {
	const { latitude, longitude } = req.query;
	if (!latitude || !longitude) {
		return res.status(400).send('Latitude and longitude are required');
	}
	try {
		const weatherData = await weatherModel.getWeeklyInfo(
			latitude,
			longitude
		);
		res.json(weatherData);
	} catch (error) {
		res.status(500).send('Error fetching weather data');
	}
};
const getCurrentWeather = async (req, res) => {
	const { latitude, longitude } = req.query;
	if (!latitude || !longitude) {
		return res.status(400).send('Latitude and longitude are required');
	}
	try {
		const weatherData = await weatherModel.getCurrentTemp(
			latitude,
			longitude
		);
		res.json(weatherData);
	} catch (error) {
		res.status(500).send('Error fetching weather data');
	}
};

module.exports = { getWeather, getWeeklyInfo, getCurrentWeather };
