// HTML Templates for Wedding Planner AI

const Templates = {
    // Dashboard Section
    dashboard() {
        return `
            <section id="dashboard" class="content-section active">
                <div class="countdown-hero">
                    <div class="countdown-bg-decoration">
                        <div class="floating-hearts">
                            <span class="heart">💕</span><span class="heart">🤍</span>
                            <span class="heart">💖</span><span class="heart">💗</span><span class="heart">🤍</span>
                        </div>
                    </div>
                    <div class="countdown-content">
                        <h2 class="countdown-title">Cuenta Regresiva</h2>
                        <div class="countdown-timer" id="countdown-timer">
                            <div class="countdown-item"><span class="countdown-value" id="days">000</span><span class="countdown-unit">Días</span></div>
                            <div class="countdown-separator">:</div>
                            <div class="countdown-item"><span class="countdown-value" id="hours">00</span><span class="countdown-unit">Horas</span></div>
                            <div class="countdown-separator">:</div>
                            <div class="countdown-item"><span class="countdown-value" id="minutes">00</span><span class="countdown-unit">Min</span></div>
                            <div class="countdown-separator">:</div>
                            <div class="countdown-item"><span class="countdown-value" id="seconds">00</span><span class="countdown-unit">Seg</span></div>
                        </div>
                        <p class="wedding-date" id="wedding-date-display">Configura tu fecha de boda ⚙️</p>
                    </div>
                </div>
                <div class="stats-grid" id="stats-grid"></div>
                <div class="dashboard-grid">
                    <div class="dashboard-card"><div class="card-header"><h3>📋 Próximas Tareas</h3><a href="#tasks" class="see-all-link nav-trigger" data-section="tasks">Ver todas →</a></div><div class="card-content" id="upcoming-tasks-list"><p class="empty-state">No hay tareas pendientes</p></div></div>
                    <div class="dashboard-card"><div class="card-header"><h3>⚡ Acciones Rápidas</h3></div><div class="card-content quick-actions-grid">
                        <button class="quick-action-btn" data-action="add-task"><span class="action-icon">➕</span><span class="action-text">Nueva Tarea</span></button>
                        <button class="quick-action-btn" data-action="add-guest"><span class="action-icon">👤</span><span class="action-text">Añadir Invitado</span></button>
                        <button class="quick-action-btn" data-action="add-expense"><span class="action-icon">💳</span><span class="action-text">Nuevo Gasto</span></button>
                        <button class="quick-action-btn" data-action="add-vendor"><span class="action-icon">🏢</span><span class="action-text">Nuevo Proveedor</span></button>
                    </div></div>
                </div>
            </section>`;
    },

    // Tasks Section
    tasks() {
        return `
            <section id="tasks" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Lista de Tareas</h2><p class="section-subtitle">Organiza todas las tareas para tu boda perfecta</p></div>
                    <button id="add-task-btn" class="primary-btn"><span>➕</span> Nueva Tarea</button>
                </div>
                <div id="tasks-list" class="tasks-list"></div>
            </section>`;
    },

    // Guests Section
    guests() {
        return `
            <section id="guests" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Lista de Invitados</h2><p class="section-subtitle">Gestiona tus invitados y sus confirmaciones</p></div>
                    <div class="header-actions">
                        <button id="export-guests-btn" class="secondary-btn"><span>📤</span> Exportar</button>
                        <button id="add-guest-btn" class="primary-btn"><span>➕</span> Nuevo Invitado</button>
                    </div>
                </div>
                <div class="guests-table-container"><table class="guests-table"><thead><tr>
                    <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Grupo</th><th>+1</th><th>Estado</th><th>Acciones</th>
                </tr></thead><tbody id="guests-tbody"></tbody></table></div>
            </section>`;
    },

    // Budget Section  
    budget() {
        return `
            <section id="budget" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Control de Presupuesto</h2><p class="section-subtitle">Gestiona los gastos de tu boda</p></div>
                    <button id="add-expense-btn" class="primary-btn"><span>➕</span> Nuevo Gasto</button>
                </div>
                <div class="budget-overview" id="budget-overview"></div>
                <div class="expenses-list" id="expenses-list"></div>
            </section>`;
    },

    // Vendors Section
    vendors() {
        return `
            <section id="vendors" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Directorio de Proveedores</h2><p class="section-subtitle">Gestiona todos los servicios para tu boda</p></div>
                    <div class="header-actions">
                        <button id="scout-vendors-btn" class="secondary-btn nav-trigger" data-section="explore-vendors"><span>🔍</span> Buscar con IA</button>
                        <button id="add-vendor-btn" class="primary-btn"><span>➕</span> Nuevo Proveedor</button>
                    </div>
                </div>
                <div class="vendors-grid" id="vendors-grid"></div>
            </section>`;
    },

    'explore-vendors'() {
        return `
            <section id="explore-vendors" class="content-section">
                <div class="section-header">
                    <div class="section-title-group">
                        <a href="#vendors" class="back-link nav-trigger" data-section="vendors">← Volver a Directorio</a>
                        <h2>Scout de Proveedores AI</h2>
                        <p class="section-subtitle">Dime qué buscas y lo encontraré por ti</p>
                    </div>
                </div>

                <div class="scout-search-container card">
                    <div class="scout-input-wrapper">
                        <input type="text" id="scout-query" class="form-input" placeholder="Ej: Fotógrafos rústicos en Madrid, catering vegano en Valencia...">
                        <button id="start-scout-btn" class="primary-btn">Comenzar Búsqueda Inteligente 🚀</button>
                    </div>
                    <p class="scout-hint">Usaré mi conocimiento global para recomendarte estilos, precios medios y dónde buscar las mejores opciones reales.</p>
                </div>

                <div id="scout-results" class="scout-results-container">
                    <!-- Resultados de la IA aquí -->
                    <div class="empty-state">
                        <p>Escribe arriba lo que necesitas para empezar el rastreo...</p>
                    </div>
                </div>
            </section>`;
    },

    // Timeline Section
    timeline() {
        return `
            <section id="timeline" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Cronograma del Día</h2><p class="section-subtitle">Planifica cada momento de tu día especial</p></div>
                    <button id="add-event-btn" class="primary-btn"><span>➕</span> Nuevo Evento</button>
                </div>
                <div class="timeline-container" id="timeline-container"></div>
            </section>`;
    },

    // Seating Section
    seating() {
        return `
            <section id="seating" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Distribución de Mesas</h2><p class="section-subtitle">Organiza dónde se sentará cada invitado</p></div>
                    <button id="add-table-btn" class="primary-btn"><span>➕</span> Nueva Mesa</button>
                </div>
                <div class="seating-layout">
                    <div class="seating-tables" id="seating-tables-grid"></div>
                    <div class="unassigned-guests">
                        <h3>👥 Invitados sin asignar</h3>
                        <div class="unassigned-list" id="unassigned-guests-list"></div>
                    </div>
                </div>
            </section>`;
    },

    // Invitations Section
    invitations() {
        const settings = StorageManager.getSettings();
        return `
            <section id="invitations" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Generador de Invitaciones</h2><p class="section-subtitle">Diseña y previsualiza tu invitación digital</p></div>
                </div>
                <div class="invitation-tool-grid">
                    <div class="invitation-preview-container">
                        <div class="invitation-card-preview" id="invitation-preview" data-theme="elegant">
                            <div class="invitation-inner">
                                <div class="inv-header">¡Nos Casamos!</div>
                                <div class="inv-names">${Utils.escapeHtml(settings.partner1Name || 'Novio')} & ${Utils.escapeHtml(settings.partner2Name || 'Novia')}</div>
                                <div class="inv-divider">💍</div>
                                <div class="inv-date">${settings.weddingDate ? Utils.formatDate(settings.weddingDate) : 'Fecha por definir'}</div>
                                <div class="inv-time">${settings.weddingTime || '18:00'}</div>
                                <div class="inv-venue">${Utils.escapeHtml(settings.venueName || 'Lugar por definir')}</div>
                                <div class="inv-footer">Estamos deseando compartir este día con vosotros</div>
                            </div>
                        </div>
                    </div>
                    <div class="invitation-controls">
                        <div class="control-group">
                            <label>Elegir Estilo</label>
                            <div class="theme-selector">
                                <button class="theme-btn active" data-theme="elegant">✨ Elegante</button>
                                <button class="theme-btn" data-theme="romantic">🌸 Romántico</button>
                                <button class="theme-btn" data-theme="modern">🏢 Moderno</button>
                                <button class="theme-btn" data-theme="classic">📜 Clásico</button>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Contenido Adicional</label>
                            <textarea id="invitation-custom-msg" class="form-input" placeholder="Añade un mensaje personal..."></textarea>
                        </div>
                        <button class="primary-btn w-100" id="download-invitation-btn">📸 Descargar Imagen</button>
                    </div>
                </div>
            </section>`;
    },

    // Gifts Section
    gifts() {
        return `
            <section id="gifts" class="content-section">
                <div class="section-header">
                    <div class="section-title-group"><h2>Lista de Regalos</h2><p class="section-subtitle">Gestiona tus ideas de regalo para los invitados</p></div>
                    <button id="add-gift-btn" class="primary-btn"><span>➕</span> Nuevo Regalo</button>
                </div>
                <div class="gifts-grid" id="gifts-grid"></div>
            </section>`;
    },

    // Playlist Section
    playlist() {
        return `
            <section id="playlist" class="content-section">
                <div class="section-header">
                    <div class="section-title-group">
                        <a href="#community" class="back-link nav-trigger" data-section="community">← Volver a Comunidad</a>
                        <h2>Playlist Colaborativa</h2>
                        <p class="section-subtitle">Canciones sugeridas por los invitados</p>
                    </div>
                    <button id="add-song-btn" class="primary-btn"><span>➕</span> Sugerir Canción</button>
                </div>
                <div class="playlist-container">
                    <div class="playlist-header-row">
                        <span>Canción / Artista</span><span>Sugerida por</span><span>Momento</span><span></span>
                    </div>
                    <div id="songs-list" class="songs-list"></div>
                </div>
            </section>`;
    },

    // Wishes (Guest Book) Section
    wishes() {
        return `
            <section id="wishes" class="content-section">
                <div class="section-header">
                    <div class="section-title-group">
                        <a href="#community" class="back-link nav-trigger" data-section="community">← Volver a Comunidad</a>
                        <h2>Libro de Visitas</h2>
                        <p class="section-subtitle">Tus invitados os dejan sus mejores deseos</p>
                    </div>
                    <button id="add-wish-btn" class="primary-btn"><span>✍️</span> Dejar Mensaje</button>
                </div>
                <div class="wishes-wall" id="wishes-wall"></div>
            </section>`;
    },

    community() {
        return `
            <section id="community" class="content-section">
                <div class="section-header">
                    <div class="section-title-group">
                        <h2>Zona de Interacción</h2>
                        <p class="section-subtitle">Lo que tus invitados están compartiendo</p>
                    </div>
                </div>
                
                <div class="community-grid">
                    <div class="community-card nav-trigger" data-section="playlist">
                        <div class="comm-card-icon">🎵</div>
                        <div class="comm-card-content">
                            <h3>Playlist</h3>
                            <p>Canciones sugeridas por los invitados para la fiesta.</p>
                            <span class="comm-card-link">Ver lista →</span>
                        </div>
                    </div>
                    
                    <div class="community-card nav-trigger" data-section="wishes">
                        <div class="comm-card-icon">✍️</div>
                        <div class="comm-card-content">
                            <h3>Libro de Visitas</h3>
                            <p>Mensajes y mejores deseos de tus seres queridos.</p>
                            <span class="comm-card-link">Leer mensajes →</span>
                        </div>
                    </div>
                    
                    <div class="community-card nav-trigger" data-section="memories">
                        <div class="comm-card-icon">📸</div>
                        <div class="comm-card-content">
                            <h3>Muro de Recuerdos</h3>
                            <p>Fotos y momentos capturados durante los preparativos.</p>
                            <span class="comm-card-link">Ver fotos →</span>
                        </div>
                    </div>
                </div>
            </section>`;
    },

    memories() {
        return `
            <section id="memories" class="content-section">
                <div class="section-header">
                    <div class="section-title-group">
                        <a href="#community" class="back-link nav-trigger" data-section="community">← Volver a Comunidad</a>
                        <h2>Muro de Recuerdos</h2>
                        <p class="section-subtitle">Captura y comparte los mejores momentos de la boda</p>
                    </div>
                    <button id="add-memory-btn" class="primary-btn"><span>📸</span> Compartir Momento</button>
                </div>
                <div class="memories-grid" id="memories-grid"></div>
            </section>`;
    },

    // Simple Components
    statCard(icon, value, label, progress = null, id = '') {
        return `
            <div class="stat-card" ${id ? `id="${id}"` : ''}>
                <div class="stat-icon">${icon}</div>
                <div class="stat-info"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>
                ${progress !== null ? `<div class="stat-progress"><div class="progress-bar" style="width: ${progress}%"></div></div>` : ''}
            </div>`;
    },

    taskItem(task) {
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox"><input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}"><span class="checkmark"></span></div>
                <div class="task-content"><span class="task-title">${Utils.escapeHtml(task.title)}</span></div>
                <div class="task-actions">
                    <button class="icon-btn-sm edit-task" data-id="${task.id}">✏️</button>
                    <button class="icon-btn-sm delete-task" data-id="${task.id}">🗑️</button>
                </div>
            </div>`;
    },

    guestRow(guest) {
        return `
            <tr data-id="${guest.id}">
                <td><strong>${Utils.escapeHtml(guest.name)}</strong></td>
                <td>${Utils.escapeHtml(guest.email || '-')}</td>
                <td>${Utils.escapeHtml(guest.phone || '-')}</td>
                <td>${Utils.getGroupLabel(guest.group)}</td>
                <td>${guest.plusOnes || 0}</td>
                <td><span class="status-badge ${guest.status}">${guest.status === 'confirmed' ? '✅' : '⏳'} ${guest.status}</span></td>
                <td class="actions-cell">
                    <button class="icon-btn-sm edit-guest" data-id="${guest.id}">✏️</button>
                    <button class="icon-btn-sm delete-guest" data-id="${guest.id}">🗑️</button>
                </td>
            </tr>`;
    },

    expenseItem(expense) {
        return `
            <div class="expense-item" data-id="${expense.id}">
                <div class="expense-info"><span class="expense-desc">${Utils.escapeHtml(expense.description)}</span><span class="expense-date">${Utils.formatShortDate(expense.date)}</span></div>
                <span class="expense-amount">${Utils.formatCurrency(expense.amount)}</span>
                <div class="expense-actions">
                    <button class="icon-btn-sm edit-expense" data-id="${expense.id}">✏️</button>
                    <button class="icon-btn-sm delete-expense" data-id="${expense.id}">🗑️</button>
                </div>
            </div>`;
    },

    vendorCard(vendor) {
        return `
            <div class="vendor-card" data-id="${vendor.id}">
                <div class="vendor-name">${Utils.escapeHtml(vendor.name)}</div>
                <div class="vendor-info">
                    ${vendor.phone ? `<p>📞 ${Utils.escapeHtml(vendor.phone)}</p>` : ''}
                </div>
                <div class="vendor-actions">
                    <button class="secondary-btn-sm edit-vendor" data-id="${vendor.id}">✏️</button>
                    <button class="icon-btn-sm delete-vendor" data-id="${vendor.id}">🗑️</button>
                </div>
            </div>`;
    },

    timelineEvent(event) {
        return `
            <div class="timeline-event" data-id="${event.id}">
                <div class="event-time">${event.startTime}</div>
                <div class="event-title">${Utils.escapeHtml(event.title)}</div>
                <div class="event-actions">
                    <button class="icon-btn-sm edit-event" data-id="${event.id}">✏️</button>
                    <button class="icon-btn-sm delete-event" data-id="${event.id}">🗑️</button>
                </div>
            </div>`;
    },

    tableCard(table, assignedGuests) {
        return `
            <div class="table-card" data-id="${table.id}">
                <div class="table-header"><div class="table-name">${Utils.escapeHtml(table.name)}</div><button class="icon-btn-sm delete-table" data-id="${table.id}">🗑️</button></div>
                <div class="table-guest-list">
                    ${assignedGuests.map(g => `<div class="assigned-guest-item"><span>${Utils.escapeHtml(g.name)}</span><button class="remove-from-table" data-guest-id="${g.id}" data-table-id="${table.id}">×</button></div>`).join('')}
                </div>
                <button class="secondary-btn-sm add-to-table-btn" data-table-id="${table.id}">➕ Añadir</button>
            </div>`;
    },

    giftCard(gift) {
        return `
            <div class="gift-card" data-id="${gift.id}">
                <div class="gift-icon">🎁</div>
                <div class="gift-info">
                    <div class="gift-title">${Utils.escapeHtml(gift.title)}</div>
                    <div class="gift-price">${Utils.formatCurrency(gift.price)}</div>
                    ${gift.url ? `<a href="${gift.url}" target="_blank" class="gift-link">Ver enlace 🔗</a>` : ''}
                </div>
                <div class="gift-actions">
                    <button class="icon-btn-sm edit-gift" data-id="${gift.id}">✏️</button>
                    <button class="icon-btn-sm delete-gift" data-id="${gift.id}">🗑️</button>
                </div>
            </div>`;
    },

    songItem(song) {
        return `
            <div class="song-item" data-id="${song.id}">
                <div class="song-text"><span class="song-title">${Utils.escapeHtml(song.title)}</span><span class="song-artist">${Utils.escapeHtml(song.artist)}</span></div>
                <div class="song-guest">${Utils.escapeHtml(song.guestName || 'Anónimo')}</div>
                <div class="song-moment"><span class="moment-tag">${song.moment || 'Fiesta'}</span></div>
                <div class="song-actions"><button class="icon-btn-sm delete-song" data-id="${song.id}">🗑️</button></div>
            </div>`;
    },

    wishCard(wish) {
        return `
            <div class="wish-card" data-id="${wish.id}">
                <div class="wish-decoration">❝</div>
                <div class="wish-text">${Utils.escapeHtml(wish.message)}</div>
                <div class="wish-footer">
                    <div class="wish-author">— ${Utils.escapeHtml(wish.author || 'Anónimo')}</div>
                    <button class="delete-wish icon-btn-sm" data-id="${wish.id}">🗑️</button>
                </div>
            </div>`;
    },

    memoryCard(memory) {
        return `
            <div class="memory-card" data-id="${memory.id}">
                <div class="memory-image-wrapper">
                    <img src="${memory.imageUrl}" alt="Memory" class="memory-image" onerror="this.src='https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop'">
                </div>
                <div class="memory-content">
                    <p class="memory-text">${Utils.escapeHtml(memory.caption)}</p>
                    <div class="memory-footer">
                        <span class="memory-author">Por: ${Utils.escapeHtml(memory.author || 'Invitado')}</span>
                        <button class="delete-memory icon-btn-sm" data-id="${memory.id}">🗑️</button>
                    </div>
                </div>
            </div>`;
    },

    // Modals
    settingsModal() {
        const s = StorageManager.getSettings();
        const weddingId = StorageManager.weddingId;
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>⚙️ Configuración</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <div class="settings-section">
                    <h3>💍 Datos de la Pareja</h3>
                    <div class="form-group"><label>Nombre del Novio/a 1</label><input type="text" id="partner1-name" class="form-input" value="${Utils.escapeHtml(s.partner1Name || '')}"></div>
                    <div class="form-group"><label>Nombre del Novio/a 2</label><input type="text" id="partner2-name" class="form-input" value="${Utils.escapeHtml(s.partner2Name || '')}"></div>
                    <div class="form-row">
                        <div class="form-group"><label>Fecha</label><input type="date" id="wedding-date" class="form-input" value="${s.weddingDate || ''}"></div>
                        <div class="form-group"><label>Hora</label><input type="time" id="wedding-time" class="form-input" value="${s.weddingTime || ''}"></div>
                    </div>
                    <div class="form-group"><label>Lugar</label><input type="text" id="venue-name" class="form-input" value="${Utils.escapeHtml(s.venueName || '')}"></div>
                    <div class="form-group"><label>Presupuesto Total (€)</label><input type="number" id="total-budget" class="form-input" value="${s.totalBudget || ''}"></div>
                </div>

                <div class="settings-section sync-section">
                    <h3>🔄 Sincronización en Pareja</h3>
                    <p class="settings-hint">Utiliza este código en otro dispositivo para compartir los datos de vuestra boda.</p>
                    <div class="sync-id-box">
                        <label>Vuestro Código Único</label>
                        <div class="sync-input-group">
                            <input type="text" id="wedding-id-input" class="form-input" value="${weddingId || ''}" placeholder="Ej: BODA-2026-X">
                            <button id="join-wedding-btn" class="secondary-btn-sm">${weddingId ? 'Vincular Nuevo' : 'Vincular'}</button>
                        </div>
                        ${!weddingId ? '<button id="generate-id-btn" class="text-btn">Generar código aleatorio</button>' : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-settings-btn" class="primary-btn">💾 Guardar Configuración</button></div>
        </div></div>`;
    },

    taskModal(task = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${task ? '✏️ Editar' : '➕ Nueva'} Tarea</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="task-id" value="${task?.id || ''}">
                <div class="form-group"><label>Título *</label><input type="text" id="task-title" class="form-input" value="${Utils.escapeHtml(task?.title || '')}" required></div>
                <div class="form-row">
                    <div class="form-group"><label>Categoría</label><select id="task-category" class="form-input">
                        <option value="venue" ${task?.category === 'venue' ? 'selected' : ''}>📍 Lugar</option>
                        <option value="other" selected>📦 Otros</option>
                    </select></div>
                    <div class="form-group"><label>Prioridad</label><div class="priority-selector">
                        <label><input type="radio" name="task-priority" value="medium" checked> Media</label>
                    </div></div>
                </div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-task-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    guestModal(guest = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${guest ? '✏️ Editar' : '➕ Nuevo'} Invitado</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="guest-id" value="${guest?.id || ''}">
                <div class="form-group"><label>Nombre *</label><input type="text" id="guest-name" class="form-input" value="${Utils.escapeHtml(guest?.name || '')}" required></div>
                <div class="form-row">
                    <div class="form-group"><label>Email</label><input type="email" id="guest-email" class="form-input" value="${Utils.escapeHtml(guest?.email || '')}"></div>
                    <div class="form-group"><label>Teléfono</label><input type="tel" id="guest-phone" class="form-input" value="${Utils.escapeHtml(guest?.phone || '')}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Grupo</label><select id="guest-group" class="form-input">
                        ${Object.entries(Utils.groupLabels).map(([val, label]) => `<option value="${val}" ${guest?.group === val ? 'selected' : ''}>${label}</option>`).join('')}
                    </select></div>
                    <div class="form-group"><label>Acompañantes (+1)</label><input type="number" id="guest-plus-ones" class="form-input" value="${guest?.plusOnes || 0}"></div>
                </div>
                <div class="form-group"><label>Estado</label><select id="guest-status" class="form-input">
                    <option value="pending" ${!guest || guest?.status === 'pending' ? 'selected' : ''}>⏳ Pendiente</option>
                    <option value="confirmed" ${guest?.status === 'confirmed' ? 'selected' : ''}>✅ Confirmado</option>
                    <option value="declined" ${guest?.status === 'declined' ? 'selected' : ''}>❌ Declinado</option>
                </select></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-guest-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    expenseModal(expense = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${expense ? '✏️ Editar' : '➕ Nuevo'} Gasto</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="expense-id" value="${expense?.id || ''}">
                <div class="form-group"><label>Descripción *</label><input type="text" id="expense-description" class="form-input" value="${Utils.escapeHtml(expense?.description || '')}" required></div>
                <div class="form-group"><label>Importe (€) *</label><input type="number" id="expense-amount" class="form-input" value="${expense?.amount || ''}" required></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-expense-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    vendorModal(vendor = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${vendor ? '✏️ Editar' : '➕ Nuevo'} Proveedor</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="vendor-id" value="${vendor?.id || ''}">
                <div class="form-group"><label>Nombre del Proveedor *</label><input type="text" id="vendor-name" class="form-input" value="${Utils.escapeHtml(vendor?.name || '')}" required></div>
                <div class="form-group"><label>Servicio / Categoría</label><select id="vendor-category" class="form-input">
                    ${Object.entries(Utils.categoryIcons).map(([val, label]) => `<option value="${val}" ${vendor?.category === val ? 'selected' : ''}>${label}</option>`).join('')}
                </select></div>
                <div class="form-row">
                    <div class="form-group"><label>Teléfono</label><input type="tel" id="vendor-phone" class="form-input" value="${Utils.escapeHtml(vendor?.phone || '')}"></div>
                    <div class="form-group"><label>Email</label><input type="email" id="vendor-email" class="form-input" value="${Utils.escapeHtml(vendor?.email || '')}"></div>
                </div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-vendor-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    eventModal(event = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${event ? '✏️ Editar' : '➕ Nuevo'} Evento</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="event-id" value="${event?.id || ''}">
                <div class="form-group"><label>Título *</label><input type="text" id="event-title" class="form-input" value="${Utils.escapeHtml(event?.title || '')}" required></div>
                <div class="form-group"><label>Hora inicio *</label><input type="time" id="event-start" class="form-input" value="${event?.startTime || ''}" required></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-event-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    tableModal(table = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${table ? '✏️ Editar' : '➕ Nueva'} Mesa</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="table-id" value="${table?.id || ''}">
                <div class="form-group"><label>Nombre Mesa *</label><input type="text" id="table-name" class="form-input" value="${Utils.escapeHtml(table?.name || '')}" required></div>
                <div class="form-group"><label>Capacidad</label><input type="number" id="table-capacity" class="form-input" value="${table?.capacity || 8}"></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-table-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    giftModal(gift = null) {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>${gift ? '✏️ Editar' : '➕ Nuevo'} Regalo</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <input type="hidden" id="gift-id" value="${gift?.id || ''}">
                <div class="form-group"><label>Regalo *</label><input type="text" id="gift-title" class="form-input" value="${Utils.escapeHtml(gift?.title || '')}" required></div>
                <div class="form-group"><label>Precio aprox</label><input type="number" id="gift-price" class="form-input" value="${gift?.price || ''}"></div>
                <div class="form-group"><label>URL enlace</label><input type="url" id="gift-url" class="form-input" value="${Utils.escapeHtml(gift?.url || '')}"></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-gift-btn" class="primary-btn">💾 Guardar</button></div>
        </div></div>`;
    },

    songModal() {
        return `<div class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>🎵 Sugerir Canción</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <div class="form-group"><label>Canción *</label><input type="text" id="song-title" class="form-input" required></div>
                <div class="form-group"><label>Artista *</label><input type="text" id="song-artist" class="form-input" required></div>
                <div class="form-row">
                    <div class="form-group"><label>Tu Nombre</label><input type="text" id="song-guest" class="form-input"></div>
                    <div class="form-group"><label>Momento</label><select id="song-moment" class="form-input">
                        <option value="Cóctel">🥂 Cóctel</option><option value="Banquete">🍽️ Banquete</option><option value="Baile" selected>🎉 Fiesta</option>
                    </select></div>
                </div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-song-btn" class="primary-btn">🎵 Añadir</button></div>
        </div></div>`;
    },

    wishModal() {
        return `<div id="wish-modal" class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>✍️ Deja un mensaje</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <div class="form-group"><label>Tu Nombre</label><input type="text" id="wish-author" class="form-input" placeholder="Tu nombre..."></div>
                <div class="form-group"><label>Mensaje para la pareja *</label><textarea id="wish-message" class="form-input form-textarea" placeholder="¡Que seáis muy felices!..." required></textarea></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-wish-btn" class="primary-btn">💖 Enviar Mensaje</button></div>
        </div></div>`;
    },

    memoryModal() {
        return `<div id="memory-modal" class="modal open"><div class="modal-overlay"></div><div class="modal-content">
            <div class="modal-header"><h2>📸 Compartir un recuerdo</h2><button class="modal-close">×</button></div>
            <div class="modal-body">
                <div class="form-group"><label>Tu Nombre</label><input type="text" id="memory-author" class="form-input" placeholder="¿Quién lo comparte?"></div>
                <div class="form-group"><label>URL de la Imagen *</label><input type="url" id="memory-url" class="form-input" placeholder="https://..." required></div>
                <div class="form-group"><label>Descripción / Anécdota *</label><textarea id="memory-caption" class="form-input form-textarea" placeholder="¡Qué gran momento!..." required></textarea></div>
            </div>
            <div class="modal-footer"><button class="secondary-btn modal-cancel">Cancelar</button><button id="save-memory-btn" class="primary-btn">📸 Publicar Recuerdo</button></div>
        </div></div>`;
    },

    // Chat Widget
    chatWidget() {
        return `
            <div class="chat-widget">
                <div class="chat-window" id="chat-window">
                    <div class="chat-header">
                        <div class="chat-title">
                            <span class="chat-avatar">🤖</span>
                            <div>
                                <h3>Asistente de Boda</h3>
                                <span class="status-dot"></span> <small>En línea</small>
                            </div>
                        </div>
                        <button id="chat-close-btn" class="chat-control-btn">×</button>
                    </div>
                    <div class="chat-body" id="chat-messages">
                        <div class="chat-message bot">
                            <div class="message-content">
                                ¡Hola! Soy tu Wedding Planner AI. 💍<br>
                                ¿En qué puedo ayudarte hoy?
                            </div>
                            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>
                    <div class="chat-footer">
                        <div class="chat-input-group">
                            <input type="text" id="chat-input" placeholder="Escribe tu duda..." autocomplete="off">
                            <button id="chat-send-btn" class="send-btn">➤</button>
                        </div>
                    </div>
                </div>
                <button id="chat-toggle-btn" class="chat-toggle-btn">
                    <span class="btn-icon">💬</span>
                </button>
            </div>
        `;
    },

    installBanner() {
        return `
            <div id="pwa-install-banner" class="install-banner">
                <div class="install-content">
                    <span class="install-icon">📱</span>
                    <div class="install-text">
                        <h4>Lleva vuestra boda en el bolsillo</h4>
                        <p>Instala la App para acceso rápido y offline.</p>
                    </div>
                </div>
                <div class="install-actions">
                    <button id="pwa-install-btn" class="primary-btn-sm">Instalar</button>
                    <button id="pwa-close-btn" class="close-x">×</button>
                </div>
            </div>
        `;
    }
};
