import readline from 'readline';
import { CSV } from "../models/csv.mjs"


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function preguntar(pregunta){
    return new Promise((resolve) => rl.question(pregunta, resolve));
}

function pausar(){
   return new Promise(resolve => {
   rl.question('\nPulsa ENTER para volver al menú...', () =>{
    resolve();
   });
   });
}



export async function Menu(){
    let archivoActual = null;
    let salir = false;
    
    while(!salir){
    console.clear();
    console.log('\n=== MENÚ CSV ===');
    console.log('Archivo actual:', archivoActual?.fileName || 'Ninguno');
    console.log('1. Leer Archivos CSV');
    console.log('2. Agregar producto');
    console.log('3. Listar archivos CSV');
    console.log('4. Borrar producto por ID');
    console.log('5. Salir');

    const opcion = await preguntar('\nSelecciona una opción: ');

        switch(opcion){
            case '1': {
                const archivo = await CSV.listar_csv();
                if(!archivo.length){
                    console.log('No hay archivos CSV disponibles.');
                    await pausar();
                    break;
                }
                archivo.forEach((nombre, i)=>{
                    console.log(`${i + 1}. ${nombre}`)
                });
                   
                const archivo_seleccion = await preguntar('Selecciona el número del archivo: ');
                archivoActual = await CSV.abrir(Number(archivo_seleccion));
                const contenido = await archivoActual.leer();
                console.log(`Archivo abierto: ${archivoActual.fileName}`);
                console.log('Contenido:\n', contenido);
                await pausar();
                break;
            }
           
            case '2':{

                const archivo = await CSV.listar_csv();
                
                 if(!archivo.length){
                    console.log('No hay archivos CSV disponibles. ')
                    await pausar();
                    break;
                }

                function extraerFecha(nombreArchivo){
                    //Extraer lo que esta dentro del paréntesis
                    const match = nombreArchivo.match(/\((\d{4}-\d{1,2}-\d{1,2})\)/);
                    if (!match) return new Date(0); //Si no hay fecha, lo manda al principio
                    return new Date(match[1]);
                }

                const archivosOrdenados = archivo.sort((a, b) => {
                    return extraerFecha(b) - extraerFecha(a); //Ordena la fecha mas reciente primero
                });

                const archivoReciente = archivosOrdenados[0];

                const archivoActual = await CSV.abrir(archivoReciente);

                const contenido = await archivoActual.leer();
                let nuevoID = 1;
    
                if(contenido){
                    const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
                    const filas = lineas.slice(1); //Ignora la cabecera

                    if(filas.length > 0){
                        const ids = filas.map(fila => parseInt(fila.split(',')[0])).filter(n => !isNaN(n));
                        const ultimoID = Math.max(...ids);
                        nuevoID = ultimoID + 1;
                    }
                }

                const Producto = await preguntar ('Producto: ');
                const Stock = await preguntar ('Stock: ');
                const Precio = await preguntar ('Precio: ');



                await archivoActual.agregar(nuevoID, Producto, Stock, Precio);
                console.log('Producto agregado!');
                await pausar();
                break;
            }

            case '3':
                const archivos = await CSV.listar_csv();
                if (!archivos.length){
                    console.log('No hay archivos CSV disponibles');
                } else {
                    console.log('Archivos CSV disponibles: ');
                    archivos.forEach((nombre, i) => {
                        console.log(`${i + 1}. ${nombre}`);
                    });
                }
                await pausar();

                break;
            
            case '4':
                  const archivo = await CSV.listar_csv();
                if(!archivo.length){
                    console.log('No hay archivos CSV disponibles.');
                    await pausar();
                    break;
                }
                archivo.forEach((nombre, i)=>{
                    console.log(`${i + 1}. ${nombre}`)
                });

                const archivo_seleccion = await preguntar('Selecciona el número del archivo: ');
                archivoActual = await CSV.abrir(Number(archivo_seleccion));
                const contenido = await archivoActual.leer();
                const lineas = contenido.split("\n").filter(linea => linea.trim() !== '');

                if (lineas.length <= 1){
                    console.log('No hay productos disponibles en este archivo. ');
                    await pausar();
                    break;
                }
                console.log('Contenido del archivo:\n', contenido)

                const id = await preguntar('ID del producto a borrar: ');
                await archivoActual.constructor.prototype.borrar.call(archivoActual, id);
                console.log('Producto borrado con éxito. ');
                await pausar();
                break;
            case '5':
                console.log('ChauChauuu');
                salir = true;
                rl.close();
                return;
            default:
                console.log('Opción inválida. ');
                break;

        }
    }
    
           

    
}

