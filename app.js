const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
const cityRoutes = require('./routes/cityRoutes');
require('dotenv').config();
const app = express();

const corsOptions = {
	origin: (origin, callback) => {
		callback(null, { origin: true });
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: [
		'Access-Control-Allow-Origin',
		'Origin',
		'X-Requested-With',
		'Content-Type',
		'Accept',
		'Authorization',
	],
	credentials: true,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/city', cityRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server running on http://localhost:${process.env.PORT}`);
});
