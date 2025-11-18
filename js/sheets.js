// Google Sheets Integration Module using Google Identity Services (GIS)
class SheetsManager {
    constructor() {
        this.isSignedIn = false;
        this.isInitialized = false;
        this.accessToken = null;
        this.tokenClient = null;
        this.tokenExpiresAt = null;
    }

    // Initialize Google API
    async init() {
        return new Promise((resolve, reject) => {
            // Wait for both gapi and google (GIS) to load
            const checkLibraries = () => {
                if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
                    this.initializeGapi()
                        .then(() => resolve(this.isSignedIn))
                        .catch(reject);
                } else {
                    setTimeout(checkLibraries, 100);
                }
            };
            checkLibraries();
        });
    }

    async initializeGapi() {
        // Load the Google API client
        await new Promise((resolve) => gapi.load('client', resolve));

        // Initialize the Google API client
        await gapi.client.init({
            apiKey: CONFIG.apiKey,
            discoveryDocs: CONFIG.discoveryDocs
        });

        // Initialize the OAuth 2.0 token client
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.clientId,
            scope: CONFIG.scope,
            callback: (response) => {
                if (response.error) {
                    console.error('Token error:', response);
                    this.isSignedIn = false;
                    return;
                }
                this.saveToken(response.access_token, response.expires_in);
            },
        });

        this.isInitialized = true;

        // Try to restore saved token
        this.restoreToken();
    }

    // Save token to localStorage
    saveToken(accessToken, expiresIn) {
        this.accessToken = accessToken;
        this.tokenExpiresAt = Date.now() + (expiresIn * 1000);
        this.isSignedIn = true;

        // Save to localStorage
        localStorage.setItem('google_access_token', accessToken);
        localStorage.setItem('google_token_expires_at', this.tokenExpiresAt.toString());

        gapi.client.setToken({ access_token: this.accessToken });
    }

    // Restore token from localStorage
    restoreToken() {
        const savedToken = localStorage.getItem('google_access_token');
        const expiresAt = localStorage.getItem('google_token_expires_at');

        if (savedToken && expiresAt) {
            const expiresAtNum = parseInt(expiresAt);

            // Check if token is still valid (with 5 minute buffer)
            if (Date.now() < expiresAtNum - (5 * 60 * 1000)) {
                this.accessToken = savedToken;
                this.tokenExpiresAt = expiresAtNum;
                this.isSignedIn = true;
                gapi.client.setToken({ access_token: this.accessToken });
                console.log('Token restored from localStorage');
                return true;
            } else {
                // Token expired, clear it
                this.clearToken();
            }
        }
        return false;
    }

    // Clear saved token
    clearToken() {
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_token_expires_at');
        this.accessToken = null;
        this.tokenExpiresAt = null;
        this.isSignedIn = false;
    }

    // Sign in to Google
    async signIn() {
        return new Promise((resolve, reject) => {
            if (!this.tokenClient) {
                reject(new Error('Token client not initialized'));
                return;
            }

            // Check if we already have a valid token
            if (this.isSignedIn && this.accessToken && this.tokenExpiresAt > Date.now()) {
                console.log('Already signed in with valid token');
                resolve(true);
                return;
            }

            // Set callback for this specific sign-in request
            const originalCallback = this.tokenClient.callback;
            this.tokenClient.callback = (response) => {
                // Restore original callback
                this.tokenClient.callback = originalCallback;

                if (response.error) {
                    console.error('Error signing in:', response);

                    // If silent sign-in fails, try with prompt
                    if (response.error === 'popup_closed' || response.error === 'access_denied') {
                        reject(response);
                        return;
                    }

                    reject(response);
                    return;
                }

                this.saveToken(response.access_token, response.expires_in);

                // Call original callback if it exists
                if (originalCallback) {
                    originalCallback(response);
                }

                resolve(true);
            };

            // Try to request access token silently first
            // If user is already signed in to Google, this won't show a popup
            this.tokenClient.requestAccessToken({ prompt: '' });
        });
    }

    // Sign out from Google
    signOut() {
        if (this.accessToken) {
            google.accounts.oauth2.revoke(this.accessToken, () => {
                console.log('Token revoked');
            });
        }
        this.clearToken();
        gapi.client.setToken(null);
    }

    // Read data from a sheet
    async readSheet(sheetName, range = 'A:Z') {
        if (!this.isSignedIn || !this.accessToken || this.tokenExpiresAt <= Date.now()) {
            await this.signIn();
        }

        try {
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: CONFIG.spreadsheetId,
                range: `${sheetName}!${range}`
            });

            return response.result.values || [];
        } catch (error) {
            // If token is invalid, try to sign in again
            if (error.status === 401 || error.status === 403) {
                console.log('Token invalid, signing in again...');
                this.clearToken();
                await this.signIn();

                // Retry the request
                const response = await gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: CONFIG.spreadsheetId,
                    range: `${sheetName}!${range}`
                });
                return response.result.values || [];
            }

            console.error('Error reading sheet:', error);
            throw error;
        }
    }

    // Write data to a sheet
    async writeSheet(sheetName, range, values) {
        if (!this.isSignedIn || !this.accessToken || this.tokenExpiresAt <= Date.now()) {
            await this.signIn();
        }

        try {
            const response = await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: CONFIG.spreadsheetId,
                range: `${sheetName}!${range}`,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            });

            return response.result;
        } catch (error) {
            // If token is invalid, try to sign in again
            if (error.status === 401 || error.status === 403) {
                console.log('Token invalid, signing in again...');
                this.clearToken();
                await this.signIn();

                // Retry the request
                const response = await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: CONFIG.spreadsheetId,
                    range: `${sheetName}!${range}`,
                    valueInputOption: 'USER_ENTERED',
                    resource: { values }
                });
                return response.result;
            }

            console.error('Error writing to sheet:', error);
            throw error;
        }
    }

    // Append data to a sheet
    async appendSheet(sheetName, values) {
        if (!this.isSignedIn || !this.accessToken || this.tokenExpiresAt <= Date.now()) {
            await this.signIn();
        }

        try {
            const response = await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: CONFIG.spreadsheetId,
                range: `${sheetName}!A:Z`,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                resource: { values }
            });

            return response.result;
        } catch (error) {
            // If token is invalid, try to sign in again
            if (error.status === 401 || error.status === 403) {
                console.log('Token invalid, signing in again...');
                this.clearToken();
                await this.signIn();

                // Retry the request
                const response = await gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: CONFIG.spreadsheetId,
                    range: `${sheetName}!A:Z`,
                    valueInputOption: 'USER_ENTERED',
                    insertDataOption: 'INSERT_ROWS',
                    resource: { values }
                });
                return response.result;
            }

            console.error('Error appending to sheet:', error);
            throw error;
        }
    }

    // Get all workout plans
    async getWorkoutPlans() {
        try {
            const data = await this.readSheet(CONFIG.sheets.plans);

            if (data.length === 0) {
                // Initialize sheet with headers
                await this.writeSheet(CONFIG.sheets.plans, 'A1:E1', [
                    ['ID', 'Nombre', 'Ejercicios', 'Notas', 'Fecha Creación']
                ]);
                return [];
            }

            // Skip header row
            const plans = data.slice(1).map(row => ({
                id: row[0] || '',
                name: row[1] || '',
                exercises: row[2] ? JSON.parse(row[2]) : [],
                notes: row[3] || '',
                createdAt: row[4] || ''
            }));

            return plans;
        } catch (error) {
            console.error('Error getting workout plans:', error);
            return [];
        }
    }

    // Save workout plan
    async saveWorkoutPlan(plan) {
        try {
            const plans = await this.getWorkoutPlans();
            const existingIndex = plans.findIndex(p => p.id === plan.id);

            const row = [
                plan.id,
                plan.name,
                JSON.stringify(plan.exercises),
                plan.notes || '',
                plan.createdAt || new Date().toISOString()
            ];

            if (existingIndex >= 0) {
                // Update existing plan
                await this.writeSheet(CONFIG.sheets.plans, `A${existingIndex + 2}:E${existingIndex + 2}`, [row]);
            } else {
                // Add new plan
                await this.appendSheet(CONFIG.sheets.plans, [row]);
            }

            return true;
        } catch (error) {
            console.error('Error saving workout plan:', error);
            return false;
        }
    }

    // Delete workout plan
    async deleteWorkoutPlan(planId) {
        try {
            const plans = await this.getWorkoutPlans();
            const filteredPlans = plans.filter(p => p.id !== planId);

            // Rewrite all plans
            const rows = [
                ['ID', 'Nombre', 'Ejercicios', 'Notas', 'Fecha Creación'],
                ...filteredPlans.map(p => [
                    p.id,
                    p.name,
                    JSON.stringify(p.exercises),
                    p.notes,
                    p.createdAt
                ])
            ];

            await this.writeSheet(CONFIG.sheets.plans, 'A1:E' + rows.length, rows);
            return true;
        } catch (error) {
            console.error('Error deleting workout plan:', error);
            return false;
        }
    }

    // Get workout records
    async getWorkoutRecords() {
        try {
            const data = await this.readSheet(CONFIG.sheets.workouts);

            if (data.length === 0) {
                // Initialize sheet with headers
                await this.writeSheet(CONFIG.sheets.workouts, 'A1:I1', [
                    ['ID', 'Fecha', 'Plan ID', 'Plan Nombre', 'Ejercicio', 'Serie', 'Peso', 'Repeticiones', 'Datos Adicionales']
                ]);
                return [];
            }

            // Skip header row
            const records = data.slice(1).map(row => ({
                id: row[0] || '',
                date: row[1] || '',
                planId: row[2] || '',
                planName: row[3] || '',
                exercise: row[4] || '',
                set: parseInt(row[5]) || 0,
                weight: parseFloat(row[6]) || 0,
                reps: parseInt(row[7]) || 0,
                additionalData: row[8] ? JSON.parse(row[8]) : {}
            }));

            return records;
        } catch (error) {
            console.error('Error getting workout records:', error);
            return [];
        }
    }

    // Save workout record
    async saveWorkoutRecord(record) {
        try {
            const row = [
                record.id || this.generateId(),
                record.date || new Date().toISOString(),
                record.planId || '',
                record.planName || '',
                record.exercise || '',
                record.set || 0,
                record.weight || 0,
                record.reps || 0,
                JSON.stringify(record.additionalData || {})
            ];

            await this.appendSheet(CONFIG.sheets.workouts, [row]);
            return true;
        } catch (error) {
            console.error('Error saving workout record:', error);
            return false;
        }
    }

    // Get measurements
    async getMeasurements() {
        try {
            const data = await this.readSheet(CONFIG.sheets.measurements);

            if (data.length === 0) {
                // Initialize sheet with headers
                await this.writeSheet(CONFIG.sheets.measurements, 'A1:F1', [
                    ['Fecha', 'Peso', 'Cintura', 'Pecho', 'Bíceps', 'Cuádriceps']
                ]);
                return [];
            }

            // Skip header row
            const measurements = data.slice(1).map(row => ({
                date: row[0] || '',
                weight: parseFloat(row[1]) || 0,
                waist: parseFloat(row[2]) || 0,
                chest: parseFloat(row[3]) || 0,
                biceps: parseFloat(row[4]) || 0,
                quads: parseFloat(row[5]) || 0
            }));

            return measurements;
        } catch (error) {
            console.error('Error getting measurements:', error);
            return [];
        }
    }

    // Save measurement
    async saveMeasurement(measurement) {
        try {
            const row = [
                measurement.date || new Date().toISOString(),
                measurement.weight || 0,
                measurement.waist || 0,
                measurement.chest || 0,
                measurement.biceps || 0,
                measurement.quads || 0
            ];

            await this.appendSheet(CONFIG.sheets.measurements, [row]);
            return true;
        } catch (error) {
            console.error('Error saving measurement:', error);
            return false;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Create global instance
const sheetsManager = new SheetsManager();
