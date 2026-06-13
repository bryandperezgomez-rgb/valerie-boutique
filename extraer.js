const fs = require('fs');

const html = fs.readFileSync('index.txt', 'utf8');

if (!fs.existsSync('Imagenes')) {
    fs.mkdirSync('Imagenes');
    console.log('📁 Carpeta Imagenes creada!');
}

const regex = /data:image\/(jpeg|jpg|png|gif|webp);base64,([^"'\s]+)/g;
let match;
let contador = 1;
let nuevoHtml = html;

while ((match = regex.exec(html)) !== null) {
    const extension = match[1];
    const base64Data = match[2];
    const nombreArchivo = `imagen${contador}.${extension}`;
    
    fs.writeFileSync(
        `Imagenes/${nombreArchivo}`,
        Buffer.from(base64Data, 'base64')
    );
    
    nuevoHtml = nuevoHtml.replace(
        match[0],
        `Imagenes/${nombreArchivo}`
    );
    
    console.log(`✅ Guardada: ${nombreArchivo}`);
    contador++;
}

fs.writeFileSync('index_nuevo.txt', nuevoHtml);
console.log('🎉 Listo! Revisa index_nuevo.txt');