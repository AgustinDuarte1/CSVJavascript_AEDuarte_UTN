import { cwd } from "process"
import { CSV } from "./models/csv.mjs"
import { crearCsv } from './config/csv_init_.mjs';

const main = async() =>{
const fileName = await crearCsv();

const csv = new CSV('csvs', fileName)

    try{
        await csv.agregar('1', 'Ojotas', 43, 5000);
        await csv.agregar('2', 'Ojotas', 43, 5000);
        await csv.agregar('3', 'Ojotas', 43, 5000);
        await csv.agregar('4', 'Ojotas', 43, 5000);

        console.log('Productos agregados con éxito!');

        console.log('\nAntes de borrar: ')
        console(await csv.leer());

        await csv.borrar('2');
        console.log('\nDespués de borrar: ');
        console.log(await csv.leer());
    } catch {
        console.log('Algo mal hiciste pa');
    }

}



/*(async () =>{
    try{
        const contenido = await csv.leer();
        console.log(contenido);

        await csv.agregar('3', 'Ojotas', 43, 5000);
        console.log('Producto agregado con éxito!');

        const archivos = await csv.listar();
        console.log('Archivos CSV: ', archivos);
    } catch {
        console.log('Algo mal hiciste pa');
    }
})(); */

main();

