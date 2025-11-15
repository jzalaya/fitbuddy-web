# 🚀 Guía Rápida - FitBuddy

## TL;DR - Pasos Mínimos para Empezar

### 1️⃣ Configurar Secret en GitHub (2 minutos)

```
1. Crea token en: github.com/settings/tokens/new
   - Permisos: repo + workflow
2. Copia el token
3. Ve a: github.com/jzalaya/fitbuddy/settings/secrets/actions
4. New secret → Nombre: PUBLIC_REPO_TOKEN → Pega el token
```

### 2️⃣ Crear Repositorio Público (1 minuto)

```
1. github.com/new
2. Nombre: fitbuddy-web
3. Visibilidad: Public
4. ❌ NO añadas README ni nada
5. Create repository
```

### 3️⃣ Deploy Inicial (1 click)

```
1. github.com/jzalaya/fitbuddy/actions
2. Click en "Deploy to Public Repository"
3. Run workflow → Run workflow
4. Espera 2 minutos
```

### 4️⃣ Activar GitHub Pages (30 segundos)

```
1. github.com/jzalaya/fitbuddy-web/settings/pages
2. Source: GitHub Actions
3. Save
```

### 5️⃣ Configurar Google Sheets API (5 minutos)

```
1. console.cloud.google.com
2. Nuevo proyecto → Habilita "Google Sheets API"
3. Credenciales:
   - API Key
   - OAuth Client ID (JS origin: https://jzalaya.github.io)
4. Crea hoja "Fitness Coach" con 3 tabs:
   - Mediciones
   - Registros
   - Entrenamiento
5. Edita js/config.js con tus credenciales
```

### 6️⃣ ¡Usar la App! 🎉

```
https://jzalaya.github.io/fitbuddy-web/
```

---

## 📱 Instalar en iPhone

Safari → jzalaya.github.io/fitbuddy-web → Compartir → "Agregar a pantalla de inicio"

---

## 📚 Documentación Completa

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Instrucciones detalladas de deploy
- **[SETUP-PUBLIC-REPO.md](SETUP-PUBLIC-REPO.md)** - Configuración del repo público
- **[README.md](README.md)** - Documentación completa de la aplicación

---

## ⚡ Workflow Automático

Después de la configuración inicial, todo es automático:

```
git commit + git push → Deploy automático → App actualizada
```

---

**¿Problemas?** Lee [DEPLOYMENT.md](DEPLOYMENT.md) o revisa Actions en GitHub
