const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

router.get('/', cityController.getCity);
router.get('/coords', cityController.getCoords);

module.exports = router;
