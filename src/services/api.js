import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc, getDoc, where } from './firebase';

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

// ===== CATEGORIES =====

export const getCategoriesAPI = async () => {
    try {
        const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        const cats = [];
        querySnapshot.forEach((doc) => {
            cats.push({ id: doc.id, ...doc.data() });
        });
        return cats;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const addCategoryAPI = async (name, parent = null) => {
    try {
        const docRef = await addDoc(collection(db, 'categories'), { name, parent });
        return { id: docRef.id, name, parent };
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
};

export const updateCategoryAPI = async (id, newName) => {
    try {
        await updateDoc(doc(db, CATEGORIES_COLLECTION, id), { name: newName });
        return { id, name: newName };
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// Modified: Returns the ID and Name for context to handle cascade
export const deleteCategoryAPI = async (id) => {
    try {
        const catDoc = await getDoc(doc(db, CATEGORIES_COLLECTION, id));
        if (catDoc.exists()) {
            const catData = { id: catDoc.id, ...catDoc.data(), type: 'category', deletedAt: new Date().toISOString() };
            // Move to Trash
            await setDoc(doc(db, TRASH_COLLECTION, id), catData);
            // Delete from Categories
            await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
            return catData; // Return data to know what was deleted (name is needed for cascading books)
        }
        return null;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

// ===== TRASH SYSTEM =====

const TRASH_COLLECTION = 'trash';

export const getTrashAPI = async () => {
    try {
        const q = query(collection(db, TRASH_COLLECTION));
        const querySnapshot = await getDocs(q);
        const trash = [];
        querySnapshot.forEach((doc) => {
            trash.push({ id: doc.id, ...doc.data() });
        });
        return trash;
    } catch (error) {
        console.error("Error getting trash: ", error);
        return [];
    }
};

export const moveToTrashAPI = async (book) => {
    try {
        const { id, ...bookData } = book;
        // 1. Add to Trash
        await setDoc(doc(db, TRASH_COLLECTION, id), { ...bookData, type: 'product', deletedAt: new Date().toISOString() });
        // 2. Delete from Products
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return id;
    } catch (error) {
        console.error("Error moving to trash: ", error);
        throw error;
    }
};

export const restoreBookAPI = async (item) => {
    try {
        const { id, ...data } = item;
        const { deletedAt, type, ...rest } = data; // Remove trash metadata

        const targetCollection = (type === 'category') ? CATEGORIES_COLLECTION : COLLECTION_NAME;

        // 1. Add back to original collection
        await setDoc(doc(db, targetCollection, id), rest);
        // 2. Delete from Trash
        await deleteDoc(doc(db, TRASH_COLLECTION, id));
        return { id, ...rest, type };
    } catch (error) {
        console.error("Error restoring item: ", error);
        throw error;
    }
};

export const permanentDeleteBookAPI = async (id) => {
    try {
        await deleteDoc(doc(db, TRASH_COLLECTION, id));
        return id;
    } catch (error) {
        console.error("Error permanently deleting: ", error);
        throw error;
    }
};

export const emptyTrashAPI = async () => {
    try {
        const q = query(collection(db, TRASH_COLLECTION));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        return true;
    } catch (error) {
        console.error("Error emptying trash: ", error);
        throw error;
    }
};

// ===== SETTINGS & BUTTONS (Keep LocalStorage for simplicity for now) =====

export const getSettings = () => {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : { logo: '/logo.png', whatsappNumber: '923709283496' };
    } catch {
        return { logo: '/logo.png', whatsappNumber: '923709283496' };
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
