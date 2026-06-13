const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './Imagenes';
const outputDir = './Imagenes/optimizadas';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const archivos = fs.readdirSync(inputDir).filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f) && !fs.statSync(path.join(inputDir, f)).isDirectory()
);

async function procesar() {
    for (const archivo of archivos) {
        const input = path.join(inputDir, archivo);
        const nombre = path.parse(archivo).name;
        const output = path.join(outputDir, nombre + '.jpeg');
        
        const meta = await sharp(input).metadata();
        
        // Solo escalar si es más pequeña que 900px de ancho
        const escalar = meta.width < 900;
        
        let pipeline = sharp(input);
        
        if (escalar) {
            pipeline = pipeline.resize(900, 1200, {
                fit: 'inside',
                withoutEnlargement: false
            });
        }
        
        await pipeline
            .jpeg({ quality: 92, mozjpeg: true })
            .toFile(output);
        
        const stat = fs.statSync(output);
        console.log('✅ ' + archivo + ' → ' + nombre + '.jpeg (' + Math.round(stat.size/1024) + ' KB)');
    }
    console.log('\n🎉 Listo! Imágenes en Imagenes/optimizadas/');
}

procesar().catch(console.error);
