const axios = require('axios');

const getWeatherData = async (latitude, longitude) => {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
	&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration,weathercode&timezone=auto`;

	try {
		const response = await axios.get(url);
		console.log(response.data);
		const sunshineDuration = response.data.daily.sunshine_duration;
		const dates = response.data.daily.time;
		const data = sunshineDuration.map((duration, index) => {
			return {
				time: dates[index],
				temperature_2m_min:
					response.data.daily.temperature_2m_min[index],
				temperature_2m_max:
					response.data.daily.temperature_2m_max[index],
				weathercode: response.data.daily.weathercode[index],
				energy: (2.5 * duration/3600 * 0.2).toFixed(2),
			};
		});
		return data;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
};

module.exports = { getWeatherData };
