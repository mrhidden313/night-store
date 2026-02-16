import { createContext, useState, useEffect } from 'react';
import {
    getBooks, addBookAPI, updateBookAPI, deleteBookAPI, reorderBooksAPI,
    getSettings, saveSettings,
    getCategoryButtons, saveCategoryButtons, resetToDefaults
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

    // Load data on mount
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            const data = await getBooks();
            setBooks(data);
            setLoading(false);
        };
        fetchBooks();

        const settings = getSettings();
        setLogo(settings.logo || '');
        setWhatsappNumber(settings.whatsappNumber || WHATSAPP_NUMBER);
        setWhatsappGroup(settings.whatsappGroup || '');
        setCategoryButtons(getCategoryButtons());
    }, []);

    // NOTE: removed auto-save effect for books since we now save directly to API

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
        // Optimistic update for UI
        setBooks(newOrder);
        // reorderBooksAPI(newOrder); // Not fully implemented in DB yet
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
            resetToDefaults
        }}>
            {children}
        </BookContext.Provider>
    );
};
