#!/bin/bash

# Script para generar iconos PNG desde SVG
# Requiere ImageMagick instalado: brew install imagemagick (macOS) o apt-get install imagemagick (Linux)

SIZES=(72 96 128 144 152 192 384 512)

echo "Generando iconos para FitBuddy PWA..."

for size in "${SIZES[@]}"
do
    echo "Generando icon-${size}.png..."
    magick icon.svg -resize ${size}x${size} icon-${size}.png
done

echo "✅ Iconos generados correctamente!"
echo ""
echo "Si no tienes ImageMagick instalado, puedes:"
echo "1. Usar un conversor online como https://cloudconvert.com/svg-to-png"
echo "2. Subir icon.svg y convertir a los siguientes tamaños: 72, 96, 128, 144, 152, 192, 384, 512"
echo "3. Guardar los archivos como icon-{size}.png en la carpeta icons/"
