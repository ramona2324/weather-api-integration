<h1>Weather API Integration</h1>
<p>A Node.js application that displays current weather status for 
specific locations using the OpenWeatherMap API. 
The app features an interactive map (Leaflet), a paginated location list, 
and a responsive frontend built with Vue.js and Tailwind CSS.</p>

<h1>Features</h1>
<ul>
    <li>Fetch weather data by city name or coordinates.</li>
    <li>Interactive map to select locations and retrieve weather.</li>
    <li>Paginated list of locations with search functionality.</li>
    <li>Caching to optimize API calls.</li>
    <li>Robust error handling and logging with Winston.</li>
    <li>Responsive design across multiple viewports.</li>
</ul>

<h1>Prerequisites</h1>
<ul>
    <li>Node.js (v14.x or higher)</li>
    <li>npm (v6.x or higher)</li>
    <li>Git</li>
</ul>

<h1>Installation</h1>
<ol>
    <li>Clone the repository: <a href="https://github.com/ramona2324/weather-api-integration.git">weather-api-integration</a></li>
    <li>Install dependencies: <code>npm install</code></li>
    <li>Create a .env file in the root directory with the following variables:<br>
        <code>
            PORT=3000<br>
            OPENWEATHER_API_KEY=your_api_key_here<br>
            NODE_ENV=development<br>
            LOG_LEVEL=info<br>
            CACHE_EXPIRY=300000<br>
            API_TIMEOUT=5000
        </code>
    </li>
    <ul>
        <li>Obtain an OPENWEATHER_API_KEY by signing up at OpenWeatherMap.</li>
    </ul>
</ol>

<h1>Usage</h1>
<ol>
    <li>Start the application: <code>npm run dev</code></li>
    <li>Open your browser and navigate to http://localhost:3000. You’ll see:</li>
    <ul>
        <li>A search bar to enter city names.</li>
        <li>An interactive map to click and get weather data.</li>
        <li>A paginated list of sample locations.</li>
    </ul>
    <li>Use the API endpoints (documented at <code>/</code>):</li>
    <ul>
        <li><code>/api/weather?city=CityName</code></li>
        <li><code>/api/weather/coordinates?lat=latitude&lon=longitude</code></li>
        <li><code>/api/locations?page=1&limit=5</code></li>
        <li><code>/api/locations/search?q=searchQuery</code></li>
    </ul>
</ol>

<h1>Testing</h1>
<ol>
    <li>Run unit and integration tests: <code>npm test</code></li>
    <li>Run tests with watch mode: <code>npm run test:watch</code></li>
    <li>Check test coverage: <code>npm run test:coverage</code>):</li>
</ol>
<p>
    Tests are implemented using Jest, Supertest, and nock, covering services 
    (WeatherService, LocationService) and API endpoints.
</p>

<h1>Project Structure</h1>
<img src="/public/assets/project-structure.png" alt="Project Structure" style="width: 100%;">

<h1>Built With</h1>
<ol>
    <li><strong>Backend:</strong> Node.js, Express, TypeScript</li>
    <li><strong>Frontend:</strong> Vue.js, Tailwind CSS, Leaflet</li>
    <li><strong>Testing:</strong> Jest, Supertest, nock</li>
    <li><strong>Logging:</strong> Winston</li>
    <li><strong>Security:</strong> Helmet, CORS</li>
</ol>

<h1>Contributing</h1>
<ol>
    <li>Fork the repository.</li>
    <li>Create a feature branch (<code>git checkout -b feature/new-feature</code>).</li>
    <li>Commit changes (<code>git commit -m "Add new feature"</code>).</li>
    <li>Push to the branch (<code>git push origin feature/new-feature</code>).</li>
    <li>Open a pull request.</li>
</ol>

<h1>Acknowledgments</h1>
<ol>
    <li>OpenWeatherMap API for weather data.</li>
    <li>Leaflet for interactive maps.</li>
    <li>Vue.js and Tailwind CSS for the frontend.</li>
</ol>

