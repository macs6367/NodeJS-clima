require('dotenv').config();

const {inquirerMenu, pausa, leerInput, listaLugares} = require('./helpers/inquirer');
const Busqueda = require('./models/busquedas');

const main = async () => {

    const busqueda = new Busqueda; 

    let opt; 
    do {
        opt = await inquirerMenu(); 

        switch (opt) {
            case 1: 
                //Mostrar mensaje
                const termino = await leerInput('Nombre del lugar: '); 
                
                //Buscar lugares
                const lugares = await busqueda.ciudades(termino); 

                //Seleccionar lugar 
                const id = await listaLugares(lugares); 

                if(id === 0) continue; 

                const {nombre, lat, lgn} = lugares.find( l => l.id === id);

                //Guarda DB                
                busqueda.agregarHistorial(nombre); 
                
                //Consultar clima 
                const {desc,min,max,temp} = await busqueda.consultarClima(lat,lgn);

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', nombre );
                console.log('Lat:', lat);
                console.log('Lgn:', lgn);
                console.log('Como está el clima:', desc);
                console.log('Temperatura:', temp);
                console.log('Máxima:', max);
                console.log('Mínima:', min);
                
            break;     
                
            case 2:

                busqueda.historial.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })

            break;
        
        }
        await pausa();
    } while (opt !== 0);
}

main(); 
