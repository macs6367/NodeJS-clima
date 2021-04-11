const inquirer = require('inquirer'); 
require('colors'); 

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,  
                name: `${ '1.'.green} Buscar ciudad`
            }, 
            {
                value: 2,
                name: `${ '2.'.green} Historial`
            },
            {
                value: 0,
                name: `${ '0.'.green} Salir`
            }
        ]
    }
];

const inquirerMenu = async () => {

    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción   '.green);
    console.log('==========================\n'.green);

    const {opcion} = await inquirer.prompt(preguntas); 

    return opcion; 
}

const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0 ){    
                    return 'Por favor ingrese un valor'; 
                }
                return true; 
            }
        }
    ]

    const {desc} = await inquirer.prompt(question); 

    return desc;     
}

const pausa = async () => {

    console.log();
    const QTpausa = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar.`
        }
    ]   

    return await inquirer.prompt(QTpausa); 
}


const listaLugares = async (lugares = []) => {

    const choices = lugares.map( ({id, nombre}, i) => {
        
        const idx = `${i + 1}.`.green; 

        return {
            value: id,
            name: `${idx} ${nombre}`
        } 
    }); 

    choices.unshift({
        value: 0,
        name: '0.'.green + ' Cancelar'
    })

    const question = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione el lugar',
            choices
        }
    ]; 

    const {id} = await inquirer.prompt(question);
    
    return id; 
}

module.exports = {
    inquirerMenu,
    leerInput,
    pausa,
    listaLugares

}