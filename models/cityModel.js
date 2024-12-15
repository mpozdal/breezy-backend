const axios = require('axios');
require('dotenv').config();
const getCityData = async (input) => {
	const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

	try {
		const response = await axios.get(url, {
			params: {
				input,
				types: '(cities)',
				key: process.env.GOOGLE_API_KEY,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching city data:', error);
		throw error;
	}
};
const getCityCoords = async (input) => {
	const url = `https://maps.googleapis.com/maps/api/place/details/json`;

	try {
		const response = await axios.get(url, {
			params: {
				place_id: input,
				key: process.env.GOOGLE_API_KEY,
			},
		});
		return response.data.result.geometry.location;
	} catch (error) {
		console.error('Error fetching city data:', error);
		throw error;
	}
};
const getCityName = async (latitude, longitude) => {
	const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}
`;
	try {
		const response = await axios.get(url);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching city data:', error);
		throw error;
	}
};

module.exports = { getCityData, getCityCoords, getCityName };
