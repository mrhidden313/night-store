import { createContext, useState, useEffect } from 'react';
import {
    getBooks, addBookAPI, updateBookAPI, deleteBookAPI, reorderBooksAPI,
    getSettings, saveSettings,
    getCategoryButtons, saveCategoryButtons, resetToDefaults,
    getCategoryButtons, saveCategoryButtons, resetToDefaults,
    getCategoriesAPI, addCategoryAPI, deleteCategoryAPI, updateCategoryAPI,
    getTrashAPI, moveToTrashAPI, restoreBookAPI, permanentDeleteBookAPI, emptyTrashAPI
} from '../services/api';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Direct import from SDK
import { auth } from '../services/firebase'; // Import initialized auth instance

export const BookContext = createContext();

// Fixed Categories
export const CATEGORIES = [
    'All',
    'Free',
    'Paid'
];

export const WHATSAPP_NUMBER = '923709283496';

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [trash, setTrash] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const [logo, setLogo] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER);
    const [whatsappGroup, setWhatsappGroup] = useState('');
    const [categoryButtons, setCategoryButtons] = useState({});
    const [activeCategory, setActiveCategory] = useState('All');

    // Categories State
    const [categories, setCategories] = useState(['All', 'Free', 'Paid']); // UI list
    const [customCategories, setCustomCategories] = useState([]); // DB list

    // Load data on mount
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            const data = await getBooks();
            setBooks(data);
            setLoading(false);
        };
        fetchBooks();

        const fetchCategories = async () => {
            const dbCats = await getCategoriesAPI();
            setCustomCategories(dbCats);
            // Merge fixed + custom (names only for UI)
            const names = dbCats.map(c => c.name);
            // We still keep 'categories' flat for legacy support if needed, or just for the dropdown basics
            setCategories(['All', 'Free', 'Paid', ...names]);
        };
        fetchCategories();

        const fetchTrash = async () => {
            const trashData = await getTrashAPI();
            setTrash(trashData);
        };
        fetchTrash();

        const settings = getSettings();
        setLogo(settings.logo || '');
        setWhatsappNumber(settings.whatsappNumber || WHATSAPP_NUMBER);
        setWhatsappGroup(settings.whatsappGroup || '');
        setCategoryButtons(getCategoryButtons());
    }, []);

    const addBook = async (book) => {
        try {
            const newBook = await addBookAPI(book);
            setBooks(prev => [newBook, ...prev]);
        } catch (e) {
            console.error("Failed to add book", e);
        }
    };

    const updateBook = async (book) => {
        try {
            await updateBookAPI(book);
            setBooks(prev => prev.map(b => b.id === book.id ? book : b));
        } catch (e) {
            console.error("Failed to update book", e);
        }
    };

    const deleteBook = async (id) => {
        try {
            const bookToDelete = books.find(b => b.id === id);
            if (bookToDelete) {
                await moveToTrashAPI(bookToDelete);
                setBooks(prev => prev.filter(b => b.id !== id));
                setTrash(prev => [bookToDelete, ...prev]);
            }
        } catch (e) {
            console.error("Failed to move book to trash", e);
        }
    };

    const restoreBook = async (id) => {
        try {
            const bookToRestore = trash.find(b => b.id === id);
            if (bookToRestore) {
                await restoreBookAPI(bookToRestore);
                setTrash(prev => prev.filter(b => b.id !== id));
                setBooks(prev => [bookToRestore, ...prev]);
            }
        } catch (e) {
            console.error("Failed to restore book", e);
        }
    };

    const permanentDeleteBook = async (id) => {
        try {
            await permanentDeleteBookAPI(id);
            setTrash(prev => prev.filter(b => b.id !== id));
        } catch (e) {
            console.error("Failed to permanently delete book", e);
        }
    };

    const emptyTrash = async () => {
        try {
            await emptyTrashAPI();
            setTrash([]);
        } catch (e) {
            console.error("Failed to empty trash", e);
        }
    };

    const reorderBooks = (newOrder) => {
        setBooks(newOrder);
    };

    const updateLogo = (newLogo) => {
        setLogo(newLogo);
        const settings = getSettings();
        saveSettings({ ...settings, logo: newLogo });
    };

    const updateWhatsappNumber = (num) => {
        setWhatsappNumber(num);
        const settings = getSettings();
        saveSettings({ ...settings, whatsappNumber: num });
    };

    const updateWhatsappGroup = (link) => {
        setWhatsappGroup(link);
        const settings = getSettings();
        saveSettings({ ...settings, whatsappGroup: link });
    };

    const updateCategoryButton = (category, data) => {
        const updated = { ...categoryButtons, [category]: data };
        setCategoryButtons(updated);
        saveCategoryButtons(updated);
    };

    // Category Management
    const addCategory = async (name, parent = null) => {
        if (categories.includes(name)) return;
        try {
            const newCat = await addCategoryAPI(name, parent);
            setCustomCategories(prev => [...prev, newCat]);
            setCategories(prev => [...prev, name]);
        } catch (e) {
            console.error("Failed to add category", e);
        }
    };

    const updateCategory = async (id, oldName, newName) => {
        try {
            await updateCategoryAPI(id, newName);

            // 1. Update Category List
            setCustomCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
            setCategories(prev => prev.map(c => c === oldName ? newName : c));
            if (activeCategory === oldName) setActiveCategory(newName);

            // 2. Update all products with this category
            // We need to update them in DB and State. 
            // Optimizing: Update state immediately, background update DB? Or await all? 
            // Let's await all to be safe.
            const booksToUpdate = books.filter(b => b.category === oldName);
            const updatePromises = booksToUpdate.map(b => updateBookAPI({ ...b, category: newName }));
            await Promise.all(updatePromises);

            setBooks(prev => prev.map(b => b.category === oldName ? { ...b, category: newName } : b));

        } catch (e) {
            console.error("Failed to update category", e);
        }
    };

    const deleteCategory = async (id, name) => {
        try {
            // 1. Move Category to Trash (API handles the move)
            const deletedCat = await deleteCategoryAPI(id);

            // 2. Update Local Category State
            setCustomCategories(prev => prev.filter(c => c.id !== id));
            setCategories(prev => prev.filter(c => c !== name));
            if (activeCategory === name) setActiveCategory('All');

            if (deletedCat) {
                setTrash(prev => [{ ...deletedCat, title: `Category: ${deletedCat.name}` }, ...prev]); // Add cat to trash state
            }

            // 3. Cascade: Move all products of this category to Trash
            const booksToDelete = books.filter(b => b.category === name);
            if (booksToDelete.length > 0) {
                const deletePromises = booksToDelete.map(b => moveToTrashAPI(b));
                await Promise.all(deletePromises);

                // Update Books State
                setBooks(prev => prev.filter(b => b.category !== name));

                // Update Trash State (Add these books)
                setTrash(prev => [...booksToDelete, ...prev]);
            }

        } catch (e) {
            console.error("Failed to delete category", e);
        }
    };


    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAdmin(!!user);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsAdmin(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <BookContext.Provider value={{
            books, trash, loading, addBook, updateBook, deleteBook, reorderBooks,
            restoreBook, permanentDeleteBook, emptyTrash,
            isAdmin, authLoading, login, logout,
            logo, updateLogo,
            whatsappNumber, updateWhatsappNumber,
            whatsappGroup, updateWhatsappGroup,
            categoryButtons, updateCategoryButton,
            activeCategory, setActiveCategory,
            categoryButtons, updateCategoryButton,
            activeCategory, setActiveCategory,
            categories, customCategories, addCategory, deleteCategory, updateCategory,
            resetToDefaults
        }}>
            {children}
        </BookContext.Provider>
    );
};
