const StorageManager = {
    firebaseConfig: {},
    db: null,
    weddingId: localStorage.getItem('wedding_id') || null,
    isSyncing: false,

    async init() {
        try {
            // Fetch configuration from API (avoids exposing keys in GitHub)
            const response = await fetch('/api/config');
            if (!response.ok) throw new Error('Could not fetch Firebase config');
            this.firebaseConfig = await response.json();

            if (!firebase.apps.length && this.firebaseConfig.apiKey) {
                firebase.initializeApp(this.firebaseConfig);
                this.db = firebase.firestore();
            }

            if (this.weddingId) {
                this.startSync();
            }
        } catch (error) {
            console.error('StorageManager Init Error:', error);
            // Fallback for extreme cases or local development if API is down
            if (!firebase.apps.length && this.firebaseConfig.apiKey !== "AIzaSyABStlmYAm1gsLg3OKuIFc6yBa7FvwTcFM") {
                console.warn('Using local hardcoded config fallback');
            }
        }
    },

    KEYS: {
        SETTINGS: 'wedding_settings',
        TASKS: 'wedding_tasks',
        GUESTS: 'wedding_guests',
        EXPENSES: 'wedding_expenses',
        VENDORS: 'wedding_vendors',
        EVENTS: 'wedding_events',
        TABLES: 'wedding_tables',
        GIFTS: 'wedding_gifts',
        SONGS: 'wedding_songs',
        WISHES: 'wedding_wishes',
        MEMORIES: 'wedding_memories'
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from storage:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            this.pushToCloud(key, value);
            return true;
        } catch (e) {
            console.error('Error writing to storage:', e);
            return false;
        }
    },

    async pushToCloud(key, value) {
        if (!this.weddingId || !this.db || this.isSyncing) return;
        try {
            await this.db.collection('weddings').doc(this.weddingId)
                .collection('data').doc(key).set({
                    content: JSON.stringify(value),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (e) {
            console.error('Error pushing to cloud:', e);
        }
    },

    async setWeddingId(id) {
        this.weddingId = id;
        localStorage.setItem('wedding_id', id);
        await this.startSync();
        // Trigger initial push to seed the database if empty
        const allData = this.exportData();
        for (const [key, val] of Object.entries(this.KEYS)) {
            const currentData = this.get(val);
            if (currentData) await this.pushToCloud(val, currentData);
        }
    },

    startSync() {
        if (!this.weddingId || !this.db) return;

        // Listen for changes from Firestore
        this.db.collection('weddings').doc(this.weddingId)
            .collection('data').onSnapshot((snapshot) => {
                this.isSyncing = true;
                snapshot.forEach((doc) => {
                    const key = doc.id;
                    const data = JSON.parse(doc.data().content);
                    const localData = localStorage.getItem(key);

                    if (JSON.stringify(data) !== localData) {
                        localStorage.setItem(key, doc.data().content);
                        // Dispatch event to notify UI
                        window.dispatchEvent(new CustomEvent('storage-updated', { detail: { key } }));
                    }
                });
                this.isSyncing = false;
            });
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from storage:', e);
            return false;
        }
    },

    // Settings
    getSettings() {
        return this.get(this.KEYS.SETTINGS) || {
            partner1Name: '',
            partner2Name: '',
            weddingDate: '',
            weddingTime: '',
            venueName: '',
            venueAddress: '',
            totalBudget: 0
        };
    },

    saveSettings(settings) {
        return this.set(this.KEYS.SETTINGS, settings);
    },

    // Tasks
    getTasks() {
        return this.get(this.KEYS.TASKS) || [];
    },

    saveTasks(tasks) {
        return this.set(this.KEYS.TASKS, tasks);
    },

    addTask(task) {
        const tasks = this.getTasks();
        task.id = Date.now().toString();
        task.createdAt = new Date().toISOString();
        tasks.push(task);
        return this.saveTasks(tasks) ? task : null;
    },

    updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updates };
            return this.saveTasks(tasks) ? tasks[index] : null;
        }
        return null;
    },

    deleteTask(id) {
        const tasks = this.getTasks().filter(t => t.id !== id);
        return this.saveTasks(tasks);
    },

    // Guests
    getGuests() {
        return this.get(this.KEYS.GUESTS) || [];
    },

    saveGuests(guests) {
        return this.set(this.KEYS.GUESTS, guests);
    },

    addGuest(guest) {
        const guests = this.getGuests();
        guest.id = Date.now().toString();
        guest.createdAt = new Date().toISOString();
        guests.push(guest);
        return this.saveGuests(guests) ? guest : null;
    },

    updateGuest(id, updates) {
        const guests = this.getGuests();
        const index = guests.findIndex(g => g.id === id);
        if (index !== -1) {
            guests[index] = { ...guests[index], ...updates };
            return this.saveGuests(guests) ? guests[index] : null;
        }
        return null;
    },

    deleteGuest(id) {
        const guests = this.getGuests().filter(g => g.id !== id);
        return this.saveGuests(guests);
    },

    // Expenses
    getExpenses() {
        return this.get(this.KEYS.EXPENSES) || [];
    },

    saveExpenses(expenses) {
        return this.set(this.KEYS.EXPENSES, expenses);
    },

    addExpense(expense) {
        const expenses = this.getExpenses();
        expense.id = Date.now().toString();
        expense.createdAt = new Date().toISOString();
        expenses.push(expense);
        return this.saveExpenses(expenses) ? expense : null;
    },

    updateExpense(id, updates) {
        const expenses = this.getExpenses();
        const index = expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...updates };
            return this.saveExpenses(expenses) ? expenses[index] : null;
        }
        return null;
    },

    deleteExpense(id) {
        const expenses = this.getExpenses().filter(e => e.id !== id);
        return this.saveExpenses(expenses);
    },

    // Vendors
    getVendors() {
        return this.get(this.KEYS.VENDORS) || [];
    },

    saveVendors(vendors) {
        return this.set(this.KEYS.VENDORS, vendors);
    },

    addVendor(vendor) {
        const vendors = this.getVendors();
        vendor.id = Date.now().toString();
        vendor.createdAt = new Date().toISOString();
        vendors.push(vendor);
        return this.saveVendors(vendors) ? vendor : null;
    },

    updateVendor(id, updates) {
        const vendors = this.getVendors();
        const index = vendors.findIndex(v => v.id === id);
        if (index !== -1) {
            vendors[index] = { ...vendors[index], ...updates };
            return this.saveVendors(vendors) ? vendors[index] : null;
        }
        return null;
    },

    deleteVendor(id) {
        const vendors = this.getVendors().filter(v => v.id !== id);
        return this.saveVendors(vendors);
    },

    // Events (Timeline)
    getEvents() {
        return this.get(this.KEYS.EVENTS) || [];
    },

    saveEvents(events) {
        return this.set(this.KEYS.EVENTS, events);
    },

    addEvent(event) {
        const events = this.getEvents();
        event.id = Date.now().toString();
        events.push(event);
        return this.saveEvents(events) ? event : null;
    },

    updateEvent(id, updates) {
        const events = this.getEvents();
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...updates };
            return this.saveEvents(events) ? events[index] : null;
        }
        return null;
    },

    deleteEvent(id) {
        const events = this.getEvents().filter(e => e.id !== id);
        return this.saveEvents(events);
    },

    // Tables
    getTables() {
        return this.get(this.KEYS.TABLES) || [];
    },

    saveTables(tables) {
        return this.set(this.KEYS.TABLES, tables);
    },

    addTable(table) {
        const tables = this.getTables();
        table.id = Date.now().toString();
        table.guests = [];
        tables.push(table);
        return this.saveTables(tables) ? table : null;
    },

    updateTable(id, updates) {
        const tables = this.getTables();
        const index = tables.findIndex(t => t.id === id);
        if (index !== -1) {
            tables[index] = { ...tables[index], ...updates };
            return this.saveTables(tables) ? tables[index] : null;
        }
        return null;
    },

    deleteTable(id) {
        const tables = this.getTables().filter(t => t.id !== id);
        return this.saveTables(tables);
    },

    // Gifts
    getGifts() {
        return this.get(this.KEYS.GIFTS) || [];
    },

    saveGifts(gifts) {
        return this.set(this.KEYS.GIFTS, gifts);
    },

    addGift(gift) {
        const gifts = this.getGifts();
        gift.id = Date.now().toString();
        gifts.push(gift);
        return this.saveGifts(gifts) ? gift : null;
    },

    updateGift(id, updates) {
        const gifts = this.getGifts();
        const index = gifts.findIndex(g => g.id === id);
        if (index !== -1) {
            gifts[index] = { ...gifts[index], ...updates };
            return this.saveGifts(gifts) ? gifts[index] : null;
        }
        return null;
    },

    deleteGift(id) {
        const gifts = this.getGifts().filter(g => g.id !== id);
        return this.saveGifts(gifts);
    },

    // Songs / Playlist
    getSongs() {
        return this.get(this.KEYS.SONGS) || [];
    },

    saveSongs(songs) {
        return this.set(this.KEYS.SONGS, songs);
    },

    addSong(song) {
        const songs = this.getSongs();
        song.id = Date.now().toString();
        songs.push(song);
        return this.saveSongs(songs) ? song : null;
    },

    deleteSong(id) {
        const songs = this.getSongs().filter(s => s.id !== id);
        return this.saveSongs(songs);
    },

    // Guest Wishes / Guestbook
    getWishes() {
        return this.get(this.KEYS.WISHES) || [];
    },

    saveWishes(wishes) {
        return this.set(this.KEYS.WISHES, wishes);
    },

    addWish(wish) {
        const wishes = this.getWishes();
        wish.id = Date.now().toString();
        wish.date = new Date().toISOString();
        wishes.unshift(wish); // Nuevos primero
        return this.saveWishes(wishes) ? wish : null;
    },

    deleteWish(id) {
        const wishes = this.getWishes().filter(w => w.id !== id);
        return this.saveWishes(wishes);
    },

    // Memories (Photo Wall)
    getMemories() {
        return this.get(this.KEYS.MEMORIES) || [];
    },

    saveMemories(memories) {
        return this.set(this.KEYS.MEMORIES, memories);
    },

    addMemory(memory) {
        const memories = this.getMemories();
        memory.id = Date.now().toString();
        memory.date = new Date().toISOString();
        memories.unshift(memory);
        return this.saveMemories(memories) ? memory : null;
    },

    deleteMemory(id) {
        const memories = this.getMemories().filter(m => m.id !== id);
        return this.saveMemories(memories);
    },

    // Export all data
    exportData() {
        return {
            settings: this.getSettings(),
            tasks: this.getTasks(),
            guests: this.getGuests(),
            expenses: this.getExpenses(),
            vendors: this.getVendors(),
            events: this.getEvents(),
            tables: this.getTables(),
            exportedAt: new Date().toISOString()
        };
    },

    // Import data
    importData(data) {
        try {
            if (data.settings) this.saveSettings(data.settings);
            if (data.tasks) this.saveTasks(data.tasks);
            if (data.guests) this.saveGuests(data.guests);
            if (data.expenses) this.saveExpenses(data.expenses);
            if (data.vendors) this.saveVendors(data.vendors);
            if (data.events) this.saveEvents(data.events);
            if (data.tables) this.saveTables(data.tables);
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }
};
