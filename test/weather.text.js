// test/weather.test.js
const request = require('supertest');
const nock = require('nock');
const express = require('express');
const weatherRoutes = require('../routes/weatherRoutes');
const chai = require('chai');
const expect = chai.expect;

const app = express();
app.use('/weather', weatherRoutes);

describe('Weather API', () => {
	beforeEach(() => {
		// Mockowanie danych z OpenMeteo z nowymi wartościami
		nock('https://api.open-meteo.com')
			.get('/v1/forecast')
			.query({
				latitude: '52.5200',
				longitude: '13.4050',
				daily: 'temperature_2m_max,temperature_2m_min,sunshine_duration,weathercode',
				timezone: 'auto',
			})
			.reply(200, {
				daily: {
					time: ['2024-12-16', '2024-12-17'],
					sunshine_duration: [3600, 4000],
					temperature_2m_min: [5, 6],
					temperature_2m_max: [10, 12],
					weathercode: [0, 1],
				},
			});

		nock('https://api.open-meteo.com')
			.get('/v1/forecast')
			.query({
				latitude: '52.5200',
				longitude: '13.4050',
				current: 'temperature_2m,weather_code',
				timezone: 'auto',
			})
			.reply(200, {
				current: {
					temperature_2m: 7,
					weather_code: 0,
				},
			});

		nock('https://api.open-meteo.com')
			.get('/v1/forecast')
			.query({
				latitude: '52.5200',
				longitude: '13.4050',
				daily: 'temperature_2m_max,temperature_2m_min,sunshine_duration,weathercode',
				hourly: 'pressure_msl',
				timezone: 'auto',
			})
			.reply(200, {
				daily: {
					temperature_2m_max: [10, 12, 11, 14],
					temperature_2m_min: [5, 6, 7, 8],
					sunshine_duration: [3600, 4000, 4200, 3800],
					weathercode: [0, 1, 2, 3],
				},
				hourly: {
					pressure_msl: [1013, 1015, 1016, 1017],
				},
			});
	});

	afterEach(() => {
		nock.cleanAll(); // Czyścimy mocki po każdym teście
	});

	it('should return weekly weather information', async () => {
		const response = await request(app)
			.get('/weather/weeklyInfo')
			.query({ latitude: '52.5200', longitude: '13.4050' });

		// Sprawdzenie poprawnych wartości w odpowiedzi, jeśli mockowane dane mają teraz wartości 3900
		expect(response.status).to.equal(200);
		expect(response.body).to.deep.equal({
			max_week_temp: 14,
			min_week_temp: 5,
			avg_pressure: '1015',
			avg_sunshine_time: 3900, // Używamy 3900, jeśli taka jest wartość w mocku
			desc: 'The upcoming week is expected to be mostly cloudy.', // Upewnij się, że opis jest taki sam jak w rzeczywistych danych
		});
	});
});
