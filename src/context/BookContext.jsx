import { createContext, useState, useEffect } from 'react';
import {
    getBooks, addBookAPI, updateBookAPI, deleteBookAPI, reorderBooksAPI,
    getSettings, saveSettings,
    getCategoryButtons, saveCategoryButtons, resetToDefaults,
    getCategoriesAPI, addCategoryAPI, deleteCategoryAPI
} from '../services/api';

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
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(0);
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
            setCategories(['All', 'Free', 'Paid', ...names]);
        };
        fetchCategories();

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
            await deleteBookAPI(id);
            setBooks(prev => prev.filter(b => b.id !== id));
        } catch (e) {
            console.error("Failed to delete book", e);
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
    const addCategory = async (name) => {
        if (categories.includes(name)) return;
        try {
            const newCat = await addCategoryAPI(name);
            setCustomCategories(prev => [...prev, newCat]);
            setCategories(prev => [...prev, name]);
        } catch (e) {
            console.error("Failed to add category", e);
        }
    };

    const deleteCategory = async (id, name) => {
        try {
            await deleteCategoryAPI(id);
            setCustomCategories(prev => prev.filter(c => c.id !== id));
            setCategories(prev => prev.filter(c => c !== name));
            if (activeCategory === name) setActiveCategory('All');
        } catch (e) {
            console.error("Failed to delete category", e);
        }
    };

    const login = (username, password) => {
        if (Date.now() < lockoutTime) return { success: false, locked: true };

        if (username === 'fkkhan' && password === 'farman') {
            setIsAdmin(true);
            setLoginAttempts(0);
            return { success: true };
        } else {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            if (newAttempts >= 5) {
                setLockoutTime(Date.now() + 5 * 60 * 1000);
            }
            return { success: false, locked: false };
        }
    };

    const logout = () => setIsAdmin(false);

    return (
        <BookContext.Provider value={{
            books, loading, addBook, updateBook, deleteBook, reorderBooks,
            isAdmin, login, logout, lockoutTime,
            logo, updateLogo,
            whatsappNumber, updateWhatsappNumber,
            whatsappGroup, updateWhatsappGroup,
            categoryButtons, updateCategoryButton,
            activeCategory, setActiveCategory,
            categories, customCategories, addCategory, deleteCategory, // Exposed
            resetToDefaults
        }}>
            {children}
        </BookContext.Provider>
    );
};
