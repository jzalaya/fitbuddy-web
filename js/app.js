// FitBuddy Main Application
class FitBuddyApp {
    constructor() {
        this.currentView = 'workouts';
        this.workoutPlans = [];
        this.measurements = [];
        this.workoutRecords = [];
        this.currentWorkout = null;
        this.currentExerciseIndex = null;
        this.charts = {};

        this.init();
    }

    async init() {
        this.showLoading(true);

        // Check if configuration is complete
        if (!isConfigured()) {
            this.showToast('Por favor, configura las credenciales de Google Sheets en js/config.js', 'error');
            this.showConfigurationInstructions();
            this.showLoading(false);
            return;
        }

        try {
            // Initialize Google Sheets API
            await sheetsManager.init();

            if (!sheetsManager.isSignedIn) {
                await sheetsManager.signIn();
            }

            // Load data
            await this.loadData();

            // Setup event listeners
            this.setupEventListeners();

            // Render initial view
            this.renderWorkouts();

            this.showLoading(false);
        } catch (error) {
            console.error('Initialization error:', error);
            this.showToast('Error al inicializar la aplicación', 'error');
            this.showLoading(false);
        }
    }

    showConfigurationInstructions() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚙️</div>
                <h2>Configuración Requerida</h2>
                <p style="max-width: 600px; margin: 20px auto; text-align: left; line-height: 1.6;">
                    Para usar FitBuddy, necesitas configurar:
                    <br><br>
                    <strong>1. Google Sheets API:</strong><br>
                    - Ve a <a href="https://console.cloud.google.com/" target="_blank" style="color: var(--primary-color);">Google Cloud Console</a><br>
                    - Crea un proyecto y habilita Google Sheets API<br>
                    - Crea credenciales (API Key y OAuth 2.0 Client ID)<br>
                    <br>
                    <strong>2. Hoja de Google Sheets:</strong><br>
                    - Crea una hoja llamada "Fitness Coach"<br>
                    - Añade 3 pestañas: "Mediciones", "Registros", "Entrenamiento"<br>
                    - Comparte la hoja con permisos de edición<br>
                    <br>
                    <strong>3. Edita js/config.js:</strong><br>
                    - Añade tu API Key<br>
                    - Añade tu Client ID<br>
                    - Añade el ID de tu Spreadsheet<br>
                    <br>
                    <strong>Opcional - API de Ejercicios:</strong><br>
                    - Regístrate en <a href="https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb" target="_blank" style="color: var(--primary-color);">RapidAPI - ExerciseDB</a><br>
                    - Añade tu RapidAPI Key en config.js<br>
                    - (Si no configuras esto, usarás ejercicios predefinidos)
                </p>
            </div>
        `;
    }

    async loadData() {
        try {
            this.workoutPlans = await sheetsManager.getWorkoutPlans();
            this.measurements = await sheetsManager.getMeasurements();
            this.workoutRecords = await sheetsManager.getWorkoutRecords();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error al cargar datos', 'error');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Add workout/measurement button
        document.getElementById('add-button').addEventListener('click', () => {
            if (this.currentView === 'workouts') {
                this.openWorkoutModal();
            } else if (this.currentView === 'measurements') {
                this.openMeasurementModal();
            }
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Workout modal
        document.getElementById('add-exercise-btn').addEventListener('click', () => {
            this.openExerciseSearchModal();
        });

        document.getElementById('save-workout-btn').addEventListener('click', () => {
            this.saveWorkout();
        });

        // Exercise search
        document.getElementById('exercise-search').addEventListener('input', (e) => {
            this.searchExercises(e.target.value);
        });

        // Set modal
        document.getElementById('save-set-btn').addEventListener('click', () => {
            this.saveSet();
        });

        // Measurement modal
        document.getElementById('save-measurement-btn').addEventListener('click', () => {
            this.saveMeasurement();
        });

        document.getElementById('add-measurement-btn').addEventListener('click', () => {
            this.openMeasurementModal();
        });
    }

    switchView(viewName) {
        this.currentView = viewName;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const activeView = document.getElementById(`view-${viewName}`);
        if (activeView) {
            activeView.classList.add('active');
        }

        // Update header
        const titles = {
            workouts: 'Entrenamientos',
            measurements: 'Mediciones',
            stats: 'Estadísticas'
        };

        document.getElementById('header-title').textContent = titles[viewName] || 'FitBuddy';

        // Show/hide add button
        const addButton = document.getElementById('add-button');
        if (viewName === 'workouts' || viewName === 'measurements') {
            addButton.style.display = 'flex';
        } else {
            addButton.style.display = 'none';
        }

        // Render view content
        if (viewName === 'workouts') {
            this.renderWorkouts();
        } else if (viewName === 'measurements') {
            this.renderMeasurements();
        } else if (viewName === 'stats') {
            this.renderStats();
        }
    }

    // WORKOUTS
    renderWorkouts() {
        const container = document.getElementById('workouts-list');

        if (this.workoutPlans.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💪</div>
                    <h2>No hay entrenamientos planificados</h2>
                    <p>Toca el botón + para crear tu primer entrenamiento</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.workoutPlans.map(plan => `
            <div class="workout-card" data-id="${plan.id}">
                <h3>${plan.name}</h3>
                <p class="workout-info">${plan.notes || 'Sin notas'}</p>
                <div class="exercise-count">
                    <span>📝</span>
                    <span>${plan.exercises.length} ejercicio${plan.exercises.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.workout-card').forEach(card => {
            card.addEventListener('click', () => {
                const planId = card.dataset.id;
                this.startWorkout(planId);
            });
        });
    }

    openWorkoutModal(plan = null) {
        this.currentWorkout = plan || { id: sheetsManager.generateId(), name: '', exercises: [], notes: '' };

        document.getElementById('workout-name').value = this.currentWorkout.name;
        document.getElementById('workout-notes').value = this.currentWorkout.notes;

        this.renderExercisesInModal();
        this.openModal('modal-workout');
    }

    renderExercisesInModal() {
        const container = document.getElementById('exercises-list-modal');

        if (this.currentWorkout.exercises.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No hay ejercicios añadidos</p>';
            return;
        }

        container.innerHTML = this.currentWorkout.exercises.map((exercise, index) => `
            <div class="exercise-item">
                <div class="exercise-header">
                    <span class="exercise-name">${exercise.name}</span>
                    <button class="exercise-remove" data-index="${index}">Eliminar</button>
                </div>
                <p class="exercise-notes">${exercise.description || ''}</p>
            </div>
        `).join('');

        // Add remove listeners
        container.querySelectorAll('.exercise-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.currentWorkout.exercises.splice(index, 1);
                this.renderExercisesInModal();
            });
        });
    }

    async saveWorkout() {
        const name = document.getElementById('workout-name').value.trim();

        if (!name) {
            this.showToast('Por favor, introduce un nombre para el entrenamiento', 'error');
            return;
        }

        if (this.currentWorkout.exercises.length === 0) {
            this.showToast('Añade al menos un ejercicio', 'error');
            return;
        }

        this.currentWorkout.name = name;
        this.currentWorkout.notes = document.getElementById('workout-notes').value.trim();

        this.showLoading(true);

        const success = await sheetsManager.saveWorkoutPlan(this.currentWorkout);

        if (success) {
            this.showToast('Entrenamiento guardado correctamente', 'success');
            await this.loadData();
            this.renderWorkouts();
            this.closeModal('modal-workout');
        } else {
            this.showToast('Error al guardar el entrenamiento', 'error');
        }

        this.showLoading(false);
    }

    startWorkout(planId) {
        const plan = this.workoutPlans.find(p => p.id === planId);
        if (!plan) return;

        this.currentWorkout = JSON.parse(JSON.stringify(plan)); // Deep copy
        this.currentWorkout.startedAt = new Date().toISOString();
        this.currentWorkout.exercises.forEach(ex => {
            ex.sets = ex.sets || [];
        });

        this.switchView('start-workout');
        this.renderActiveWorkout();
    }

    renderActiveWorkout() {
        const container = document.getElementById('active-workout');

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h2>${this.currentWorkout.name}</h2>
                <p style="color: var(--text-secondary);">Iniciado: ${new Date(this.currentWorkout.startedAt).toLocaleTimeString()}</p>
            </div>

            ${this.currentWorkout.exercises.map((exercise, exIndex) => `
                <div class="exercise-item">
                    <div class="exercise-header">
                        <span class="exercise-name">${exercise.name}</span>
                    </div>
                    <p class="exercise-notes">${exercise.description || ''}</p>

                    <div class="sets-container">
                        ${exercise.sets && exercise.sets.length > 0 ? exercise.sets.map((set, setIndex) => `
                            <div class="set-row">
                                <span class="set-number">${setIndex + 1}</span>
                                <div class="set-data">
                                    <span>${set.weight} kg</span>
                                    <span>×</span>
                                    <span>${set.reps} reps</span>
                                    ${set.rir !== undefined ? `<span>RIR ${set.rir}</span>` : ''}
                                </div>
                                ${set.type !== 'normal' ? `<span class="set-badge ${set.type}">${set.type}</span>` : ''}
                            </div>
                        `).join('') : '<p style="color: var(--text-secondary); font-size: 14px;">No hay series registradas</p>'}
                    </div>

                    <button class="btn-add-set" data-exercise-index="${exIndex}">+ Añadir Serie</button>
                </div>
            `).join('')}

            <button class="btn-primary" id="finish-workout-btn" style="margin-top: 20px;">Finalizar Entrenamiento</button>
        `;

        // Add listeners
        container.querySelectorAll('.btn-add-set').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exIndex = parseInt(e.target.dataset.exerciseIndex);
                this.openSetModal(exIndex);
            });
        });

        document.getElementById('finish-workout-btn').addEventListener('click', () => {
            this.finishWorkout();
        });
    }

    openSetModal(exerciseIndex) {
        this.currentExerciseIndex = exerciseIndex;

        // Reset form
        document.getElementById('set-weight').value = '';
        document.getElementById('set-reps').value = '';
        document.getElementById('set-rir').value = '';
        document.getElementById('set-type').value = 'normal';
        document.getElementById('set-notes').value = '';

        this.openModal('modal-set');
    }

    async saveSet() {
        const weight = parseFloat(document.getElementById('set-weight').value) || 0;
        const reps = parseInt(document.getElementById('set-reps').value) || 0;
        const rir = parseInt(document.getElementById('set-rir').value);
        const type = document.getElementById('set-type').value;
        const notes = document.getElementById('set-notes').value.trim();

        if (weight <= 0 || reps <= 0) {
            this.showToast('Por favor, introduce peso y repeticiones válidos', 'error');
            return;
        }

        const set = { weight, reps, type, notes };
        if (!isNaN(rir)) set.rir = rir;

        const exercise = this.currentWorkout.exercises[this.currentExerciseIndex];
        if (!exercise.sets) exercise.sets = [];
        exercise.sets.push(set);

        // Save to Sheets
        const record = {
            date: new Date().toISOString(),
            planId: this.currentWorkout.id,
            planName: this.currentWorkout.name,
            exercise: exercise.name,
            set: exercise.sets.length,
            weight: weight,
            reps: reps,
            additionalData: { type, rir, notes }
        };

        this.showLoading(true);
        await sheetsManager.saveWorkoutRecord(record);
        this.showLoading(false);

        this.closeModal('modal-set');
        this.renderActiveWorkout();
        this.showToast('Serie guardada', 'success');
    }

    async finishWorkout() {
        await this.loadData();
        this.currentWorkout = null;
        this.currentExerciseIndex = null;
        this.switchView('workouts');
        this.showToast('¡Entrenamiento completado! 💪', 'success');
    }

    // EXERCISE SEARCH
    openExerciseSearchModal() {
        document.getElementById('exercise-search').value = '';
        document.getElementById('exercise-results').innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Introduce un término de búsqueda</p>';
        this.openModal('modal-exercise-search');

        // Load popular exercises
        this.displayExercises(exerciseManager.getPopularExercises());
    }

    async searchExercises(query) {
        if (query.length < 2) {
            document.getElementById('exercise-results').innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Introduce al menos 2 caracteres</p>';
            return;
        }

        const exercises = await exerciseManager.searchExercises(query);
        this.displayExercises(exercises);
    }

    displayExercises(exercises) {
        const container = document.getElementById('exercise-results');

        if (exercises.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No se encontraron ejercicios</p>';
            return;
        }

        container.innerHTML = exercises.map(ex => `
            <div class="exercise-result-item" data-exercise='${JSON.stringify(ex)}'>
                ${ex.gifUrl ? `<img src="${ex.gifUrl}" class="exercise-image" alt="${ex.name}">` : '<div class="exercise-image">🏋️</div>'}
                <div class="exercise-details">
                    <h4>${ex.name}</h4>
                    <p>${ex.description}</p>
                </div>
            </div>
        `).join('');

        // Add click listeners
        container.querySelectorAll('.exercise-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const exercise = JSON.parse(item.dataset.exercise);
                this.addExerciseToWorkout(exercise);
            });
        });
    }

    addExerciseToWorkout(exercise) {
        this.currentWorkout.exercises.push({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            sets: []
        });

        this.renderExercisesInModal();
        this.closeModal('modal-exercise-search');
        this.showToast(`${exercise.name} añadido`, 'success');
    }

    // MEASUREMENTS
    renderMeasurements() {
        const container = document.getElementById('measurements-list');

        if (this.measurements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📏</div>
                    <h2>No hay mediciones</h2>
                    <p>Registra tus mediciones corporales para hacer seguimiento de tu progreso</p>
                </div>
            `;
            return;
        }

        // Sort by date descending
        const sorted = [...this.measurements].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = sorted.map(m => `
            <div class="measurement-card">
                <div class="measurement-date">${new Date(m.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="measurement-grid">
                    ${m.weight ? `
                        <div class="measurement-item">
                            <div class="measurement-label">Peso</div>
                            <div class="measurement-value">${m.weight} kg</div>
                        </div>
                    ` : ''}
                    ${m.waist ? `
                        <div class="measurement-item">
                            <div class="measurement-label">Cintura</div>
                            <div class="measurement-value">${m.waist} cm</div>
                        </div>
                    ` : ''}
                    ${m.chest ? `
                        <div class="measurement-item">
                            <div class="measurement-label">Pecho</div>
                            <div class="measurement-value">${m.chest} cm</div>
                        </div>
                    ` : ''}
                    ${m.biceps ? `
                        <div class="measurement-item">
                            <div class="measurement-label">Bíceps</div>
                            <div class="measurement-value">${m.biceps} cm</div>
                        </div>
                    ` : ''}
                    ${m.quads ? `
                        <div class="measurement-item">
                            <div class="measurement-label">Cuádriceps</div>
                            <div class="measurement-value">${m.quads} cm</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    openMeasurementModal() {
        document.getElementById('measurement-weight').value = '';
        document.getElementById('measurement-waist').value = '';
        document.getElementById('measurement-chest').value = '';
        document.getElementById('measurement-biceps').value = '';
        document.getElementById('measurement-quads').value = '';

        this.openModal('modal-measurement');
    }

    async saveMeasurement() {
        const measurement = {
            date: new Date().toISOString(),
            weight: parseFloat(document.getElementById('measurement-weight').value) || 0,
            waist: parseFloat(document.getElementById('measurement-waist').value) || 0,
            chest: parseFloat(document.getElementById('measurement-chest').value) || 0,
            biceps: parseFloat(document.getElementById('measurement-biceps').value) || 0,
            quads: parseFloat(document.getElementById('measurement-quads').value) || 0
        };

        if (measurement.weight === 0 && measurement.waist === 0 && measurement.chest === 0 &&
            measurement.biceps === 0 && measurement.quads === 0) {
            this.showToast('Por favor, introduce al menos una medición', 'error');
            return;
        }

        this.showLoading(true);

        const success = await sheetsManager.saveMeasurement(measurement);

        if (success) {
            this.showToast('Medición guardada correctamente', 'success');
            await this.loadData();
            this.renderMeasurements();
            this.closeModal('modal-measurement');
        } else {
            this.showToast('Error al guardar la medición', 'error');
        }

        this.showLoading(false);
    }

    // STATISTICS
    renderStats() {
        const container = document.getElementById('charts-container');

        if (this.measurements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h2>No hay datos suficientes</h2>
                    <p>Registra mediciones y entrenamientos para ver tus estadísticas</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="chart-card">
                <h3>Evolución del Peso</h3>
                <canvas id="weight-chart"></canvas>
            </div>
            <div class="chart-card">
                <h3>Mediciones Corporales</h3>
                <canvas id="measurements-chart"></canvas>
            </div>
        `;

        this.renderCharts();
    }

    renderCharts() {
        // Sort measurements by date
        const sorted = [...this.measurements].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Weight chart
        const weightCtx = document.getElementById('weight-chart');
        if (weightCtx) {
            if (this.charts.weight) this.charts.weight.destroy();

            this.charts.weight = new Chart(weightCtx, {
                type: 'line',
                data: {
                    labels: sorted.map(m => new Date(m.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
                    datasets: [{
                        label: 'Peso (kg)',
                        data: sorted.map(m => m.weight),
                        borderColor: '#4a90e2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: false }
                    }
                }
            });
        }

        // Body measurements chart
        const measurementsCtx = document.getElementById('measurements-chart');
        if (measurementsCtx) {
            if (this.charts.measurements) this.charts.measurements.destroy();

            this.charts.measurements = new Chart(measurementsCtx, {
                type: 'line',
                data: {
                    labels: sorted.map(m => new Date(m.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
                    datasets: [
                        {
                            label: 'Cintura (cm)',
                            data: sorted.map(m => m.waist),
                            borderColor: '#ff9800',
                            tension: 0.3
                        },
                        {
                            label: 'Pecho (cm)',
                            data: sorted.map(m => m.chest),
                            borderColor: '#4caf50',
                            tension: 0.3
                        },
                        {
                            label: 'Bíceps (cm)',
                            data: sorted.map(m => m.biceps),
                            borderColor: '#7b68ee',
                            tension: 0.3
                        },
                        {
                            label: 'Cuádriceps (cm)',
                            data: sorted.map(m => m.quads),
                            borderColor: '#f44336',
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true }
                    }
                }
            });
        }
    }

    // UTILITIES
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FitBuddyApp();
});
