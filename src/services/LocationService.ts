import axios, { AxiosError} from "axios";
import { Logger } from '../utils/Logger';

export interface Location {
    id: number;
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export interface GeocodingResponse {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export class LocationService {
    private readonly apiKey: string;
    private readonly baseUrl = 'http://api.openweathermap.org/geo/1.0';
    private readonly logger: Logger;
    private locationCache: Map<string, { data: Location[], timestamp: number }> = new Map();
    private readonly cacheExpiry: number;
    private readonly apiTimeout: number;

    // Sample Location for demonstration
    private sampleLocations: Location[] = [
        { id: 1, name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
        { id: 2, name: "New York", country: "US", state: "NY", lat: 40.7128, lon: -74.0060 },
        { id: 3, name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
        { id: 4, name: "Manila", country: "PH", lat: 14.5995, lon: 120.9842 },
        { id: 5, name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
        { id: 6, name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
        { id: 7, name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
        { id: 8, name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
        { id: 9, name: "Los Angeles", country: "US", state: "CA", lat: 34.0522, lon: -118.2437 },
        { id: 10, name: "Mumbai", country: "IN", lat: 19.0760, lon: 72.8777 },
        { id: 11, name: "Berlin", country: "DE", lat: 52.5200, lon: 13.4050 },
        { id: 12, name: "Bangkok", country: "TH", lat: 13.7563, lon: 100.5018 },
        { id: 13, name: "Cairo", country: "EG", lat: 30.0444, lon: 31.2357 },
        { id: 14, name: "Mexico City", country: "MX", lat: 19.4326, lon: -99.1332 },
        { id: 15, name: "São Paulo", country: "BR", lat: -23.5558, lon: -46.6396 }
    ];

    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
        this.cacheExpiry = parseInt(process.env.CACHE_EXPIRY || '300000'); // 5 minutes
        this.apiTimeout = parseInt(process.env.API_TIMEOUT || '5000'); // 5 seconds
        this.logger = new Logger('LocationService');

        if (!this.apiKey) {
            this.logger.warn('OpenWeather API key not found. Using sample data only.');
        } else {
            this.logger.info('LocationService initialized with API key');
        }
    }

    async getLocations(page: number = 1, limit: number = 5): Promise<{
        locations: Location[];
        totalPages: number;
        currentPage: number;
        totalLocations: number;
    }> {
        try {
            this.logger.info(`Fetching locations - Page: ${page}, Limit: ${limit}`);

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedLocations = this.sampleLocations.slice(startIndex, endIndex);
            const totalPages = Math.ceil(this.sampleLocations.length / limit);

            this.logger.info(`Successfully fetched ${paginatedLocations.length} locations`);

            return {
                locations: paginatedLocations,
                totalPages,
                currentPage: page,
                totalLocations: this.sampleLocations.length
            };
        } catch (error) {
            this.logger.error('Error fetching locations:', { error });
            throw new Error('Failed to fetch locations');
        }
    }

    async searchLocations(query: string): Promise<Location[]> {
        try {
            this.logger.info(`Searching locations for query: "${query}"`);

            // Check cache first
            const cacheKey = `search_${query.toLowerCase()}`;
            const cached = this.getCachedResult(cacheKey);
            if (cached) {
                this.logger.info('Returning cached search results');
                return cached;
            }

            let locations: Location[] = [];

            // Try API first if available
            if (this.apiKey) {
                try {
                    locations = await this.searchFromAPI(query);
                    this.logger.info(`Found ${locations.length} locations from API`);
                } catch (apiError) {
                    this.logger.warn('API search failed, falling back to sample data');
                    this.logAPIError(apiError);
                    locations = this.searchFromSampleData(query);
                }
            } else {
                locations = this.searchFromSampleData(query);
            }

            // Cache the results
            this.setCacheResult(cacheKey, locations);

            return locations;
        } catch (error) {
            this.logger.error('Error searching locations:', { error });
            throw new Error('Failed to search locations');
        }
    }

    private async searchFromAPI(query: string): Promise<Location[]> {
        const url = `${this.baseUrl}/direct`;
        const params = {
            q: query,
            limit: 10,
            appid: this.apiKey
        };

        try {
            const response = await axios.get<GeocodingResponse[]>(url, {
                params,
                timeout: this.apiTimeout
            });

            return response.data.map((item, index) => ({
                id: Date.now() + index, // Generate unique ID
                name: item.name,
                country: item.country,
                state: item.state,
                lat: Math.round(item.lat * 10000) / 10000, // Round to 4 decimal places
                lon: Math.round(item.lon * 10000) / 10000
            }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    throw new Error('API request timeout');
                }
                if (error.response?.status === 401) {
                    throw new Error('Invalid API key');
                }
                if (error.response?.status === 429) {
                    throw new Error('API rate limit exceeded');
                }
            }
            throw error;
        }
    }

    private searchFromSampleData(query: string): Location[] {
        const searchTerm = query.toLowerCase();
        return this.sampleLocations.filter(location =>
            location.name.toLowerCase().includes(searchTerm) ||
            location.country.toLowerCase().includes(searchTerm) ||
            (location.state && location.state.toLowerCase().includes(searchTerm))
        );
    }

    async getLocationById(id: number): Promise<Location | null> {
        try {
            this.logger.info(`Fetching location by ID: ${id}`);

            const location = this.sampleLocations.find(location => location.id === id) || null;

            if (location) {
                this.logger.info(`Found location: ${location.name}`);
            } else {
                this.logger.warn(`Location not found for ID: ${id}`);
            }

            return location;
        } catch (error) {
            this.logger.error('Error fetching location by ID:', { error });
            throw new Error('Failed to fetch location');
        }
    }

    async getLocationByCoordinates(lat: number, lon: number): Promise<Location | null> {
        try {
            this.logger.info(`Reverse geocoding for coordinates: ${lat}, ${lon}`);

            if (!this.apiKey) {
                throw new Error('API key required for reverse geocoding');
            }

            const cacheKey = `reverse_${lat}_${lon}`;
            const cached = this.getCachedResult(cacheKey);
            if (cached && cached.length > 0) {
                return cached[0];
            }

            const url = `${this.baseUrl}/reverse`;
            const params = {
                lat: lat,
                lon: lon,
                limit: 1,
                appid: this.apiKey
            };

            const response = await axios.get<GeocodingResponse[]>(url, {
                params,
                timeout: this.apiTimeout
            });

            if (response.data.length === 0) {
                return null;
            }

            const item = response.data[0];
            const location: Location = {
                id: Date.now(),
                name: item.name,
                country: item.country,
                state: item.state,
                lat: Math.round(item.lat * 10000) / 10000,
                lon: Math.round(item.lon * 10000) / 10000
            };

            this.setCacheResult(cacheKey, [location]);
            return location;

        } catch (error) {
            this.logger.error('Error in reverse geocoding:', { error });
            this.logAPIError(error);
            throw new Error('Failed to get location by coordinates');
        }
    }

    private getCachedResult(key: string): Location[] | null {
        const cached = this.locationCache.get(key);
        if (cached) {
            const now = Date.now();
            if (now - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            } else {
                this.locationCache.delete(key);
            }
        }
        return null;
    }

    private setCacheResult(key: string, locations: Location[]): void {
        this.locationCache.set(key, {
            data: locations,
            timestamp: Date.now()
        });
    }

    private logAPIError(error: unknown): void {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            this.logger.error('API Error Details:', {
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                message: axiosError.message,
                code: axiosError.code
            });
        }
    }

    // Method to clear cache manually
    clearCache(): void {
        this.locationCache.clear();
        this.logger.info('Location cache cleared');
    }

    // Method to get cache statistics
    getCacheStats(): { size: number, keys: string[] } {
        return {
            size: this.locationCache.size,
            keys: Array.from(this.locationCache.keys())
        };
    }
}