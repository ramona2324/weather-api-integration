import nock from 'nock';

export const mockWeatherResponse = (city: string = 'London') => {
    nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query({ q: city, appid: process.env.OPENWEATHER_API_KEY, units: 'metric' })
        .reply(200, {
            name: city,
            main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 16, humidity: 80, pressure: 1012 },
            weather: [{ description: 'clear sky', main: 'Clear', icon: '01d' }],
            wind: { speed: 5 },
            visibility: 10000,
            sys: { country: 'GB' }
        });
};

export const mockGeocodingResponse = (query: string) => {
    nock('http://api.openweathermap.org')
        .get('/geo/1.0/direct')
        .query({ q: query, limit: 10, appid: process.env.OPENWEATHER_API_KEY })
        .reply(200, [
            { name: query, lat: 51.5074, lon: -0.1278, country: 'GB' }
        ]);
};

export const mockReverseGeocodingResponse = (lat: number, lon: number) => {
    nock('http://api.openweathermap.org')
        .get('/geo/1.0/reverse')
        .query({ lat, lon, limit: 1, appid: process.env.OPENWEATHER_API_KEY })
        .reply(200, [
            { name: 'London', lat, lon, country: 'GB' }
        ]);
};