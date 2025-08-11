import { cwd } from "process"
import { CSV } from "./models/csv.mjs"
import { crearCsv } from './config/csv_init_.mjs';
import { Menu } from './models/menu.mjs'

const main = async () => {
  const fileName = await crearCsv(); 
  Menu();
  
  const csv = new CSV('csvs', fileName);

};



main();

