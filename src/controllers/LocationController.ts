import { Request, Response } from 'express';
import { LocationService } from '../services/LocationService';


export class LocationController {
    private locationService: LocationService;

    constructor() {
        this.locationService = new LocationService();
    }

    async getLocations(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            if (page < 1 || limit < 1 || limit > 20) {
                res.status(400).json({
                    error: 'Invalid pagination parameters',
                    message: 'Page must be >= 1 and limit must be between 1 and 20'
                });
                return;
            }

            const result = await this.locationService.getLocations(page, limit);

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Location Controller Error:', error);

            res.status(500).json({
                error: 'Failed to fetch locations',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async searchLocations(req: Request, res: Response): Promise<void> {
        try {
            const { q } = req.query;

            if (!q || typeof q !== 'string' || q.trim().length < 2) {
                res.status(400).json({
                    error: 'Search query is required',
                    message: 'Please provide a search query with at least 2 characters'
                });
                return;
            }

            const locations = await this.locationService.searchLocations(q.trim());

            res.status(200).json({
                success: true,
                data: {
                    locations,
                    count: locations.length
                }
            });

        } catch (error) {
            console.error('Location Search Error:', error);

            res.status(500).json({
                error: 'Failed to search locations',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async reverseGeocode(req: Request, res: Response): Promise<void> {
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

            // Validate coordinate ranges
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                res.status(400).json({
                    error: 'Invalid coordinate range',
                    message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
                });
                return;
            }

            const location = await this.locationService.getLocationByCoordinates(latitude, longitude);

            if (!location) {
                res.status(404).json({
                    error: 'Location not found',
                    message: 'No location found for the provided coordinates'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: {
                    location
                }
            });

        } catch (error) {
            console.error('Reverse Geocode Error:', error);

            res.status(500).json({
                error: 'Failed to reverse geocode coordinates',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
}