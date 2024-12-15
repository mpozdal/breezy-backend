const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/', weatherController.getWeather);
router.get('/weeklyInfo', weatherController.getWeeklyInfo);
router.get('/current', weatherController.getCurrentWeather);

module.exports = router;
