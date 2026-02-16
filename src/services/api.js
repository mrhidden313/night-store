import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from './firebase';

const COLLECTION_NAME = 'products';
const SETTINGS_KEY = 'nightstore_settings'; // Keep settings local for now or move to DB later
const BUTTONS_KEY = 'nightstore_buttons';

// Default Data (Fallback)
const DEFAULT_ITEMS = [
    { id: 1, title: 'Surfshark VPN 1 Year', category: 'Paid', price: 'Rs. 500', type: 'paid', image: '/logo.png', whatsappText: 'I want to buy Surfshark VPN 1 Year', excerpt: 'Premium VPN with unlimited devices and clean IP.', content: '<p>Get official subscription of Surfshark VPN.</p>', tags: ['vpn', 'software'], author: 'Night Store', date: '2025-02-01' },
    // ... items can be re-seeded if needed
];

// ===== ITEMS (PRODUCTS) =====

export const getBooks = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);
        const books = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Sanitize data to prevent crashes (handle missing title, category, tags)
            books.push({
                id: doc.id,
                ...data,
                title: data.title || data.name || 'Untitled Product', // Fallback for manual entries
                category: data.category || 'All',
                type: data.type || 'paid',
                price: data.price || 'Contact',
                tags: data.tags || [],
                image: data.image || '/logo.png'
            });
        });

        if (books.length === 0) {
            // Optional: Seed default if empty? No, returns empty array.
            return [];
        }
        return books;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
};

export const addBookAPI = async (book) => {
    try {
        // Remove ID if present, let Firestore generate it
        const { id, ...bookData } = book;
        const docRef = await addDoc(collection(db, COLLECTION_NAME), bookData);
        return { id: docRef.id, ...bookData };
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
};

export const updateBookAPI = async (updatedBook) => {
    try {
        const { id, ...bookData } = updatedBook;
        const bookRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(bookRef, bookData);
        return updatedBook;
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};

export const deleteBookAPI = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return id; // Return ID to remove from local state
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
    }
};

export const reorderBooksAPI = async (books) => {
    // Reordering in Firestore usually requires updating an 'order' field for all docs.
    // For now, we will skip persistence or implement simplistic update.
    // Ideally, we just update local state and maybe save order in a separate doc.
    console.warn("Reordering persistence not fully implemented for Firestore yet.");
    return books;
};

// ===== SETTINGS & BUTTONS (Keep LocalStorage for simplicity for now) =====

export const getSettings = () => {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : { logo: '/logo.png', whatsappNumber: '03709283496' };
    } catch {
        return { logo: '/logo.png', whatsappNumber: '03709283496' };
    }
};

export const saveSettings = (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getCategoryButtons = () => {
    try {
        const data = localStorage.getItem(BUTTONS_KEY);
        if (data) return JSON.parse(data);
        const DEFAULT_BUTTONS = {
            'Paid': { text: 'Get All Paid Offers', price: 'Contact Us', message: 'I am interested in bulk software purchase' },
            'Free': { text: 'Join Our Community', price: 'Free', message: 'I want to join your free learning community' },
            'All': { text: 'Browse Full Catalog', price: 'Visit Shop', message: 'I want to see full catalog' }
        };
        return DEFAULT_BUTTONS;
    } catch {
        return {};
    }
};

export const saveCategoryButtons = (buttons) => {
    localStorage.setItem(BUTTONS_KEY, JSON.stringify(buttons));
};

export const resetToDefaults = () => {
    // Careful with this on Firestore!
    // We might not want to wipe Cloud DB on reset.
    // Just clear local settings.
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(BUTTONS_KEY);
    window.location.reload();
};
