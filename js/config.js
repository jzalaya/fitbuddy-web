// Google Sheets API Configuration
// IMPORTANT: These values are replaced by GitHub Actions during deployment
// Do NOT hardcode real API keys here. Use GitHub Secrets instead.
const CONFIG = {
    // Google Sheets API
    apiKey: '', // Replaced during deployment from GitHub Secrets
    clientId: '', // Replaced during deployment from GitHub Secrets
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets',

    // Spreadsheet Configuration
    spreadsheetId: '', // Replaced during deployment from GitHub Secrets

    // Sheet Names
    sheets: {
        measurements: 'Mediciones',
        workouts: 'Registros',
        plans: 'Entrenamiento'
    },

    // Exercise API - Using ExerciseDB API (free)
    exerciseApiUrl: 'https://exercisedb.p.rapidapi.com',
    exerciseApiKey: '' // Optional: Replaced during deployment from GitHub Secrets
};

// Helper function to check if configuration is complete
function isConfigured() {
    return CONFIG.apiKey !== '' &&
           CONFIG.clientId !== '' &&
           CONFIG.spreadsheetId !== '' &&
           CONFIG.apiKey !== '' &&
           CONFIG.clientId !== '' &&
           CONFIG.spreadsheetId !== '';
}
