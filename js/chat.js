/**
 * Wedding Planner AI - Chat Widget Logic
 * Handles the UI interactions for the chat assistant.
 */

const ChatWidget = {
    isOpen: false,

    init() {
        this.render();
        this.setupListeners();
    },

    render() {
        const container = document.getElementById('chat-container');
        if (container && Templates.chatWidget) {
            container.innerHTML = Templates.chatWidget();
        }
    },

    setupListeners() {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const closeBtn = document.getElementById('chat-close-btn');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');

        if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggleChat());
        if (closeBtn) closeBtn.addEventListener('click', () => this.toggleChat());

        if (sendBtn) sendBtn.addEventListener('click', () => this.handleSend());
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSend();
            });
        }
    },

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWin = document.getElementById('chat-window');
        const toggleBtn = document.getElementById('chat-toggle-btn');

        if (chatWin) {
            chatWin.classList.toggle('open', this.isOpen);
        }

        // Mobile optimization: Lock body scroll when chat is open on small screens
        if (window.innerWidth <= 480 && this.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },

    handleSend() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Add User Message
        this.addMessage(message, 'user');
        input.value = '';

        // Simulate Bot Response (Mock)
        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            this.generateMockResponse(message);
        }, 1500);
    },

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(text)}</div>
            <div class="message-time">${time}</div>
        `;

        messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
    },

    formatMessage(text) {
        if (!text) return '';

        let formatted = text;

        // Convert Markdown bold (**text**) to HTML (<b>text</b>)
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

        // Convert Markdown italic (*text*) to HTML (<i>text</i>)
        formatted = formatted.replace(/\*(.*?)\*/g, '<i>$1</i>');

        // Handle lists in Markdown style (- or *) if AI uses them
        formatted = formatted.replace(/^\s*[-*]\s+(.*)/gm, '• $1');

        // Convert newlines to <br> (but avoid triple+ <br>)
        formatted = formatted.replace(/\n\n+/g, '<br><br>').replace(/\n/g, '<br>');

        return formatted;
    },

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = `
            <div class="message-content" style="color: #666; font-style: italic;">
                Escribiendo... ✍️
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    },

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    },

    async generateMockResponse(userMsg) {
        // Recopilar contexto real de la aplicación
        const context = {
            stats: Utils.calculateStats(),
            settings: StorageManager.getSettings(),
            tasks: StorageManager.getTasks().filter(t => !t.completed).map(t => t.title),
            nextEvents: StorageManager.getEvents().slice(0, 3)
        };

        try {
            // Intentar conectar con el backend
            // Use relative path for Vercel/Local compatibility
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMsg,
                    context: context
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.response || errorData.error || 'Error en el servidor');
            }

            const data = await response.json();
            this.addMessage(data.response, 'bot');

        } catch (error) {
            console.log('Error interacting with backend:', error);

            // Fallback rules (Reglas locales si el servidor no está corriendo o da error)
            const lowerMsg = userMsg.toLowerCase();
            let fallbackResponse = "";

            if (lowerMsg.includes('presupuesto')) {
                const stats = Utils.calculateStats();
                fallbackResponse = `💰 <b>Info Local (Offline):</b><br>Gastado: ${Utils.formatCurrency(stats.budget.spent)} / ${Utils.formatCurrency(stats.budget.total)}.<br><small>*Para respuestas inteligentes, inicia el servidor backend.*</small>`;
            } else if (lowerMsg.includes('invitados')) {
                const stats = Utils.calculateStats();
                fallbackResponse = `👥 <b>Info Local (Offline):</b><br>Confirmados: ${stats.guests.confirmed} / ${stats.guests.total}.`;
            } else {
                // Mostrar el error específico si es del servidor, o el mensaje de offline si es de red
                const isNetworkError = error.message.includes('fetch');
                const errorMessage = isNetworkError
                    ? 'No puedo conectar con el servidor (Offline).'
                    : `Error del servidor: ${error.message}`;

                fallbackResponse = `⚠️ <b>${errorMessage}</b><br>Asegúrate de ejecutar <code>npm start</code> y que tu API Key sea válida.<br><br>Modo básico activado.`;
            }

            this.addMessage(fallbackResponse, 'bot');
        }
    }
};
