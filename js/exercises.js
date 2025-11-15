// Exercise API Module
class ExerciseManager {
    constructor() {
        this.cache = new Map();
        this.allExercises = [];
    }

    // Search exercises using ExerciseDB API
    async searchExercises(query) {
        try {
            // Check cache first
            const cacheKey = `search_${query.toLowerCase()}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            // If no API key configured, use fallback exercises
            if (CONFIG.exerciseApiKey === 'YOUR_RAPIDAPI_KEY') {
                return this.searchFallbackExercises(query);
            }

            const response = await fetch(
                `${CONFIG.exerciseApiUrl}/exercises/name/${encodeURIComponent(query)}`,
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': CONFIG.exerciseApiKey,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                    }
                }
            );

            if (!response.ok) {
                console.warn('API request failed, using fallback');
                return this.searchFallbackExercises(query);
            }

            const data = await response.json();
            const exercises = data.slice(0, 20).map(ex => ({
                id: ex.id,
                name: ex.name,
                bodyPart: ex.bodyPart,
                equipment: ex.equipment,
                target: ex.target,
                gifUrl: ex.gifUrl,
                description: `${ex.bodyPart} - ${ex.target}`
            }));

            this.cache.set(cacheKey, exercises);
            return exercises;
        } catch (error) {
            console.error('Error searching exercises:', error);
            return this.searchFallbackExercises(query);
        }
    }

    // Get exercises by body part
    async getExercisesByBodyPart(bodyPart) {
        try {
            if (CONFIG.exerciseApiKey === 'YOUR_RAPIDAPI_KEY') {
                return this.getFallbackExercisesByBodyPart(bodyPart);
            }

            const response = await fetch(
                `${CONFIG.exerciseApiUrl}/exercises/bodyPart/${encodeURIComponent(bodyPart)}`,
                {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': CONFIG.exerciseApiKey,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
                    }
                }
            );

            if (!response.ok) {
                return this.getFallbackExercisesByBodyPart(bodyPart);
            }

            const data = await response.json();
            return data.slice(0, 20).map(ex => ({
                id: ex.id,
                name: ex.name,
                bodyPart: ex.bodyPart,
                equipment: ex.equipment,
                target: ex.target,
                gifUrl: ex.gifUrl,
                description: `${ex.bodyPart} - ${ex.target}`
            }));
        } catch (error) {
            console.error('Error getting exercises by body part:', error);
            return this.getFallbackExercisesByBodyPart(bodyPart);
        }
    }

    // Fallback exercises database (when API is not configured)
    getFallbackExercises() {
        return [
            // Pecho
            { id: 'bench_press', name: 'Press de Banca', bodyPart: 'pecho', equipment: 'barra', target: 'pectorales', gifUrl: '', description: 'Pecho - Pectorales' },
            { id: 'incline_press', name: 'Press Inclinado', bodyPart: 'pecho', equipment: 'barra', target: 'pectorales superiores', gifUrl: '', description: 'Pecho - Pectorales Superiores' },
            { id: 'dumbbell_fly', name: 'Aperturas con Mancuernas', bodyPart: 'pecho', equipment: 'mancuernas', target: 'pectorales', gifUrl: '', description: 'Pecho - Pectorales' },
            { id: 'push_ups', name: 'Flexiones', bodyPart: 'pecho', equipment: 'peso corporal', target: 'pectorales', gifUrl: '', description: 'Pecho - Pectorales' },

            // Espalda
            { id: 'deadlift', name: 'Peso Muerto', bodyPart: 'espalda', equipment: 'barra', target: 'espalda completa', gifUrl: '', description: 'Espalda - Completa' },
            { id: 'pull_ups', name: 'Dominadas', bodyPart: 'espalda', equipment: 'peso corporal', target: 'dorsales', gifUrl: '', description: 'Espalda - Dorsales' },
            { id: 'barbell_row', name: 'Remo con Barra', bodyPart: 'espalda', equipment: 'barra', target: 'dorsales', gifUrl: '', description: 'Espalda - Dorsales' },
            { id: 'lat_pulldown', name: 'Jalón al Pecho', bodyPart: 'espalda', equipment: 'máquina', target: 'dorsales', gifUrl: '', description: 'Espalda - Dorsales' },

            // Piernas
            { id: 'squat', name: 'Sentadilla', bodyPart: 'piernas', equipment: 'barra', target: 'cuádriceps', gifUrl: '', description: 'Piernas - Cuádriceps' },
            { id: 'leg_press', name: 'Prensa de Piernas', bodyPart: 'piernas', equipment: 'máquina', target: 'cuádriceps', gifUrl: '', description: 'Piernas - Cuádriceps' },
            { id: 'leg_curl', name: 'Curl Femoral', bodyPart: 'piernas', equipment: 'máquina', target: 'femorales', gifUrl: '', description: 'Piernas - Femorales' },
            { id: 'leg_extension', name: 'Extensión de Piernas', bodyPart: 'piernas', equipment: 'máquina', target: 'cuádriceps', gifUrl: '', description: 'Piernas - Cuádriceps' },
            { id: 'calf_raise', name: 'Elevación de Gemelos', bodyPart: 'piernas', equipment: 'máquina', target: 'gemelos', gifUrl: '', description: 'Piernas - Gemelos' },

            // Hombros
            { id: 'overhead_press', name: 'Press Militar', bodyPart: 'hombros', equipment: 'barra', target: 'deltoides', gifUrl: '', description: 'Hombros - Deltoides' },
            { id: 'lateral_raise', name: 'Elevaciones Laterales', bodyPart: 'hombros', equipment: 'mancuernas', target: 'deltoides lateral', gifUrl: '', description: 'Hombros - Deltoides Lateral' },
            { id: 'front_raise', name: 'Elevaciones Frontales', bodyPart: 'hombros', equipment: 'mancuernas', target: 'deltoides frontal', gifUrl: '', description: 'Hombros - Deltoides Frontal' },

            // Brazos
            { id: 'barbell_curl', name: 'Curl con Barra', bodyPart: 'brazos', equipment: 'barra', target: 'bíceps', gifUrl: '', description: 'Brazos - Bíceps' },
            { id: 'dumbbell_curl', name: 'Curl con Mancuernas', bodyPart: 'brazos', equipment: 'mancuernas', target: 'bíceps', gifUrl: '', description: 'Brazos - Bíceps' },
            { id: 'hammer_curl', name: 'Curl Martillo', bodyPart: 'brazos', equipment: 'mancuernas', target: 'bíceps', gifUrl: '', description: 'Brazos - Bíceps' },
            { id: 'tricep_dips', name: 'Fondos de Tríceps', bodyPart: 'brazos', equipment: 'peso corporal', target: 'tríceps', gifUrl: '', description: 'Brazos - Tríceps' },
            { id: 'tricep_extension', name: 'Extensión de Tríceps', bodyPart: 'brazos', equipment: 'mancuernas', target: 'tríceps', gifUrl: '', description: 'Brazos - Tríceps' },

            // Core
            { id: 'plank', name: 'Plancha', bodyPart: 'core', equipment: 'peso corporal', target: 'abdomen', gifUrl: '', description: 'Core - Abdomen' },
            { id: 'crunches', name: 'Abdominales', bodyPart: 'core', equipment: 'peso corporal', target: 'abdomen', gifUrl: '', description: 'Core - Abdomen' },
            { id: 'russian_twist', name: 'Giro Ruso', bodyPart: 'core', equipment: 'peso corporal', target: 'oblicuos', gifUrl: '', description: 'Core - Oblicuos' },
            { id: 'leg_raise', name: 'Elevación de Piernas', bodyPart: 'core', equipment: 'peso corporal', target: 'abdomen bajo', gifUrl: '', description: 'Core - Abdomen Bajo' }
        ];
    }

    searchFallbackExercises(query) {
        const exercises = this.getFallbackExercises();
        const lowerQuery = query.toLowerCase();

        return exercises.filter(ex =>
            ex.name.toLowerCase().includes(lowerQuery) ||
            ex.bodyPart.toLowerCase().includes(lowerQuery) ||
            ex.target.toLowerCase().includes(lowerQuery)
        );
    }

    getFallbackExercisesByBodyPart(bodyPart) {
        const exercises = this.getFallbackExercises();
        return exercises.filter(ex => ex.bodyPart.toLowerCase() === bodyPart.toLowerCase());
    }

    // Get popular exercises
    getPopularExercises() {
        const fallback = this.getFallbackExercises();
        return fallback.slice(0, 10);
    }
}

// Create global instance
const exerciseManager = new ExerciseManager();
