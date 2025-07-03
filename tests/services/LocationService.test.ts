import { LocationService } from '../../src/services/LocationService';
import { mockGeocodingResponse, mockReverseGeocodingResponse } from '../mocks/openWeatherMap';
import nock from 'nock';

describe('LocationService', () => {
    let locationService: LocationService;

    beforeEach(() => {
        process.env.OPENWEATHER_API_KEY = 'test-key';
        locationService = new LocationService();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should fetch paginated locations', async () => {
        const result = await locationService.getLocations(1, 5);
        expect(result.locations).toHaveLength(5);
        expect(result.totalPages).toBe(3); // Based on 15 sample locations
        expect(result.currentPage).toBe(1);
    });

    it('should search locations via API', async () => {
        mockGeocodingResponse('London');
        const result = await locationService.searchLocations('London');
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('London');
        expect(result[0].lat).toBe(51.5074);
    });

    it('should use sample data when API key is missing', async () => {
        process.env.OPENWEATHER_API_KEY = '';
        locationService = new LocationService();
        const result = await locationService.searchLocations('London');
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('London');
    });

    it('should reverse geocode coordinates', async () => {
        mockReverseGeocodingResponse(51.5074, -0.1278);
        const result = await locationService.getLocationByCoordinates(51.5074, -0.1278);
        expect(result).not.toBeNull();
        expect(result!.name).toBe('London');
    });
});