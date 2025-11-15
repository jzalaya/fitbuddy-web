# 💪 FitBuddy - Tu Entrenador Personal

FitBuddy es una aplicación web progresiva (PWA) que replica la funcionalidad de Hevy, guardando todos tus datos en Google Sheets. Perfecta para trackear entrenamientos, mediciones corporales y visualizar tu progreso.

## ✨ Características

- 🏋️ **Planificación de Entrenamientos**: Crea rutinas personalizadas con ejercicios de una base de datos extensa
- 📊 **Registro de Series**: Guarda peso, repeticiones, RIR, tipo de serie (calentamiento, bajada, fallo)
- 📏 **Mediciones Corporales**: Trackea peso, cintura, pecho, bíceps y cuádriceps
- 📈 **Estadísticas Visuales**: Gráficos de evolución de todas tus métricas
- 🔍 **Buscador de Ejercicios**: Base de datos con fotos y descripciones de ejercicios
- 💾 **Sincronización con Google Sheets**: Todos tus datos en tu propia hoja de cálculo
- 📱 **PWA**: Instálala en tu iPhone y úsala como app nativa
- 🌙 **Diseño Oscuro**: Interfaz moderna tipo Hevy

## 🚀 Configuración Rápida

### 1. Configurar Google Sheets API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (o selecciona uno existente)
3. Habilita **Google Sheets API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Sheets API"
   - Click en "Enable"

4. Crea credenciales:
   - Ve a "APIs & Services" > "Credentials"
   - Click en "Create Credentials" > "API Key"
   - Copia tu **API Key**
   - Click en "Create Credentials" > "OAuth 2.0 Client ID"
   - Tipo de aplicación: "Web application"
   - Authorized JavaScript origins: `https://tuusuario.github.io`
   - Copia tu **Client ID**

### 2. Crear Hoja de Google Sheets

1. Crea una nueva hoja de Google Sheets
2. Nómbrala **"Fitness Coach"**
3. Crea 3 pestañas (sheets):
   - `Mediciones`
   - `Registros`
   - `Entrenamiento`
4. Comparte la hoja con permisos de edición (o déjala pública)
5. Copia el **ID de la hoja** desde la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```

### 3. Configurar la Aplicación

Edita el archivo `js/config.js`:

```javascript
const CONFIG = {
    apiKey: 'TU_API_KEY_AQUI',
    clientId: 'TU_CLIENT_ID_AQUI',
    spreadsheetId: 'TU_SPREADSHEET_ID_AQUI',

    // Opcional: API de ejercicios (si no la configuras, usará ejercicios predefinidos)
    exerciseApiKey: 'TU_RAPIDAPI_KEY' // De https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
};
```

### 4. (Opcional) Configurar API de Ejercicios

Para tener acceso a miles de ejercicios con videos y fotos:

1. Regístrate en [RapidAPI](https://rapidapi.com/)
2. Suscríbete a [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) (tiene plan gratuito)
3. Copia tu RapidAPI Key
4. Añádela en `js/config.js`

> **Nota**: Si no configuras esto, FitBuddy usará una base de datos predefinida con los ejercicios más comunes.

### 5. Generar Iconos para PWA

Tienes dos opciones:

**Opción A: Usando ImageMagick (recomendado)**
```bash
cd icons
chmod +x generate-icons.sh
./generate-icons.sh
```

**Opción B: Manualmente**
1. Abre `icons/icon.svg`
2. Usa un conversor online como [CloudConvert](https://cloudconvert.com/svg-to-png)
3. Convierte a PNG en estos tamaños: 72, 96, 128, 144, 152, 192, 384, 512
4. Guarda como `icon-{size}.png` en la carpeta `icons/`

### 6. Desplegar en GitHub Pages

1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Source: "GitHub Actions"
4. El workflow se ejecutará automáticamente en cada push a master/main
5. Tu app estará disponible en: `https://tuusuario.github.io/fitbuddy/`

## 📱 Instalar en iPhone

1. Abre la app en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Scroll down y toca "Agregar a pantalla de inicio"
4. Nombra la app "FitBuddy"
5. ¡Listo! Ahora aparecerá como una app en tu escritorio

## 🎯 Cómo Usar

### Crear un Entrenamiento

1. Ve a la pestaña "Entrenamientos"
2. Toca el botón **+**
3. Dale un nombre a tu rutina
4. Añade ejercicios desde el buscador
5. Guarda el entrenamiento

### Registrar un Entrenamiento

1. Toca en un entrenamiento planificado
2. Por cada ejercicio, añade series:
   - Peso utilizado
   - Repeticiones realizadas
   - RIR (Repeticiones en Reserva)
   - Tipo de serie (normal, calentamiento, bajada, fallo)
   - Notas adicionales
3. Finaliza el entrenamiento

### Registrar Mediciones

1. Ve a la pestaña "Mediciones"
2. Toca el botón **+**
3. Introduce tus métricas (peso, cintura, pecho, bíceps, cuádriceps)
4. Guarda la medición

### Ver Estadísticas

1. Ve a la pestaña "Estadísticas"
2. Visualiza gráficos de tu evolución:
   - Peso corporal
   - Medidas corporales
   - Progreso por ejercicio

## 🗂️ Estructura de Google Sheets

### Pestaña "Mediciones"
| Fecha | Peso | Cintura | Pecho | Bíceps | Cuádriceps |
|-------|------|---------|-------|--------|------------|

### Pestaña "Registros"
| ID | Fecha | Plan ID | Plan Nombre | Ejercicio | Serie | Peso | Repeticiones | Datos Adicionales |
|----|-------|---------|-------------|-----------|-------|------|--------------|-------------------|

### Pestaña "Entrenamiento"
| ID | Nombre | Ejercicios | Notas | Fecha Creación |
|----|--------|------------|-------|----------------|

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **PWA**: Service Worker, Web App Manifest
- **APIs**:
  - Google Sheets API v4
  - ExerciseDB API (opcional)
- **Gráficos**: Chart.js
- **Deploy**: GitHub Pages + GitHub Actions

## 📝 Notas Importantes

- **Privacidad**: Todos tus datos están en TU hoja de Google Sheets. Nada se guarda en servidores externos.
- **Offline**: Gracias a PWA, puedes usar la app sin conexión (excepto para sincronizar con Google Sheets)
- **Compatibilidad**: Optimizado para iOS Safari, pero funciona en cualquier navegador moderno

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Inspiración

Inspirado en [Hevy](https://www.hevyapp.com/), una excelente app de fitness.

---

**¡A entrenar! 💪**

¿Problemas? Abre un [issue](https://github.com/tuusuario/fitbuddy/issues)
