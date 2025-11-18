# Configuración de Secretos para FitBuddy

## Problema
Si ves el mensaje **"Por favor, configura las credenciales de Google Sheets en js/config.js"** al abrir la aplicación, significa que los secretos de GitHub no están configurados.

## Solución

### 1. Crear credenciales de Google Sheets API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto (o selecciona uno existente)
3. Habilita **Google Sheets API**:
   - En el menú lateral, ve a "APIs & Services" → "Library"
   - Busca "Google Sheets API"
   - Haz clic en "Enable"

4. Crea **API Key**:
   - Ve a "APIs & Services" → "Credentials"
   - Haz clic en "+ CREATE CREDENTIALS" → "API key"
   - Copia la API Key generada (la necesitarás después)

5. Crea **OAuth 2.0 Client ID**:
   - En la misma página de "Credentials"
   - Haz clic en "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Tipo de aplicación: "Web application"
   - Authorized JavaScript origins: Agrega `https://jzalaya.github.io`
   - Haz clic en "Create"
   - **⚠️ IMPORTANTE**: Copia el **Client ID** (NO el Client Secret)

   **🚨 ERROR COMÚN - Client ID vs Client Secret:**
   ```
   ✅ Client ID (CORRECTO - úsalo):
      123456789-abcdefghijklmnop.apps.googleusercontent.com

   ❌ Client Secret (INCORRECTO - NO uses esto):
      GOCSPX-xxxxxxxxxxxxxxx
   ```

   **El Client ID termina en `.apps.googleusercontent.com`**

### 2. Crear y configurar Google Spreadsheet

1. Crea una nueva hoja de Google Sheets
2. Nómbrala "FitBuddy" o como prefieras
3. Crea 3 pestañas con estos nombres exactos:
   - `Mediciones`
   - `Registros`
   - `Entrenamiento`

4. Comparte la hoja:
   - Haz clic en "Compartir"
   - Asegúrate de que tenga permisos de edición
   - Copia el ID del Spreadsheet (está en la URL: `https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`)

### 3. Configurar GitHub Secrets

1. Ve a tu repositorio privado: `https://github.com/jzalaya/fitbuddy`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, selecciona **Secrets and variables** → **Actions**
4. Agrega los siguientes secretos haciendo clic en "New repository secret":

| Nombre del Secret | Valor | Formato Esperado | Requerido |
|------------------|-------|------------------|-----------|
| `GOOGLE_API_KEY` | Tu API Key de Google Cloud | `AIzaSy...` | ✅ Sí |
| `GOOGLE_CLIENT_ID` | Tu OAuth 2.0 **Client ID** ⚠️ | `xxxxx.apps.googleusercontent.com` | ✅ Sí |
| `SPREADSHEET_ID` | El ID de tu Google Sheet | `1-abc...xyz` | ✅ Sí |
| `RAPIDAPI_KEY` | Tu RapidAPI Key (opcional) | Cualquiera | ⚠️ Opcional |
| `PUBLIC_REPO_TOKEN` | Ya configurado | - | ✅ Ya existe |

**⚠️ IMPORTANTE**:
- `GOOGLE_CLIENT_ID` debe ser el **Client ID**, NO el Client Secret
- El Client ID termina en `.apps.googleusercontent.com`
- NO uses valores que empiecen con `GOCSPX-` (eso es el secret)

### 4. Ejecutar el deployment

Una vez configurados los secretos:

1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow "Deploy to Public Repository"
3. Haz clic en "Run workflow" → "Run workflow"
4. Espera a que el workflow termine (debería tardar 1-2 minutos)

### 5. Verificar el deployment

1. Ve a: `https://jzalaya.github.io/fitbuddy-web/`
2. Ahora deberías ver la pantalla de login de Google en lugar del mensaje de error
3. Inicia sesión con tu cuenta de Google
4. ¡Listo! Ya puedes usar FitBuddy

## Troubleshooting

### ❌ El workflow falla con "ERROR: GOOGLE_CLIENT_ID has wrong format!"

**Este es el error más común** - Significa que usaste el Client Secret en lugar del Client ID.

**Solución:**
1. Ve a [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Encuentra tu OAuth 2.0 Client ID en la lista
3. Haz clic en el nombre para ver los detalles
4. Verás dos valores:
   - **Client ID**: `123456789-abc...xyz.apps.googleusercontent.com` ← **Copia ESTE**
   - **Client secret**: `GOCSPX-xxxxxxxxxxxxxxx` ← NO copies este
5. Ve a GitHub: Settings → Secrets and variables → Actions
6. Edita el secret `GOOGLE_CLIENT_ID` y pega el Client ID correcto (el que termina en `.apps.googleusercontent.com`)
7. Vuelve a ejecutar el workflow

### El workflow falla con "ERROR: GOOGLE_API_KEY secret is not configured!"
- Verifica que hayas agregado todos los secretos necesarios en Settings → Secrets and variables → Actions
- Asegúrate de que los nombres sean exactamente como se indica (case-sensitive)

### Aún veo el mensaje de error después del deployment
- Limpia la caché de tu navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Verifica que el workflow haya terminado exitosamente
- Revisa los logs del workflow para ver si hubo algún error

### Error de autenticación de Google
- Verifica que hayas agregado `https://jzalaya.github.io` a los "Authorized JavaScript origins" en Google Cloud Console
- Asegúrate de que la Google Sheets API esté habilitada
- Confirma que estás usando el **Client ID** y no el Client Secret

## Opcional: RapidAPI Key para ejercicios

Si quieres usar la base de datos de ejercicios de ExerciseDB:

1. Regístrate en [RapidAPI](https://rapidapi.com/)
2. Suscríbete a [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
3. Copia tu RapidAPI Key
4. Agrégala como secret `RAPIDAPI_KEY` en GitHub

Si no configuras esto, la app usará una lista de ejercicios predefinidos.
