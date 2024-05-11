const axios = require('axios');

class API {
    static BASE_URL = 'https://aviationweather.gov/api';

    constructor(verifyConnection = true) {

        this.verifyConnection = verifyConnection;
        this.httpClient = axios.create({
            baseURL: API.BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async requestGet(endpoint, params = {}) {
        try {
            const response = await this.httpClient.get(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Failed to fetch data from API');
        }
    }

    async getMetarData(airportCode) {
        try {
            const response = await this.requestGet('/data/metar', { ids: airportCode, format: 'json' });
            console.log(response)

            return response[0];
        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Failed to fetch data from API');
        }
    }


    async getAirportData(airportCode) {
        const data = await this.requestGet('/data/airport', { ids: airportCode, format: 'json' });
        if (data.length === 1) {

            return data[0];
        } else {
            throw new Error('No airport matching ' + airportCode);
        }
    }
}

module.exports = API;
