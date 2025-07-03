import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes';
import locationRoutes from './routes/locationRoutes';

// Load environment variables FIRST
dotenv.config();

// Debug: Check if API key is loaded
console.log('API Key loaded:', process.env.OPENWEATHER_API_KEY ? 'YES' : 'NO');
console.log('API Key value:', process.env.OPENWEATHER_API_KEY?.substring(0, 8) + '...');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', weatherRoutes);
app.use('/api', locationRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Weather API Server is running!',
        version: '1.0.0',
        endpoints: {
            weather: '/api/weather?city=CityName',
            coordinates: '/api/weather/coordinates?lat=latitude&lon=longitude',
            locations: '/api/locations?page=1&limit=5',
            search: '/api/locations/search?q=searchQuery'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Weather API Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});