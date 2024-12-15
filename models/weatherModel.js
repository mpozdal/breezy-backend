const axios = require('axios');

const getWeatherData = async (latitude, longitude) => {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
	&daily=temperature_2m_max,temperature_2m_min,sunshine_duration,weathercode&timezone=auto`;

	try {
		const response = await axios.get(url);
		console.log(response.data);
		const sunshineDuration = response.data.daily.sunshine_duration;
		const dates = response.data.daily.time;
		const data = sunshineDuration.map((duration, index) => {
			return {
				time: reverseDate(dates[index]),
				temperature_2m_min:
					response.data.daily.temperature_2m_min[index],
				temperature_2m_max:
					response.data.daily.temperature_2m_max[index],
				weathercode: response.data.daily.weathercode[index],
				energy: (((2.5 * duration) / 3600) * 0.2).toFixed(2),
			};
		});
		return data;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
};
function reverseDate(dateString) {
	const [year, month, day] = dateString.split('-');
	return `${day}-${month}-${year}`;
}
const getCurrentTemp = async (latitude, longitude) => {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
	&current=temperature_2m,weather_code&timezone=auto`;

	try {
		const response = await axios.get(url);
		return response?.data;
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
};

const getWeeklyInfo = async (latitude, longitude) => {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
	&daily=temperature_2m_max,temperature_2m_min,sunshine_duration,weathercode&hourly=pressure_msl&timezone=auto`;

	try {
		const response = await axios.get(url);
		const data = response.data.daily;
		const weeklyInfo = {
			max_week_temp: Math.max(...data.temperature_2m_max),
			min_week_temp: Math.min(...data.temperature_2m_min),
			avg_pressure: calculateAvg(
				response?.data?.hourly?.pressure_msl
			).toFixed(0),
			avg_sunshine_time: calculateAvg(data.sunshine_duration),
			desc: '',
		};
		return weeklyInfo;
	} catch (error) {
		console.error('Error fetching weekly data:', error);
		throw error;
	}
};

const calculateAvg = (items) => {
	const sum = items.reduce((acc, val) => acc + val, 0);
	return items.length ? sum / items.length : 0;
};

module.exports = { getWeatherData, getWeeklyInfo, getCurrentTemp };
