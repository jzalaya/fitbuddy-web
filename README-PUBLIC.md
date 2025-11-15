# 💪 FitBuddy - Tu Entrenador Personal

> **Aplicación web PWA para seguimiento de entrenamientos y mediciones corporales**

[![Deploy to GitHub Pages](https://github.com/jzalaya/fitbuddy-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/jzalaya/fitbuddy-web/actions/workflows/deploy.yml)

🌐 **App en vivo**: [https://jzalaya.github.io/fitbuddy-web/](https://jzalaya.github.io/fitbuddy-web/)

---

## 📱 Instalar en iPhone

1. Abre la app en Safari: [jzalaya.github.io/fitbuddy-web](https://jzalaya.github.io/fitbuddy-web/)
2. Toca el botón de compartir (cuadrado con flecha hacia arriba)
3. Scroll down y selecciona **"Agregar a pantalla de inicio"**
4. Dale un nombre: "FitBuddy"
5. ¡Listo! Ahora aparecerá como una app en tu iPhone 📱

## ✨ Características

- 🏋️ **Planificación de Entrenamientos**: Crea rutinas personalizadas
- 📊 **Registro de Series**: Peso, repeticiones, RIR, tipo de serie
- 📏 **Mediciones Corporales**: Peso, cintura, pecho, bíceps, cuádriceps
- 📈 **Estadísticas**: Gráficos de evolución
- 🔍 **Buscador de Ejercicios**: Base de datos con descripciones
- 💾 **Google Sheets**: Todos tus datos en tu propia hoja
- 🌙 **Diseño Oscuro**: Interfaz moderna tipo Hevy

## 🚀 Empezar a Usar

### 1. Configurar Google Sheets API

Para usar la app, necesitas configurar tus propias credenciales de Google:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita **Google Sheets API**
3. Crea credenciales:
   - **API Key**
   - **OAuth 2.0 Client ID**
     - Authorized JavaScript origins: `https://jzalaya.github.io`

### 2. Crear tu Hoja de Cálculo

1. Crea una hoja de Google Sheets llamada **"Fitness Coach"**
2. Añade 3 pestañas (sheets):
   - `Mediciones`
   - `Registros`
   - `Entrenamiento`

### 3. Configurar la App

La primera vez que abras la app, verás instrucciones para configurar:

- Tu **API Key** de Google
- Tu **Client ID** de OAuth
- El **ID de tu hoja** de Google Sheets

Estos datos se guardan localmente en tu navegador.

## 📖 Instrucciones Completas

Para instrucciones detalladas de configuración, visita:
- [Configuración de Google Sheets API](https://developers.google.com/sheets/api/quickstart/js)

## 🔐 Privacidad

- ✅ **Tus datos son TUYOS**: Todo se guarda en TU hoja de Google Sheets
- ✅ **Sin servidores externos**: La app funciona 100% en tu navegador
- ✅ **Offline**: Funciona sin conexión (excepto para sincronizar con Google Sheets)
- ✅ **Código abierto**: Puedes revisar todo el código

## 💡 Cómo Funciona

FitBuddy es una PWA (Progressive Web App) que:

1. Se ejecuta completamente en tu navegador
2. Usa la Google Sheets API para guardar tus datos
3. Funciona offline gracias a Service Workers
4. Se puede instalar como app nativa en iOS/Android

## 🛠️ Tecnologías

- HTML5, CSS3, JavaScript (Vanilla)
- Google Sheets API v4
- Chart.js para gráficos
- PWA con Service Worker

## 🤝 Contribuir

Este es el repositorio público de despliegue. El desarrollo se hace en un repositorio privado.

Si encuentras un bug o tienes una sugerencia, por favor abre un [issue](https://github.com/jzalaya/fitbuddy-web/issues).

## 📄 Licencia

MIT License - Código abierto

---

**¡A entrenar! 💪**

_Inspirado en [Hevy](https://www.hevyapp.com/)_
