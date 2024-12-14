const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
const cityRoutes = require('./routes/cityRoutes');
require('dotenv').config();
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/city', cityRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server running on http://localhost:${process.env.PORT}`);
});
