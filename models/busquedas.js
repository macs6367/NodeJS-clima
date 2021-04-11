const fs = require('fs');
const axios = require('axios');

class Busqueda { 

    historial = [];
    dbPath = './db/database.json';

    constructor () {
        this.leerDB(); 
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudades ( lugar = '') {

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })
            
            const resp = await instance.get();
            
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lgn: lugar.center[0],
                lat: lugar.center[1]
            })) 
            
        } catch (error) {
            return error;
        }
    }

    async consultarClima (lat = '', lon = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat, 
                    lon,
                    appid: process.env.OPENWEATHER_KEY,
                    units: 'metric',
                    lang: 'es'
                }
            })

            const resp = await instance.get();

            const {weather, main} = resp.data; 

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) { 
            return error
        }
    }

    agregarHistorial( lugar = ''){

        if(this.historial.includes(lugar.toLocaleLowerCase() )){
            return; 
        }

        this.historial = this.historial.splice(0,5)

        this.historial.unshift(lugar.toLocaleLowerCase());

        //graba JSON 
        this.guardarDB();
    }

    guardarDB () {

        const payload = {
            historial: this.historial,
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload)); 
    }

    leerDB() {
         
        if(!fs.existsSync(this.dbPath)) return; 

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse(info);

        this.historial = data.historial; 
    }
}

module.exports = Busqueda; 