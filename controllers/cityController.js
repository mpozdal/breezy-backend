const cityModel = require('../models/cityModel');

const getCity = async (req, res) => {
	const { input } = req.query;
	if (!input) {
		return res.status(400).send('City is required!');
	}

	try {
		const response = await cityModel.getCityData(input);
		res.json(response);
	} catch (error) {
		res.status(500).send('Error fetching city data');
	}
};
const getCityName = async (req, res) => {
	const { latitude, longitude } = req.query;
	if (!latitude && !longitude) {
		return res.status(400).send('Coords are required!');
	}
	try {
		const response = await cityModel.getCityName(latitude, longitude);
		res.json(response);
	} catch (error) {
		res.status(500).send('Error fetching city name');
	}
};
const getCoords = async (req, res) => {
	const { input } = req.query;
	if (!input) {
		return res.status(400).send('City is required!');
	}
	try {
		const response = await cityModel.getCityCoords(input);
		res.json(response);
	} catch (error) {
		res.status(500).send('Error fetching city data');
	}
};

module.exports = { getCity, getCoords, getCityName };
