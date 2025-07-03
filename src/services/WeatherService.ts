import axios from 'axios';
import { Logger } from '../utils/Logger';

export interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        description: string;
        main: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    visibility: number;
    sys: {
        country: string;
    };
}

export interface IWeatherService {
    getWeatherByCity(city: string): Promise<WeatherData>;
    getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData>;
}

export class WeatherService implements IWeatherService {
    private apiKey: string;
    private baseUrl: string = 'https://api.openweathermap.org/data/2.5';
    private logger: Logger;
    private weatherCache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
    private readonly cacheExpiry: number = 300000; // 5 minutes

    private getCachedResult(key: string): WeatherData | null {
        const cached = this.weatherCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            this.logger.info(`Returning cached weather data for ${key}`);
            return cached.data;
        }
        this.weatherCache.delete(key);
        return null;
    }

    private setCacheResult(key: string, data: WeatherData): void {
        this.weatherCache.set(key, { data, timestamp: Date.now() });
    }

    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
        this.logger = new Logger('WeatherService');
        if (!this.apiKey) {
            this.logger.error('OpenWeatherMap API key is required');
            throw new Error('OpenWeatherMap API key is required');
        }
        this.logger.info('WeatherService initialized');
    }

    async getWeatherByCity(city: string): Promise<WeatherData> {
        try {
            const cacheKey = `weather_city_${city.toLowerCase()}`;
            const cached = this.getCachedResult(cacheKey);
            if (cached) return cached;

            this.logger.info(`Fetching weather for city: ${city}`);
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: { q: city, appid: this.apiKey, units: 'metric' },
            });

            const data = response.data;
            const weatherData: WeatherData = {
                name: data.name,
                main: {
                    temp: Math.round(data.main.temp),
                    feels_like: Math.round(data.main.feels_like),
                    temp_min: Math.round(data.main.temp_min),
                    temp_max: Math.round(data.main.temp_max),
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                },
                weather: data.weather,
                wind: {
                    speed: data.wind.speed,
                },
                visibility: data.visibility,
                sys: {
                    country: data.sys.country,
                },
            };
            this.setCacheResult(cacheKey, weatherData);
            return weatherData;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.logger.error('Weather API Error', {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status,
                });
                throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`);
            }
            this.logger.error('Failed to fetch weather data', { error });
            throw new Error('Failed to fetch weather data');
        }
    }

    async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
        try {
            const cacheKey = `weather_coords_${lat}_${lon}`;
            const cached = this.getCachedResult(cacheKey);
            if (cached) return cached;

            this.logger.info(`Fetching weather for coordinates: ${lat}, ${lon}`);
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: { lat, lon, appid: this.apiKey, units: 'metric' },
            });

            const data = response.data;
            const weatherData: WeatherData = {
                name: data.name,
                main: {
                    temp: Math.round(data.main.temp),
                    feels_like: Math.round(data.main.feels_like),
                    temp_min: Math.round(data.main.temp_min),
                    temp_max: Math.round(data.main.temp_max),
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                },
                weather: data.weather,
                wind: {
                    speed: data.wind.speed,
                },
                visibility: data.visibility,
                sys: {
                    country: data.sys.country,
                },
            };
            this.setCacheResult(cacheKey, weatherData);
            return weatherData;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.logger.error('Weather API Error', {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status,
                });
                throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`);
            }
            this.logger.error('Failed to fetch weather data', { error });
            throw new Error('Failed to fetch weather data');
        }
    }
}