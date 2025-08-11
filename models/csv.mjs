import { error } from "console";
import fs from "fs/promises"
import { type } from "os";

export class CSV{
    constructor(folder = 'csvs', fileName) {
    const f = new Date();

    this.folder = folder;
    this.fileName = fileName || `Productos(${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}).csv`;
    this.filePath = `${this.folder}/${this.fileName}`;
    }

    async leer(){
        try {
            const datos = await fs.readFile(this.filePath, 'utf-8');
            return datos;
        } catch (err){
            console.log('Error al leer el CSV')
            console.error(err);
        }
    }

    async agregar(ID,Producto,Stock,Precio){
        const agregarLinea = `${ID},${Producto},${Stock},${Precio}\n`;
        try{
            await fs.appendFile(this.filePath, agregarLinea, 'utf-8');
        } catch {
            console.log('Error al agregar un producto')
        }
    }

    static async #listar () {
        const archivo = await fs.readdir("csvs")
       return archivo.filter(nombre => nombre.endsWith('.csv'))
    }

    static async listar_csv () {
        try {
            return await this.#listar()
        } catch {
            await fs.mkdir("csvs", {recursive: true})
            return await this.#listar()
        }
    }

    async borrar(ID){
        try{
            const contenido = await fs.readFile(this.filePath, 'utf-8');
            const lineas = contenido.trim().split('\n');

            //Separar columnas y datos
            const columnas = lineas[0];
            const Producto = lineas.slice(1);

            const productoFiltrado = Producto.filter(linea =>{
                const [productoID] = linea.split(',');
                return productoID !== ID;
            });

            const nuevoContenido = [columnas, ...productoFiltrado].join('\n') + '\n';

            await fs.writeFile(this.filePath, nuevoContenido, 'utf-8');

            console.log(`Producto con numero:${ID} eliminado.`);
        }catch{
            console.log('Error al borrar el producto');
        }
        
    }

    static async abrir (archivo_seleccion) {
        const lista = await fs.readdir("csvs")
        let archivo;
        
        if(typeof archivo_seleccion === 'number'){
            archivo = lista[archivo_seleccion - 1]; //índice
        } else if(typeof archivo_seleccion === 'string'){
            archivo = archivo_seleccion;
        } else {
            console.log('Parámetro inválido para abrir');
        }
       
        const file = new this()
        file.fileName = archivo;
        file.filePath = `${file.folder}/${archivo}`;
        return file;
    }

     
}


