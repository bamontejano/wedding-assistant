// Utility functions for Wedding Planner AI

const Utils = {
    // Category icons mapping
    categoryIcons: {
        venue: '📍 Lugar',
        catering: '🍽️ Catering',
        attire: '👗 Vestido/Traje',
        flowers: '💐 Floristería',
        music: '🎵 Música/DJ',
        photo: '📸 Fotografía',
        video: '🎥 Vídeo',
        invitations: '💌 Invitaciones',
        decoration: '✨ Decoración',
        rings: '💍 Alianzas',
        honeymoon: '✈️ Luna de Miel',
        cake: '🎂 Tarta',
        makeup: '💄 Maquillaje',
        hair: '💇 Peluquería',
        transport: '🚗 Transporte',
        jewelry: '💎 Joyería',
        stationery: '📝 Papelería',
        planner: '📋 Wedding Planner',
        other: '📦 Otros'
    },

    // Group labels
    groupLabels: {
        'family-bride': '👰 Familia Novia',
        'family-groom': '🤵 Familia Novio',
        'friends-bride': '👯 Amigos Novia',
        'friends-groom': '👬 Amigos Novio',
        'work': '💼 Trabajo',
        'other': '📦 Otros'
    },

    // Vendor status labels
    vendorStatusLabels: {
        'researching': '🔍 Investigando',
        'contacted': '📞 Contactado',
        'meeting': '📅 Reunión',
        'quoted': '💬 Presupuestado',
        'booked': '✅ Contratado',
        'paid': '💰 Pagado'
    },

    // Format currency
    formatCurrency(amount, currency = '€') {
        return `${currency}${parseFloat(amount || 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    },

    // Format date
    formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    },

    // Format short date
    formatShortDate(dateString) {
        if (!dateString) return '';
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    },

    // Calculate days until wedding
    daysUntil(dateString) {
        if (!dateString) return null;
        const wedding = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        wedding.setHours(0, 0, 0, 0);
        const diff = wedding - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Parse time string to minutes
    timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Get category icon
    getCategoryIcon(category) {
        return this.categoryIcons[category] || '📦';
    },

    // Get group label
    getGroupLabel(group) {
        return this.groupLabels[group] || group;
    },

    // Get vendor status
    getVendorStatus(status) {
        return this.vendorStatusLabels[status] || status;
    },

    // Calculate statistics
    calculateStats() {
        const tasks = StorageManager.getTasks();
        const guests = StorageManager.getGuests();
        const expenses = StorageManager.getExpenses();
        const vendors = StorageManager.getVendors();
        const settings = StorageManager.getSettings();

        const completedTasks = tasks.filter(t => t.completed).length;
        const confirmedGuests = guests.filter(g => g.status === 'confirmed').length;
        const totalGuestsWithPlus = guests.reduce((sum, g) => {
            if (g.status === 'confirmed') {
                return sum + 1 + (parseInt(g.plusOnes) || 0);
            }
            return sum;
        }, 0);

        const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        const totalPaid = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        const bookedVendors = vendors.filter(v => v.status === 'booked' || v.status === 'paid').length;

        return {
            tasks: { total: tasks.length, completed: completedTasks, pending: tasks.length - completedTasks },
            guests: {
                total: guests.length,
                confirmed: confirmedGuests,
                pending: guests.filter(g => g.status === 'pending').length,
                declined: guests.filter(g => g.status === 'declined').length,
                totalAttending: totalGuestsWithPlus
            },
            budget: {
                total: parseFloat(settings.totalBudget) || 0,
                spent: totalSpent,
                paid: totalPaid,
                remaining: (parseFloat(settings.totalBudget) || 0) - totalSpent
            },
            vendors: { total: vendors.length, booked: bookedVendors }
        };
    },

    // Get expenses by category
    getExpensesByCategory() {
        const expenses = StorageManager.getExpenses();
        const byCategory = {};

        expenses.forEach(expense => {
            const cat = expense.category || 'other';
            if (!byCategory[cat]) {
                byCategory[cat] = { amount: 0, count: 0 };
            }
            byCategory[cat].amount += parseFloat(expense.amount) || 0;
            byCategory[cat].count++;
        });

        return byCategory;
    },

    // Download file
    downloadFile(content, filename, type = 'application/json') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Export guests to CSV
    exportGuestsCSV() {
        const guests = StorageManager.getGuests();
        const headers = ['Nombre', 'Email', 'Teléfono', 'Grupo', 'Acompañantes', 'Estado', 'Restricciones', 'Notas'];
        const rows = guests.map(g => [
            g.name,
            g.email || '',
            g.phone || '',
            this.getGroupLabel(g.group),
            g.plusOnes || 0,
            g.status,
            g.dietary || '',
            g.notes || ''
        ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));

        const csv = [headers.join(','), ...rows].join('\n');
        this.downloadFile(csv, 'invitados_boda.csv', 'text/csv;charset=utf-8;');
    }
};

// Add CSS animation for toast slideOut
const style = document.createElement('style');
style.textContent = `
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);
