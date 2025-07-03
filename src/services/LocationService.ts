export interface Location {
    id: number;
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export class LocationService {
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
    ];

    async getLocations(page: number = 1, limit: number = 5): Promise<{
        locations: Location[];
        totalPages: number;
        currentPage: number;
        totalLocations: number;
    }> {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedLocations = this.sampleLocations.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.sampleLocations.length / limit);

        return {
            locations: paginatedLocations,
            totalPages,
            currentPage: page,
            totalLocations: this.sampleLocations.length
        };
    }

    async searchLocations(query: string): Promise<Location[]> {
        const searchTerm = query.toLowerCase();
        return this.sampleLocations.filter(location =>
            location.name.toLowerCase().includes(searchTerm) ||
            location.country.toLowerCase().includes(searchTerm) ||
            (location.state && location.state.toLowerCase().includes(searchTerm))
        );
    }

    async getLocationById(id: number): Promise<Location | null> {
        return this.sampleLocations.find(location => location.id === id) || null;
    }
}