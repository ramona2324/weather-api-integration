import { WeatherService } from '../../src/services/WeatherService';
import { mockWeatherResponse } from '../mocks/openWeatherMap';
import nock from 'nock';

describe('WeatherService', () => {
    let weatherService: WeatherService;

    beforeEach(() => {
        process.env.OPENWEATHER_API_KEY = 'test-key';
        weatherService = new WeatherService();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should fetch weather by city', async () => {
        mockWeatherResponse('London');
        const result = await weatherService.getWeatherByCity('London');

        expect(result.name).toBe('London');
        expect(result.main.temp).toBe(15);
        expect(result.weather[0].description).toBe('clear sky');
    });

    it('should fetch weather by coordinates', async () => {
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

        const result = await weatherService.getWeatherByCoordinates(51.5074, -0.1278);

        expect(result.name).toBe('London');
        expect(result.main.temp).toBe(15);
    });

    it('should throw error for invalid API response', async () => {
        nock('https://api.openweathermap.org')
            .get('/data/2.5/weather')
            .query({ q: 'InvalidCity', appid: process.env.OPENWEATHER_API_KEY, units: 'metric' })
            .reply(404, { message: 'city not found' });

        await expect(weatherService.getWeatherByCity('InvalidCity')).rejects.toThrow('Weather API Error: city not found');
    });
});