import request from 'supertest';
import express from 'express';
import weatherRoutes from '../../src/routes/weatherRoutes';
import locationRoutes from '../../src/routes/locationRoutes';
import { mockWeatherResponse, mockGeocodingResponse, mockReverseGeocodingResponse } from '../mocks/openWeatherMap';
import nock from 'nock';

const app = express();
app.use(express.json());
app.use('/api', weatherRoutes);
app.use('/api', locationRoutes);

describe('API Endpoints', () => {
    beforeEach(() => {
        process.env.OPENWEATHER_API_KEY = 'test-key';
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('GET /api/weather should return weather data for a city', async () => {
        mockWeatherResponse('London');
        const response = await request(app).get('/api/weather?city=London');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.weather.name).toBe('London');
        expect(response.body.weather.main.temp).toBe(15);
    });

    it('GET /api/weather should return 400 for missing city', async () => {
        const response = await request(app).get('/api/weather');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('City parameter is required');
    });

    it('GET /api/weather/coordinates should return weather data', async () => {
        nock('https://api.openweathermap.org')
            .get('/data/2.5/weather')
            .query({ lat: 51.5074, lon: -0.1278, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' })
            .reply(200, {
                name: 'London',
                main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 16, humidity: 80, pressure: 1012 },
                weather: [{ description: 'clear sky', main: 'Clear', icon: '01d' }],
                wind: { speed: 5 },
                visibility: 10000,
                sys: { country: 'GB' }
            });

        const response = await request(app).get('/api/weather/coordinates?lat=51.5074&lon=-0.1278');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.weather.name).toBe('London');
    });

    it('GET /api/locations should return paginated locations', async () => {
        const response = await request(app).get('/api/locations?page=1&limit=5');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.locations).toHaveLength(5);
        expect(response.body.data.totalPages).toBe(3);
    });

    it('GET /api/locations/search should return search results', async () => {
        mockGeocodingResponse('London');
        const response = await request(app).get('/api/locations/search?q=London');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.locations).toHaveLength(1);
        expect(response.body.data.locations[0].name).toBe('London');
    });

    it('GET /api/reverse should return location for coordinates', async () => {
        mockReverseGeocodingResponse(51.5074, -0.1278);
        const response = await request(app).get('/api/reverse?lat=51.5074&lon=-0.1278');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.location.name).toBe('London');
    });

    it('GET /api/reverse should return 400 for invalid coordinates', async () => {
        const response = await request(app).get('/api/reverse?lat=100&lon=200');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid coordinate range');
    });
});