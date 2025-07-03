import { Request, Response } from 'express';
import { WeatherService } from '../services/WeatherService';
import { Logger } from '../utils/Logger';

export class WeatherController {
    private weatherService: WeatherService | null = null;
    private logger: Logger;

    constructor() {
        this.logger = new Logger('WeatherController'); // Provide the context
    }

    private getWeatherService(): WeatherService {
        if (!this.weatherService) {
            this.weatherService = new WeatherService();
        }
        return this.weatherService;
    }

    // Get weather by city name
    async getWeatherByCity(req: Request, res: Response): Promise<void> {
        try {
            const { city } = req.query;

            if (!city || typeof city !== 'string') {
                res.status(400).json({
                    error: 'City parameter is required',
                    message: 'Please provide a city name in the query parameter'
                });
                return;
            }

            const weatherService = this.getWeatherService();
            const weatherData = await weatherService.getWeatherByCity(city);

            res.status(200).json({
                success: true,
                weather: weatherData
            });

        } catch (error) {
            this.logger.error('Weather Controller Error:', { error });

            res.status(500).json({
                error: 'Failed to fetch weather data',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    // Get weather by coordinates (lat, lon)
    async getWeatherByCoordinates(req: Request, res: Response): Promise<void> {
        try {
            const { lat, lon } = req.query;

            if (!lat || !lon) {
                res.status(400).json({
                    error: 'Latitude and longitude parameters are required',
                    message: 'Please provide both lat and lon query parameters'
                });
                return;
            }

            const latitude = parseFloat(lat as string);
            const longitude = parseFloat(lon as string);

            if (isNaN(latitude) || isNaN(longitude)) {
                res.status(400).json({
                    error: 'Invalid coordinates',
                    message: 'Latitude and longitude must be valid numbers'
                });
                return;
            }

            const weatherService = this.getWeatherService();
            const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);

            res.status(200).json({
                success: true,
                weather: weatherData
            });

        } catch (error) {
            this.logger.error('Weather Controller Error:', { error });

            res.status(500).json({
                error: 'Failed to fetch weather data',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
}