import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import weatherRoutes from './routes/weatherRoutes';
import locationRoutes from './routes/locationRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'", // for inline scripts
                    "'unsafe-eval'",   // for Vue.js template compilation
                    "https://unpkg.com",
                    "https://cdnjs.cloudflare.com",
                    "https://cdn.tailwindcss.com",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", // for Tailwind inline styles
                    "https://unpkg.com",
                    "https://cdnjs.cloudflare.com",
                    "https://cdn.tailwindcss.com",
                    "https://fonts.googleapis.com", // for Google Fonts
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https://openweathermap.org",
                    "https://*.tile.openstreetmap.org", // tiles
                    "https://tile.openstreetmap.org",   // alternative tile source
                    "https://a.tile.openstreetmap.org",
                    "https://b.tile.openstreetmap.org",
                    "https://c.tile.openstreetmap.org",
                    "https://unpkg.com",               // for Leaflet marker icons
                ],
                connectSrc: [
                    "'self'",
                    "https://api.openweathermap.org",
                    "https://*.tile.openstreetmap.org", // for tile loading
                    "https://tile.openstreetmap.org",
                    "https://a.tile.openstreetmap.org",
                    "https://b.tile.openstreetmap.org",
                    "https://c.tile.openstreetmap.org",
                    "https://nominatim.openstreetmap.org" // added to allow Nominatim API
                ],
                fontSrc: [
                    "'self'",
                    "https://cdnjs.cloudflare.com",
                    "https://fonts.gstatic.com", // for Google Fonts font files
                ],
                frameSrc: ["'self'"],
                mediaSrc: ["'self'"],
                workerSrc: ["'self'", "blob:"],
                reportUri: "/csp-violation-report",
            },
        },
        frameguard: false,
    })
);
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', weatherRoutes);
app.use('/api', locationRoutes);

app.post('/csp-violation-report', express.json(), (req, res) => {
    console.log('CSP Violation:', req.body);
    res.status(204).end();
});

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Weather API Server is running!',
        version: '1.0.0',
        endpoints: {
            weather: '/api/weather?city=CityName',
            coordinates: '/api/weather/coordinates?lat=latitude&lon=longitude',
            locations: '/api/locations?page=1&limit=5',
            search: '/api/locations/search?q=searchQuery',
        },
    });
});

app.listen(PORT, () => {
    console.log(`Weather API Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});