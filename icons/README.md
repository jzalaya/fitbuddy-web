# Iconos de FitBuddy

## Generar Iconos

Los iconos PNG se generan desde `icon.svg`. Necesitas crear los siguientes tamaños:

- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)

### Método 1: Script Automático (requiere ImageMagick)

```bash
chmod +x generate-icons.sh
./generate-icons.sh
```

### Método 2: Online

1. Ve a https://cloudconvert.com/svg-to-png
2. Sube `icon.svg`
3. Ajusta el tamaño de salida
4. Descarga y renombra como `icon-{size}.png`
5. Repite para todos los tamaños

### Método 3: Photoshop/GIMP

1. Abre `icon.svg`
2. Exporta como PNG con los tamaños requeridos
3. Guarda con el nombre correcto

## Nota para GitHub Pages

Si no generas los iconos, la PWA seguirá funcionando pero sin icono personalizado en iOS.
