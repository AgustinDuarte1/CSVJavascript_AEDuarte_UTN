import { cwd } from "process"
import { CSV } from "./models/csv.mjs"
import { crearCsv } from './config/csv_init_.mjs';

const main = async () => {
  const fileName = await crearCsv(); 


  const csv = new CSV('csvs', fileName);

  await csv.agregar('1', 'Camisa', 10, 20.5);

  const contenido = await csv.leer();
  console.log('\nContenido del CSV:');
  console.log(contenido);
};



main();

