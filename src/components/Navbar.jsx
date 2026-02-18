import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { BookContext, CATEGORIES } from '../context/BookContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { isAdmin, logout, logo, activeCategory, setActiveCategory, categories } = useContext(BookContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Theme toggle
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, borderRadius: '0 0 16px 16px', borderTop: 'none' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1.2rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none', color: 'inherit' }}>
                    {logo ? (
                        <img src={logo} alt="Logo" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <img src="/logo.png" alt="VetBook" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <span className="outfit" style={{ fontWeight: '700', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
                        <span style={{ color: 'white' }}>Night</span>
                        <span style={{ color: 'var(--primary)' }}>Store</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Home</Link>
                    <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>About</Link>
                    {isAdmin && (
                        <>
                            <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Dashboard</Link>
                            <button onClick={logout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.4rem' }}>
                                <LogOut size={18} />
                            </button>
                        </>
                    )}
                </div>

                {/* Theme Toggle + Hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={toggleTheme} style={{
                        background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)',
                        borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', transition: 'all 0.3s ease'
                    }}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Hamburger */}
                    <button
                        className="nav-hamburger"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.3rem', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="nav-mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ display: 'none', flexDirection: 'column', gap: '0.8rem', padding: '0.8rem 1.2rem', borderTop: '1px solid var(--glass-border)', overflow: 'hidden' }}
                    >
                        <Link to="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '500', padding: '0.4rem 0' }}>Home</Link>
                        <Link to="/about" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: '500', padding: '0.4rem 0' }}>About</Link>
                        {isAdmin && (
                            <>
                                <Link to="/admin" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600', padding: '0.4rem 0' }}>Dashboard</Link>
                                <button onClick={() => { logout(); setMobileOpen(false); }} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.4rem', width: 'fit-content' }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Category Tabs - Show on Home */}
            {isHome && (
                <div className="category-tabs" style={{
                    display: 'flex',
                    gap: '0.3rem',
                    padding: '0.5rem 1rem',
                    overflowX: 'auto',
                    borderTop: '1px solid var(--glass-border)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.4rem 0.9rem',
                                borderRadius: '8px',
                                border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                                background: activeCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: '0.3s',
                                whiteSpace: 'nowrap',
                                fontSize: '0.78rem',
                                fontWeight: activeCategory === cat ? '600' : '400',
                                flexShrink: 0
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
