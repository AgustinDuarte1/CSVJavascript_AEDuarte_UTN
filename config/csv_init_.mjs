import fs from "fs/promises";

export const crearCsv = async () => {
    const f = new Date();
    const folderPath = 'csvs';
    const fileName = `/Productos(${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}).csv`;
    const filePath = `${folderPath}/${fileName}`;

    try {
        //Crea la carpte si no existe
        await fs.readdir(folderPath)
        console.log('El directorio "csvs" ya existe.')
    } catch {
        console.log("El directorio no esta creado.\nCreando directorio...")
        await fs.mkdir(folderPath, {recursive: true})
        console.log('Directorio "csvs" creado con éxito!')
    }

    try {
        //Crea el archivo .csv si no existe con sus columnas
        await fs.access(filePath)
        console.log(`El Archivo Productos(${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}).csv ya existe!`);
    } catch {
        const columnas = 'ID, Producto, Stock, Precio\n';
        await fs.writeFile(filePath, columnas, 'utf-8');
            console.log(`El Archivo Productos(${f.getFullYear()}-${f.getMonth() + 1}-${f.getDate()}).csv ha sido creado con éxito`);
    }
    return fileName;

    };




