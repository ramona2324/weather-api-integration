import { Router } from 'express';
import { WeatherController } from '../controllers/WeatherController';

const router = Router();

// Create controller instance lazily
let weatherController: WeatherController;

const getWeatherController = () => {
    if (!weatherController) {
        weatherController = new WeatherController();
    }
    return weatherController;
};

// GET /api/weather?city=London
router.get('/weather', (req, res) => {
    const controller = getWeatherController();
    controller.getWeatherByCity(req, res);
});

// GET /api/weather/coordinates?lat=51.5074&lon=-0.1278
router.get('/weather/coordinates', (req, res) => {
    const controller = getWeatherController();
    controller.getWeatherByCoordinates(req, res);
});

export default router;