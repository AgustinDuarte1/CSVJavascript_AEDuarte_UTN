import fs from "fs/promises"

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
        } catch {
            console.log('Error al leer el CSV')
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

    /* Este método listar iría en otro lugar.
    async listar(){
        try{
            const archivos = await fs.readdir(this.folder);
            return archivos.filter(a => a.endsWith('.csv'));
        } catch {
            console.log('Error al listar archivos.')
        }
    }*/

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

}