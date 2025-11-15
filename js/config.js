// Google Sheets API Configuration
// IMPORTANT: These values are replaced by GitHub Actions during deployment
// Do NOT hardcode real API keys here. Use GitHub Secrets instead.
const CONFIG = {
    // Google Sheets API
    apiKey: 'AIzaSyCsuyUoKu3joYfqPTMbfTCFNEaEUkIv0lw', // Replaced during deployment from GitHub Secrets
    clientId: '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', // Replaced during deployment from GitHub Secrets
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: 'https://www.googleapis.com/auth/spreadsheets',

    // Spreadsheet Configuration
    spreadsheetId: '1-y14U1aeaP_-8OoD5YNj6zKoZwO8ELDDMVHoVnnA8oA', // Replaced during deployment from GitHub Secrets

    // Sheet Names
    sheets: {
        measurements: 'Mediciones',
        workouts: 'Registros',
        plans: 'Entrenamiento'
    },

    // Exercise API - Using ExerciseDB API (free)
    exerciseApiUrl: 'https://exercisedb.p.rapidapi.com',
    exerciseApiKey: '497af75377msh02123dbce548debp19f75djsnd8bcadf1fec3' // Optional: Replaced during deployment from GitHub Secrets
};

// Helper function to check if configuration is complete
function isConfigured() {
    return CONFIG.apiKey !== 'AIzaSyCsuyUoKu3joYfqPTMbfTCFNEaEUkIv0lw' &&
           CONFIG.clientId !== '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' &&
           CONFIG.spreadsheetId !== '1-y14U1aeaP_-8OoD5YNj6zKoZwO8ELDDMVHoVnnA8oA' &&
           CONFIG.apiKey !== '' &&
           CONFIG.clientId !== '' &&
           CONFIG.spreadsheetId !== '';
}
