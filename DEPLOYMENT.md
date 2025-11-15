# 🚀 Instrucciones de Despliegue

## Arquitectura de Deploy

Este proyecto usa una arquitectura de **repositorio dual**:

- **Repositorio Privado** (`fitbuddy`): Código fuente y desarrollo
- **Repositorio Público** (`fitbuddy-web`): Despliegue en GitHub Pages

## 📋 Configuración Inicial (Una sola vez)

### 1. Crear Token de GitHub

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Dale un nombre: `FitBuddy Deploy Token`
4. Selecciona los siguientes permisos:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (solo se muestra una vez)

### 2. Configurar Secret en Repositorio Privado

1. Ve al repositorio **fitbuddy** (privado)
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Nombre: `PUBLIC_REPO_TOKEN`
5. Valor: Pega el token que copiaste
6. Click en "Add secret"

### 3. Configurar Repositorio Público

1. Crea el repositorio público: `fitbuddy-web`
2. **NO inicialices con README** (debe estar vacío inicialmente)
3. Ve a Settings → Pages
4. En "Build and deployment":
   - Source: **GitHub Actions**
5. Copia el workflow al repo público:

```bash
# En el repo público fitbuddy-web, crea el workflow
mkdir -p .github/workflows
```

Crea el archivo `.github/workflows/deploy.yml` con el siguiente contenido:

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

**Nota:** También puedes copiar el archivo `.github/workflows/public-repo-deploy.yml` del repo privado.

### 4. Primera Sincronización Manual

Desde el repositorio privado `fitbuddy`:

```bash
# El workflow se ejecutará automáticamente en el próximo push
git push
```

O ejecuta manualmente el workflow:
1. Ve a la pestaña "Actions" en el repo privado
2. Selecciona "Deploy to Public Repository"
3. Click en "Run workflow"

## 🔄 Flujo de Trabajo Automático

Una vez configurado, el proceso es completamente automático:

```
1. Haces commit en repo PRIVADO (fitbuddy)
   ↓
2. GitHub Actions ejecuta workflow de deploy
   ↓
3. Copia todos los archivos al repo PÚBLICO (fitbuddy-web)
   ↓
4. Push automático a fitbuddy-web/master
   ↓
5. GitHub Actions del repo público despliega a Pages
   ↓
6. ✅ App disponible en: https://jzalaya.github.io/fitbuddy-web/
```

## 🎯 Usar la Aplicación

### Después del Primer Deploy

1. **Edita la configuración**: `js/config.js`

```javascript
const CONFIG = {
    apiKey: 'TU_API_KEY_DE_GOOGLE',
    clientId: 'TU_CLIENT_ID_DE_GOOGLE',
    spreadsheetId: 'ID_DE_TU_HOJA_FITNESS_COACH',

    // Opcional: para más ejercicios
    exerciseApiKey: 'TU_RAPIDAPI_KEY'
};
```

2. **Crear Hoja de Google Sheets**:
   - Nombre: **"Fitness Coach"**
   - 3 pestañas: `Mediciones`, `Registros`, `Entrenamiento`

3. **Obtener Credenciales de Google**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita Google Sheets API
   - Crea API Key y OAuth 2.0 Client ID
   - **IMPORTANTE**: En OAuth, añade a "Authorized JavaScript origins":
     - `https://jzalaya.github.io`

Ver instrucciones completas en [README.md](README.md)

### Actualizar Configuración

**Opción A: Editar en Repositorio Privado (Recomendado)**

1. Edita `js/config.js` localmente
2. Commit y push
3. El workflow desplegará automáticamente al repo público

**Opción B: Editar Directamente en Repo Público**

1. Ve a `fitbuddy-web` en GitHub
2. Edita `js/config.js` directamente
3. Commit → se desplegará automáticamente

⚠️ **Nota**: Los cambios en el repo público se sobrescribirán en el próximo deploy desde el privado.

## 📱 Instalar en iPhone

1. Abre: `https://jzalaya.github.io/fitbuddy-web/`
2. En Safari, toca el botón de compartir
3. **"Agregar a pantalla de inicio"**
4. Nombra la app: "FitBuddy"
5. ¡Listo! 💪

## 🔍 Verificar el Deploy

### Repositorio Privado

1. Ve a la pestaña **Actions**
2. Verifica que el workflow "Deploy to Public Repository" se ejecutó correctamente
3. Debe mostrar: ✅ "Successfully deployed to public repository"

### Repositorio Público

1. Ve a `fitbuddy-web` → pestaña **Actions**
2. Verifica que "Deploy to GitHub Pages" se ejecutó
3. Ve a Settings → Pages
4. Debe mostrar: "Your site is live at https://jzalaya.github.io/fitbuddy-web/"

## 🐛 Solución de Problemas

### Error: "PUBLIC_REPO_TOKEN not found"

- Verifica que creaste el secret en el **repo privado** (fitbuddy)
- Nombre exacto: `PUBLIC_REPO_TOKEN`

### Error: "Permission denied" al hacer push

- Verifica que el token tiene permisos `repo` y `workflow`
- Regenera el token si es necesario

### El workflow no se ejecuta

- Verifica que estás pusheando a una de estas ramas:
  - `master`
  - `main`
  - `claude/heady-app-google-sheets-01LvPBcFMZ7YXVTiVPwDRVWa`

### La app muestra "Configuración Requerida"

- Edita `js/config.js` con tus credenciales de Google
- Espera unos minutos a que GitHub Pages se actualice

### Los cambios no aparecen

1. Verifica que el workflow del repo privado se ejecutó
2. Verifica que el workflow del repo público se ejecutó
3. Limpia la cache del navegador (Cmd+Shift+R en Safari)
4. GitHub Pages puede tardar 1-2 minutos en actualizarse

## 📊 Estructura de Archivos Desplegados

El workflow copia TODOS los archivos del repo privado al público, **excepto**:

- ✅ `.git/` (mantiene el historial del repo público)
- ❌ Todo lo demás se copia

Si quieres excluir archivos específicos del deploy, edita `.github/workflows/deploy.yml`:

```yaml
# Añade más exclusiones en la línea rsync
rsync -av --exclude='.git' --exclude='public-repo' --exclude='TU_ARCHIVO' ./ public-repo/
```

## 🔐 Seguridad

- ✅ El token está guardado de forma segura en GitHub Secrets
- ✅ No se expone en los logs de GitHub Actions
- ✅ El repo privado mantiene tu código fuente protegido
- ⚠️ **IMPORTANTE**: NO guardes credenciales sensibles en `js/config.js`
  - Las API keys de Google son seguras para uso público (solo permiten tu Spreadsheet)
  - El Client ID de OAuth es público por naturaleza

## 📚 Recursos Adicionales

- [Configurar Google Sheets API](README.md#1-configurar-google-sheets-api)
- [Generar Iconos PWA](icons/README.md)
- [Usar ExerciseDB API](README.md#4-opcional-configurar-api-de-ejercicios)

---

**¿Todo listo?** ¡A entrenar! 💪

¿Problemas? Revisa los logs en la pestaña Actions de ambos repositorios.
