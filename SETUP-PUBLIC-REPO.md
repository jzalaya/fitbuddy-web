# 🔧 Configuración del Repositorio Público

Este documento explica cómo configurar el repositorio público `fitbuddy-web` por primera vez.

## Prerequisitos

- ✅ Token de GitHub creado (con permisos `repo` y `workflow`)
- ✅ Secret `PUBLIC_REPO_TOKEN` configurado en el repo privado

## Opción 1: Configuración Automática (Recomendada)

### Paso 1: Crear el Repositorio Público

1. Ve a GitHub y crea un nuevo repositorio:
   - Nombre: `fitbuddy-web`
   - Visibilidad: **Public**
   - ❌ NO añadas README, .gitignore, ni license
   - El repositorio debe estar **completamente vacío**

### Paso 2: Ejecutar el Workflow Manualmente

1. Ve al repositorio **privado** `fitbuddy`
2. Click en la pestaña **Actions**
3. Selecciona el workflow **"Deploy to Public Repository"**
4. Click en **"Run workflow"**
5. Selecciona la rama (probablemente `claude/heady-app-google-sheets-01LvPBcFMZ7YXVTiVPwDRVWa`)
6. Click en **"Run workflow"** (verde)

### Paso 3: Verificar el Deploy

1. Espera 1-2 minutos a que termine el workflow
2. Ve al repositorio **público** `fitbuddy-web`
3. Verifica que todos los archivos se copiaron correctamente

### Paso 4: Configurar GitHub Pages

1. En `fitbuddy-web`, ve a **Settings → Pages**
2. En "Build and deployment":
   - Source: **GitHub Actions**
3. La configuración está lista ✅

### Paso 5: Reemplazar README

El workflow copia el `README.md` del repo privado. Para tener un README específico para el público:

1. En `fitbuddy-web`, edita `README.md`
2. Copia el contenido de `README-PUBLIC.md` (del repo privado)
3. Commit los cambios

O simplemente espera al próximo deploy y antes commitea en el privado:

```bash
# En el repo privado
mv README-PUBLIC.md README.md
git add README.md
git commit -m "docs: usar README público"
git push
```

## Opción 2: Configuración Manual

Si prefieres configurar manualmente el repositorio público:

### Paso 1: Crear y Clonar el Repo Público

```bash
# Crear repo público en GitHub primero
# Luego clonarlo localmente
git clone https://github.com/jzalaya/fitbuddy-web.git
cd fitbuddy-web
```

### Paso 2: Copiar Archivos del Repo Privado

```bash
# Desde el repo privado
cd /path/to/fitbuddy

# Copiar todos los archivos excepto .git
rsync -av --exclude='.git' --exclude='fitbuddy-web' ./ ../fitbuddy-web/
```

### Paso 3: Crear el Workflow de GitHub Pages

```bash
cd ../fitbuddy-web
mkdir -p .github/workflows
```

Crea `.github/workflows/deploy.yml` con:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Paso 4: Commit y Push

```bash
# Reemplazar README
cp README-PUBLIC.md README.md

git add .
git commit -m "Initial commit from private repo"
git push origin master
```

### Paso 5: Configurar GitHub Pages

Igual que en la Opción 1, Paso 4.

## Verificación Final

### ✅ Checklist

- [ ] Repositorio público `fitbuddy-web` creado
- [ ] Workflow de deploy configurado en repo privado
- [ ] Secret `PUBLIC_REPO_TOKEN` configurado
- [ ] Primer deploy ejecutado correctamente
- [ ] Archivos copiados al repo público
- [ ] Workflow de GitHub Pages configurado en repo público
- [ ] GitHub Pages activado con source "GitHub Actions"
- [ ] README público correcto
- [ ] App accesible en `https://jzalaya.github.io/fitbuddy-web/`

### 🧪 Probar el Deploy Automático

1. Haz un cambio pequeño en el repo privado:
   ```bash
   echo "# Test" >> test.txt
   git add test.txt
   git commit -m "test: verificar deploy automático"
   git push
   ```

2. Verifica que:
   - [ ] El workflow del repo privado se ejecutó
   - [ ] El archivo apareció en el repo público
   - [ ] El workflow del repo público se ejecutó
   - [ ] Los cambios aparecen en `https://jzalaya.github.io/fitbuddy-web/`

3. Limpia el archivo de prueba:
   ```bash
   git rm test.txt
   git commit -m "test: limpiar archivo de prueba"
   git push
   ```

## Troubleshooting

### El workflow falla con "Permission denied"

- Regenera el token de GitHub
- Verifica que tiene permisos `repo` y `workflow`
- Actualiza el secret `PUBLIC_REPO_TOKEN`

### Los archivos no se copian

- Verifica que el repo público existe
- Verifica que el workflow del privado se ejecutó sin errores
- Revisa los logs en Actions

### GitHub Pages no se actualiza

- Espera 2-3 minutos (puede tardar)
- Verifica que el workflow del público se ejecutó
- Limpia la cache del navegador
- Verifica en Settings → Pages que está configurado correctamente

---

**¿Listo?** Una vez configurado, todo funcionará automáticamente 🚀
