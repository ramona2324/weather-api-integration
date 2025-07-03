import axios from 'axios';

export interface WeatherData {
    location: string;
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
}

export class WeatherService {
    private apiKey: string;
    private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('OpenWeatherMap API key is required');
        }
    }

    async getWeatherByCity(city: string): Promise<WeatherData> {
        try {
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            const data = response.data;

            return {
                location: `${data.name}, ${data.sys.country}`,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: data.weather[0].icon
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error('Failed to fetch weather data');
        }
    }

    async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
        try {
            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            const data = response.data;

            return {
                location: `${data.name}, ${data.sys.country}`,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: data.weather[0].icon
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`);
            }
            throw new Error('Failed to fetch weather data');
        }
    }
}