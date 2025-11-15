// Google Sheets API Configuration
const CONFIG = {
    // Google Sheets API
    apiKey: 'YOUR_API_KEY', // Reemplazar con tu API Key
    clientId: 'YOUR_CLIENT_ID', // Reemplazar con tu Client ID
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets',

    // Spreadsheet Configuration
    spreadsheetId: 'YOUR_SPREADSHEET_ID', // Reemplazar con el ID de tu hoja "Fitness Coach"

    // Sheet Names
    sheets: {
        measurements: 'Mediciones',
        workouts: 'Registros',
        plans: 'Entrenamiento'
    },

    // Exercise API - Using ExerciseDB API (free)
    exerciseApiUrl: 'https://exercisedb.p.rapidapi.com',
    exerciseApiKey: 'YOUR_RAPIDAPI_KEY' // Reemplazar con tu RapidAPI Key para ExerciseDB
};

// Helper function to check if configuration is complete
function isConfigured() {
    return CONFIG.apiKey !== 'YOUR_API_KEY' &&
           CONFIG.clientId !== 'YOUR_CLIENT_ID' &&
           CONFIG.spreadsheetId !== 'YOUR_SPREADSHEET_ID';
}
