const axios = require('axios');

const getWeatherData = async (latitude, longitude) => {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
	&daily=temperature_2m_max,temperature_2m_min,sunshine_duration,weathercode&timezone=auto`;

	try {
		const response = await axios.get(url);

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
			desc: analyzeWeather(data.weathercode),
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

const analyzeWeather = (codes) => {
	const categories = {
		sunny: 0, // 0
		cloudy: 0, //1-3
		misty: 0, // 45-48
		rainy: 0, // 51-67, 80-82
		snowy: 0, // 71-77
		stormy: 0, // 95-99
	};
	codes.forEach((code) => {
		if (code === 0) {
			categories.sunny++;
		} else if (code >= 1 && code <= 3) {
			categories.cloudy++;
		} else if (code >= 45 && code <= 48) {
			categories.misty++;
		} else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
			categories.rainy++;
		} else if (code >= 71 && code <= 77) {
			categories.snowy++;
		} else if (code >= 95 && code <= 99) {
			categories.stormy++;
		}
	});
	const maxCategory = Object.keys(categories).reduce((a, b) =>
		categories[a] > categories[b] ? a : b
	);
	switch (maxCategory) {
		case 'sunny':
			return 'The upcoming week is expected to be mostly sunny.';
		case 'cloudy':
			return 'The upcoming week is expected to be mostly cloudy.';
		case 'misty':
			return 'The upcoming week is expected to be misty.';
		case 'rainy':
			return 'The upcoming week is expected to be rainy.';
		case 'snowy':
			return 'The upcoming week is expected to be snowy.';
		case 'stormy':
			return 'The upcoming week is expected to be stormy.';
		default:
			return 'No weather data available.';
	}
};

module.exports = { getWeatherData, getWeeklyInfo, getCurrentTemp };
