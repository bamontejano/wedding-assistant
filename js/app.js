/**
 * Wedding Planner AI - Main Application Logic
 */

const App = {
    currentSection: 'dashboard',
    countdownInterval: null,
    deferredPrompt: null,

    async init() {
        try {
            await StorageManager.init();
            this.initDefaultData();
            this.renderSidebar();
            this.setupEventListeners();
            this.handleRouting();
            this.startCountdown();
            this.updateGlobalStats();
            if (typeof ChatWidget !== 'undefined') ChatWidget.init();

            // PWA Install Logic
            this.setupPWAInstall();

            // Register Service Worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('SW registered:', reg))
                    .catch(err => console.error('SW registration failed:', err));
            }

            // Listen for enter on scouting
            document.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.id === 'scout-query') this.handleStartScout();
            });

            // Listen for cloud sync updates
            window.addEventListener('storage-updated', (e) => {
                this.handleCloudUpdate(e.detail.key);
            });

            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                if (preloader) preloader.classList.add('hidden');
            }, 800);

            Utils.showToast('¡Bienvenido a Wedding AI! ❤️', 'success');
        } catch (error) {
            console.error('Error during init:', error);
            // Ensure preloader hides even on error
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
        }
    },

    initDefaultData() {
        const tasks = StorageManager.getTasks();
        if (tasks.length === 0) {
            const defaults = [
                { title: 'Definir el presupuesto inicial', category: 'other', completed: false },
                { title: 'Crear lista de invitados', category: 'other', completed: false }
            ];
            defaults.forEach(t => StorageManager.addTask(t));
        }
    },

    setupEventListeners() {
        // Navigation with delegation
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.nav-link, .nav-trigger');
            if (trigger) {
                e.preventDefault();
                const item = trigger.closest('.nav-item') || trigger;
                const section = item.dataset.section;
                if (section) {
                    this.navigateTo(section);
                }
                if (window.innerWidth <= 1024) document.getElementById('sidebar')?.classList.remove('open');
            }
        });

        // Export data
        document.addEventListener('click', (e) => {
            if (e.target.closest('#export-guests-btn')) {
                Utils.exportGuestsCSV();
            }
        });

        // Mobile
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.add('open'));
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.remove('open'));

        // Settings
        document.getElementById('settings-btn')?.addEventListener('click', () => this.showModal('settings'));

        // Global Event Delegation
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const id = btn.dataset.id;

            // Simple IDs
            if (btn.id === 'add-task-btn') this.showModal('task');
            if (btn.id === 'add-guest-btn') this.showModal('guest');
            if (btn.id === 'add-expense-btn') this.showModal('expense');
            if (btn.id === 'add-vendor-btn') this.showModal('vendor');
            if (btn.id === 'add-event-btn') this.showModal('event');
            if (btn.id === 'add-table-btn') this.showModal('table');
            if (btn.id === 'add-gift-btn') this.showModal('gift');
            if (btn.id === 'add-song-btn') this.showModal('song');
            if (btn.id === 'add-wish-btn') this.showModal('wish');
            if (btn.id === 'add-memory-btn') this.showModal('memory');

            // Quick actions
            if (btn.dataset.action === 'add-task') this.showModal('task');
            if (btn.dataset.action === 'add-guest') this.showModal('guest');
            if (btn.dataset.action === 'add-expense') this.showModal('expense');
            if (btn.dataset.action === 'add-vendor') this.showModal('vendor');

            // Save handlers
            if (btn.id === 'save-settings-btn') this.handleSaveSettings();
            if (btn.id === 'save-task-btn') this.handleSaveTask();
            if (btn.id === 'save-guest-btn') this.handleSaveGuest();
            if (btn.id === 'save-expense-btn') this.handleSaveExpense();
            if (btn.id === 'save-vendor-btn') this.handleSaveVendor();
            if (btn.id === 'save-event-btn') this.handleSaveEvent();
            if (btn.id === 'save-table-btn') this.handleSaveTable();
            if (btn.id === 'save-gift-btn') this.handleSaveGift();
            if (btn.id === 'save-song-btn') this.handleSaveSong();
            if (btn.id === 'save-wish-btn') this.handleSaveWish();
            if (btn.id === 'save-memory-btn') this.handleSaveMemory();
            if (btn.id === 'join-wedding-btn') this.handleJoinWedding();
            if (btn.id === 'generate-id-btn') this.handleGenerateID();
            if (btn.id === 'pwa-install-btn') this.handleInstallPrompt();
            if (btn.id === 'pwa-close-btn') this.closeInstallBanner();
            if (btn.id === 'start-scout-btn') this.handleStartScout();

            // Generic modal close
            if (btn.classList.contains('modal-close') || btn.classList.contains('modal-cancel')) this.closeModal();

            // List actions
            if (btn.classList.contains('delete-task')) { if (confirm('¿Borrar tarea?')) { StorageManager.deleteTask(id); this.renderTasks(); } }
            if (btn.classList.contains('edit-task')) this.showModal('task', StorageManager.getTasks().find(t => t.id === id));
            if (btn.classList.contains('delete-guest')) { if (confirm('¿Borrar invitado?')) { StorageManager.deleteGuest(id); this.renderGuests(); } }
            if (btn.classList.contains('edit-guest')) this.showModal('guest', StorageManager.getGuests().find(g => g.id === id));
            if (btn.classList.contains('delete-expense')) { if (confirm('¿Borrar gasto?')) { StorageManager.deleteExpense(id); this.renderBudget(); } }
            if (btn.classList.contains('edit-expense')) this.showModal('expense', StorageManager.getExpenses().find(ex => ex.id === id));
            if (btn.classList.contains('delete-vendor')) { if (confirm('¿Borrar proveedor?')) { StorageManager.deleteVendor(id); this.renderVendors(); } }
            if (btn.classList.contains('edit-vendor')) this.showModal('vendor', StorageManager.getVendors().find(v => v.id === id));
            if (btn.classList.contains('delete-event')) { if (confirm('¿Borrar evento?')) { StorageManager.deleteEvent(id); this.renderTimeline(); } }
            if (btn.classList.contains('edit-event')) this.showModal('event', StorageManager.getEvents().find(ev => ev.id === id));
            if (btn.classList.contains('delete-table')) { if (confirm('¿Borrar mesa?')) { StorageManager.deleteTable(id); this.renderSeating(); } }
            if (btn.classList.contains('delete-gift')) { if (confirm('¿Borrar regalo?')) { StorageManager.deleteGift(id); this.renderGifts(); } }
            if (btn.classList.contains('edit-gift')) this.showModal('gift', StorageManager.getGifts().find(g => g.id === id));
            if (btn.classList.contains('delete-song')) { if (confirm('¿Borrar canción?')) { StorageManager.deleteSong(id); this.renderPlaylist(); } }
            if (btn.classList.contains('delete-wish')) { if (confirm('¿Borrar mensaje?')) { StorageManager.deleteWish(id); this.renderWishes(); } }
            if (btn.classList.contains('delete-memory')) { if (confirm('¿Borrar recuerdo?')) { StorageManager.deleteMemory(id); this.renderMemories(); } }

            // Other
            if (btn.classList.contains('add-to-table-btn')) this.assignGuestToTable(btn.dataset.tableId);
            if (btn.classList.contains('remove-from-table')) this.unassignGuestFromTable(btn.dataset.guestId, btn.dataset.tableId);

            if (btn.classList.contains('theme-btn')) {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const prev = document.getElementById('invitation-preview');
                if (prev) prev.dataset.theme = btn.dataset.theme;
            }
        });

        // Checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.dataset.taskId) {
                StorageManager.updateTask(e.target.dataset.taskId, { completed: e.target.checked });
                this.updateGlobalStats();
                if (this.currentSection === 'tasks') this.renderTasks();
                else if (this.currentSection === 'dashboard') this.renderDashboard();
            }
        });
    },

    handleRouting() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        this.navigateTo(hash);
    },

    navigateTo(section) {
        this.currentSection = section;
        document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.section === section));
        const wrapper = document.getElementById('content-wrapper');
        const title = document.getElementById('page-title');

        if (title) title.textContent = section.charAt(0).toUpperCase() + section.slice(1);
        if (Templates[section] && wrapper) {
            wrapper.innerHTML = Templates[section]();
            // Ensure the newly added section is visible
            const newSection = wrapper.querySelector('.content-section');
            if (newSection) newSection.classList.add('active');

            const methodName = 'render' + section.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
            this[methodName]?.();
        }
        this.updateGlobalStats();
    },

    handleCloudUpdate(key) {
        // Redraw current section if it matches the updated data
        const sectionMap = {
            'wedding_tasks': 'tasks',
            'wedding_guests': 'guests',
            'wedding_expenses': 'budget',
            'wedding_vendors': 'vendors',
            'wedding_events': 'timeline',
            'wedding_tables': 'seating',
            'wedding_gifts': 'gifts',
            'wedding_songs': 'playlist',
            'wedding_wishes': 'wishes',
            'wedding_memories': 'memories',
            'wedding_settings': 'dashboard'
        };

        const affectedSection = sectionMap[key];
        if (affectedSection === this.currentSection || (affectedSection === 'dashboard' && this.currentSection === 'dashboard')) {
            this['render' + affectedSection.charAt(0).toUpperCase() + affectedSection.slice(1)]?.();
        }

        if (affectedSection === 'dashboard') {
            this.renderSidebar();
            this.startCountdown();
        }

        Utils.showToast('Actualizado desde la nube ☁️', 'info');
    },

    async handleJoinWedding() {
        const id = document.getElementById('wedding-id-input')?.value.trim();
        if (!id) return Utils.showToast('Introduce un código válido', 'error');

        if (confirm('¿Vincular a este código? Se descargarán los datos de la nube.')) {
            await StorageManager.setWeddingId(id);
            this.closeModal();
            this.navigateTo('dashboard');
            Utils.showToast('¡Sesión vinculada con éxito!', 'success');
        }
    },

    handleGenerateID() {
        const input = document.getElementById('wedding-id-input');
        if (input) {
            const randomID = 'BODA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            input.value = randomID;
        }
    },

    setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('PWA Install Candidate');
        });

        // Show banner after a delay regardless of event, to act as a guide
        setTimeout(() => {
            if (!sessionStorage.getItem('pwa-banner-dismissed')) {
                this.showInstallBanner();
            }
        }, 4000);

        window.addEventListener('appinstalled', (evt) => {
            console.log('App installed successfully');
            this.closeInstallBanner();
            Utils.showToast('¡App instalada con éxito!', 'success');
        });
    },

    showInstallBanner() {
        if (document.getElementById('pwa-install-banner')) return;

        const container = document.createElement('div');
        container.innerHTML = Templates.installBanner();
        document.body.appendChild(container.firstElementChild);

        setTimeout(() => {
            document.getElementById('pwa-install-banner')?.classList.add('show');
        }, 1000); // Wait 1s after load
    },

    async handleInstallPrompt() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            this.deferredPrompt = null;
        } else {
            // Fallback for iOS or cases where prompt isn't ready
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isIOS) {
                alert('Para instalar en iPhone: Pulsa el icono de "Compartir" (cuadradito con flecha) y luego "Añadir a la pantalla de inicio" 📲');
            } else {
                alert('Para instalar: Busca el icono de instalación (⬇️) en la barra de direcciones de tu navegador o en el menú de opciones.');
            }
        }
        this.closeInstallBanner();
    },

    closeInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 500);
            sessionStorage.setItem('pwa-banner-dismissed', 'true');
        }
    },

    renderExploreVendors() {
        document.getElementById('scout-query')?.focus();
    },

    async handleStartScout() {
        const query = document.getElementById('scout-query')?.value.trim();
        if (!query) return Utils.showToast('Dime qué tipo de proveedor buscas', 'warning');

        const resultsContainer = document.getElementById('scout-results');
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="rings-animation" style="transform: scale(0.5)">
                    <div class="ring ring-1"></div>
                    <div class="ring ring-2"></div>
                </div>
                <p>Mi IA está rastreando las mejores opciones para ti... 🕵️‍♂️✨</p>
            </div>`;

        try {
            const context = {
                settings: StorageManager.getSettings(),
                budget: Utils.calculateStats().budget
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Actúa como un Scout Experto de Proveedores de Bodas. 
                             El usuario busca: "${query}". 
                             Responde en formato JSON con un array de 3 objetos llamados "results".
                             Cada objeto debe tener: "name", "priceRange", "description", "tips" (array de 2 consejos), "whereToLook" (nombre de plataforma o web).
                             Sé realista con los precios según el presupuesto de la pareja: ${context.settings.totalBudget}€.`,
                    context: context,
                    format: 'json' // Le pedimos JSON para parsearlo
                })
            });

            const data = await response.json();

            // Si la IA no devolvió JSON puro, intentamos extraerlo o mostramos el texto
            let results = [];
            try {
                // Limpieza básica por si la IA añade markdown
                const jsonStr = data.response.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                results = parsed.results || [];
            } catch (e) {
                console.error("No se pudo parsear el JSON del Scout", e);
                resultsContainer.innerHTML = `<div class="card"><p>${data.response}</p></div>`;
                return;
            }

            if (results.length === 0) {
                resultsContainer.innerHTML = `<div class="empty-state"><p>No he encontrado resultados específicos. Intenta con otra búsqueda.</p></div>`;
                return;
            }

            resultsContainer.innerHTML = results.map(res => `
                <div class="scout-result-card">
                    <div class="scout-result-header">
                        <div class="scout-result-title">
                            <h3>${res.name}</h3>
                            <div class="scout-actions">
                                ${res.tips.map(tip => `<span class="scout-tag">💡 ${tip}</span>`).join('')}
                            </div>
                        </div>
                        <span class="scout-price-badge">${res.priceRange}</span>
                    </div>
                    <p class="scout-description">${res.description}</p>
                    <div class="scout-footer-info">
                        <strong>📍 Dónde buscar:</strong> ${res.whereToLook}
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Scout Error:', error);
            resultsContainer.innerHTML = `<div class="empty-state">⚠️ Error al conectar con el Scout. Por favor, inténtalo de nuevo.</div>`;
        }
    },

    // Renderings
    renderDashboard() {
        const stats = Utils.calculateStats();
        const grid = document.getElementById('stats-grid');
        if (grid) grid.innerHTML = `
            ${Templates.statCard('✅', `${stats.tasks.completed}/${stats.tasks.total}`, 'Tareas', (stats.tasks.completed / (stats.tasks.total || 1)) * 100, 'stat-tasks')}
            ${Templates.statCard('👥', `${stats.guests.confirmed}/${stats.guests.total}`, 'Invitados', (stats.guests.confirmed / (stats.guests.total || 1)) * 100, 'stat-guests')}
            ${Templates.statCard('💰', Utils.formatCurrency(stats.budget.spent), `de ${Utils.formatCurrency(stats.budget.total)}`, (stats.budget.spent / (stats.budget.total || 1)) * 100, 'stat-budget')}
        `;

        // Add listeners to stat cards
        document.getElementById('stat-tasks')?.addEventListener('click', () => this.navigateTo('tasks'));
        document.getElementById('stat-guests')?.addEventListener('click', () => this.navigateTo('guests'));
        document.getElementById('stat-budget')?.addEventListener('click', () => this.navigateTo('budget'));
        const s = StorageManager.getSettings();
        const dateDisp = document.getElementById('wedding-date-display');
        if (dateDisp && s.weddingDate) dateDisp.textContent = Utils.formatDate(s.weddingDate);

        const tasksList = document.getElementById('upcoming-tasks-list');
        if (tasksList) {
            const pending = StorageManager.getTasks().filter(t => !t.completed).slice(0, 3);
            tasksList.innerHTML = pending.length ? pending.map(t => Templates.taskItem(t)).join('') : '<p class="empty-state">No hay tareas pendientes</p>';
        }
    },

    renderTasks() {
        const tasks = StorageManager.getTasks();
        const list = document.getElementById('tasks-list');
        if (list) list.innerHTML = tasks.length ? tasks.map(t => Templates.taskItem(t)).join('') : '<p class="empty-state">Sin tareas</p>';
    },

    renderGuests() {
        const guests = StorageManager.getGuests();
        const tbody = document.getElementById('guests-tbody');
        if (tbody) tbody.innerHTML = guests.length ? guests.map(g => Templates.guestRow(g)).join('') : '<tr><td colspan="7" class="empty-state">Sin invitados</td></tr>';
    },

    renderBudget() {
        const stats = Utils.calculateStats().budget;
        const overview = document.getElementById('budget-overview');
        if (overview) overview.innerHTML = `
            <div class="budget-card"><h4>Gastado</h4><div class="budget-amount">${Utils.formatCurrency(stats.spent)}</div></div>
            <div class="budget-card"><h4>Disponible</h4><div class="budget-amount">${Utils.formatCurrency(stats.remaining)}</div></div>
        `;
        const list = document.getElementById('expenses-list');
        if (list) list.innerHTML = StorageManager.getExpenses().map(e => Templates.expenseItem(e)).join('') || '<p class="empty-state">Sin gastos</p>';
    },

    renderVendors() {
        const g = document.getElementById('vendors-grid');
        if (g) g.innerHTML = StorageManager.getVendors().map(v => Templates.vendorCard(v)).join('') || '<p class="empty-state">Sin proveedores</p>';
    },

    renderTimeline() {
        const c = document.getElementById('timeline-container');
        if (c) c.innerHTML = StorageManager.getEvents().sort((a, b) => Utils.timeToMinutes(a.startTime) - Utils.timeToMinutes(b.startTime)).map(e => Templates.timelineEvent(e)).join('') || '<p class="empty-state">Timeline vacío</p>';
    },

    renderSeating() {
        const grid = document.getElementById('seating-tables-grid');
        const unassignedList = document.getElementById('unassigned-guests-list');
        if (!grid || !unassignedList) return;

        const tables = StorageManager.getTables();
        const guests = StorageManager.getGuests().filter(g => g.status === 'confirmed');
        grid.innerHTML = tables.length ? tables.map(t => Templates.tableCard(t, guests.filter(g => t.guests?.includes(g.id)))).join('') : '<p class="empty-state">No hay mesas creadas</p>';
        const unassigned = guests.filter(g => !tables.some(t => t.guests?.includes(g.id)));
        unassignedList.innerHTML = unassigned.length ? unassigned.map(g => `<button class="unassigned-guest-item" data-id="${g.id}">${Utils.escapeHtml(g.name)} <span>➕</span></button>`).join('') : '<p class="empty-state">Todos asignados</p>';
    },

    renderGifts() {
        const g = document.getElementById('gifts-grid');
        if (g) g.innerHTML = StorageManager.getGifts().map(g => Templates.giftCard(g)).join('') || '<p class="empty-state">Sin regalos</p>';
    },

    renderCommunity() {
        // Handled by event delegation and Templates.community()
    },

    renderPlaylist() {
        const l = document.getElementById('songs-list');
        if (l) l.innerHTML = StorageManager.getSongs().map(s => Templates.songItem(s)).join('') || '<p class="empty-state">Sin canciones</p>';
    },

    renderWishes() {
        const w = document.getElementById('wishes-wall');
        if (w) w.innerHTML = StorageManager.getWishes().map(wish => Templates.wishCard(wish)).join('') || '<p class="empty-state">No hay mensajes todavía</p>';
    },

    renderMemories() {
        const m = document.getElementById('memories-grid');
        if (m) m.innerHTML = StorageManager.getMemories().map(mem => Templates.memoryCard(mem)).join('') || '<p class="empty-state">Muro vacío</p>';
    },

    renderInvitations() {
        const settings = StorageManager.getSettings();
        const container = document.getElementById('invitation-preview');
        if (container) {
            // Update preview with current settings
            const namesEl = container.querySelector('.inv-names');
            if (namesEl) namesEl.textContent = `${settings.partner1Name || 'Novio'} & ${settings.partner2Name || 'Novia'}`;

            const dateEl = container.querySelector('.inv-date');
            if (dateEl) dateEl.textContent = settings.weddingDate ? Utils.formatDate(settings.weddingDate) : 'Fecha por definir';

            const timeEl = container.querySelector('.inv-time');
            if (timeEl) timeEl.textContent = settings.weddingTime || '18:00';

            const venueEl = container.querySelector('.inv-venue');
            if (venueEl) venueEl.textContent = settings.venueName || 'Lugar por definir';
        }
    },

    // Modal
    showModal(type, data = null) {
        const container = document.getElementById('modal-container');
        if (container && Templates[type + 'Modal']) container.innerHTML = Templates[type + 'Modal'](data);
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        const container = document.getElementById('modal-container');
        if (container) container.innerHTML = '';
        document.body.style.overflow = '';
    },

    // Handlers
    handleSaveSettings() {
        const s = {
            partner1Name: document.getElementById('partner1-name')?.value,
            partner2Name: document.getElementById('partner2-name')?.value,
            weddingDate: document.getElementById('wedding-date')?.value,
            venueName: document.getElementById('venue-name')?.value,
            totalBudget: parseFloat(document.getElementById('total-budget')?.value) || 0
        };
        StorageManager.saveSettings(s);
        this.closeModal(); this.renderSidebar(); this.renderDashboard(); this.startCountdown();
    },

    handleSaveTask() {
        const t = { title: document.getElementById('task-title').value, category: document.getElementById('task-category').value, completed: false };
        const id = document.getElementById('task-id').value;
        id ? StorageManager.updateTask(id, t) : StorageManager.addTask(t);
        this.closeModal(); this.renderTasks();
    },

    handleSaveGuest() {
        const g = {
            name: document.getElementById('guest-name').value,
            email: document.getElementById('guest-email').value,
            phone: document.getElementById('guest-phone').value,
            group: document.getElementById('guest-group').value,
            plusOnes: parseInt(document.getElementById('guest-plus-ones').value) || 0,
            status: document.getElementById('guest-status').value
        };
        const id = document.getElementById('guest-id').value;
        id ? StorageManager.updateGuest(id, g) : StorageManager.addGuest(g);
        this.closeModal(); this.renderGuests();
    },

    handleSaveExpense() {
        const e = { description: document.getElementById('expense-description').value, amount: parseFloat(document.getElementById('expense-amount').value), date: new Date().toISOString() };
        const id = document.getElementById('expense-id').value;
        id ? StorageManager.updateExpense(id, e) : StorageManager.addExpense(e);
        this.closeModal(); this.renderBudget();
    },

    handleSaveVendor() {
        const v = {
            name: document.getElementById('vendor-name').value,
            category: document.getElementById('vendor-category').value,
            phone: document.getElementById('vendor-phone').value,
            email: document.getElementById('vendor-email').value
        };
        const id = document.getElementById('vendor-id').value;
        id ? StorageManager.updateVendor(id, v) : StorageManager.addVendor(v);
        this.closeModal(); this.renderVendors();
    },

    handleSaveEvent() {
        const e = { title: document.getElementById('event-title').value, startTime: document.getElementById('event-start').value };
        const id = document.getElementById('event-id').value;
        id ? StorageManager.updateEvent(id, e) : StorageManager.addEvent(e);
        this.closeModal(); this.renderTimeline();
    },

    handleSaveTable() {
        const t = { name: document.getElementById('table-name').value, capacity: parseInt(document.getElementById('table-capacity').value) };
        const id = document.getElementById('table-id').value;
        id ? StorageManager.updateTable(id, t) : StorageManager.addTable(t);
        this.closeModal(); this.renderSeating();
    },

    handleSaveGift() {
        const g = { title: document.getElementById('gift-title').value, price: document.getElementById('gift-price').value, url: document.getElementById('gift-url').value };
        const id = document.getElementById('gift-id').value;
        id ? StorageManager.updateGift(id, g) : StorageManager.addGift(g);
        this.closeModal(); this.renderGifts();
    },

    handleSaveSong() {
        StorageManager.addSong({ title: document.getElementById('song-title').value, artist: document.getElementById('song-artist').value, guestName: document.getElementById('song-guest').value, moment: document.getElementById('song-moment').value });
        this.closeModal(); this.renderPlaylist(); Utils.showToast('¡Canción añadida!', 'success');
    },

    handleSaveWish() {
        const w = { author: document.getElementById('wish-author').value, message: document.getElementById('wish-message').value };
        if (!w.message) return Utils.showToast('El mensaje es obligatorio', 'error');
        StorageManager.addWish(w);
        this.closeModal(); this.renderWishes(); Utils.showToast('¡Mensaje enviado!', 'success');
    },

    handleSaveMemory() {
        const m = { author: document.getElementById('memory-author').value, imageUrl: document.getElementById('memory-url').value, caption: document.getElementById('memory-caption').value };
        if (!m.imageUrl || !m.caption) return Utils.showToast('La imagen y descripción son obligatorias', 'error');
        StorageManager.addMemory(m);
        this.closeModal(); this.renderMemories(); Utils.showToast('¡Recuerdo compartido!', 'success');
    },

    assignGuestToTable(tableId) {
        const guest = StorageManager.getGuests().filter(g => g.status === 'confirmed' && !StorageManager.getTables().some(t => t.guests?.includes(g.id)))[0];
        if (!guest) return Utils.showToast('No hay invitados confirmados libres', 'warning');
        const tables = StorageManager.getTables();
        const table = tables.find(t => t.id === tableId);
        if (!table.guests) table.guests = [];
        table.guests.push(guest.id);
        StorageManager.updateTable(tableId, { guests: table.guests });
        this.renderSeating();
    },

    unassignGuestFromTable(guestId, tableId) {
        const tables = StorageManager.getTables();
        const t = tables.find(table => table.id === tableId);
        if (t) {
            t.guests = t.guests.filter(id => id !== guestId);
            StorageManager.updateTable(tableId, { guests: t.guests });
            this.renderSeating();
        }
    },

    renderSidebar() {
        const s = StorageManager.getSettings();
        const coupleNames = document.querySelector('.couple-names');
        if (coupleNames && s.partner1Name) coupleNames.textContent = `${s.partner1Name} & ${s.partner2Name || '?'}`;
    },

    updateGlobalStats() {
        const stats = Utils.calculateStats();
        const badge = document.getElementById('pending-tasks-badge');
        if (badge) {
            badge.textContent = stats.tasks.pending;
            badge.style.display = stats.tasks.pending > 0 ? 'inline-block' : 'none';
        }

        const miniDays = document.querySelector('.countdown-days');
        const settings = StorageManager.getSettings();
        if (miniDays && settings.weddingDate) {
            const days = Utils.daysUntil(settings.weddingDate);
            miniDays.textContent = days !== null ? (days > 0 ? days : 0) : '---';
        }
    },

    startCountdown() {
        const s = StorageManager.getSettings();
        if (!s.weddingDate) return;
        if (this.countdownInterval) clearInterval(this.countdownInterval);

        const upd = () => {
            const diff = new Date(s.weddingDate).getTime() - new Date().getTime();
            if (diff <= 0) return;

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minsEl = document.getElementById('minutes');
            const secsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = Math.floor(diff / 86400000).toString().padStart(3, '0');
            if (hoursEl) hoursEl.textContent = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
            if (minsEl) minsEl.textContent = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            if (secsEl) secsEl.textContent = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        };

        upd();
        this.countdownInterval = setInterval(upd, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
