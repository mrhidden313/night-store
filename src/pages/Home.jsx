import { useState, useContext, useEffect } from 'react';
import { BookContext, CATEGORIES, WHATSAPP_NUMBER } from '../context/BookContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpRight, MessageCircle } from 'lucide-react';
import BookCard from '../components/BookCard';
import SkeletonCard from '../components/SkeletonCard';
import TrustWidget from '../components/TrustWidget';
import SEO from '../components/SEO';

import Loader from '../components/Loader';

const Home = () => {
    const { books, allBooks, activeCategory, setActiveCategory, categoryButtons, loading, loadingMore, hasMore, customCategories } = useContext(BookContext);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [expandedParents, setExpandedParents] = useState({}); // Toggles for sidebar accordions

    // 2-hour countdown timer (loops)
    const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 * 1000); // 2 hours in ms

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1000) return 2 * 60 * 60 * 1000;
                return prev - 1000;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = String(Math.floor(timeLeft / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((timeLeft % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0');
    // const centiseconds ...

    // If loading, show Loader inside the grid area, not full screen
    // if (loading) return <Loader fullScreen={false} />; 

    // Filter Logic with Subcategories
    const filteredBooks = books.filter(book => {
        // 1. Search Filter
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

        if (!matchesSearch) return false;

        // 2. Category Filter
        if (activeCategory === 'All') return true;

        // Special: Free/Paid filter by TYPE
        if (activeCategory === 'Free') return book.type === 'free';
        if (activeCategory === 'Paid') return book.type === 'paid';

        // Check if book matches active category
        if (book.category === activeCategory) return true;

        // Check if active category is a Parent, and book belongs to one of its children
        const subCats = customCategories.filter(c => c.parent === activeCategory).map(c => c.name);
        if (subCats.includes(book.category)) return true;

        return false;
    });

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I want to buy a product')}`;

    // Get the button config for current category
    const catButton = categoryButtons[activeCategory] || null;
    const catButtonLink = catButton
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(catButton.message || `I want to see all ${activeCategory} products`)}`
        : null;

    return (
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
            <SEO
                title={`${activeCategory === 'All' ? 'All Products' : activeCategory} | Night Store`}
                description="Get premium software subscriptions, VPNs, and tech courses at the best prices."
            />

            {/* Hero */}
            <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                    style={{ marginBottom: '3rem' }}
                >
                    <h1 className="outfit" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem', lineHeight: '1.1' }}>
                        {['Premium', 'Digital', 'Deals'].map((word, i) => (
                            <motion.span
                                key={word}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.5, type: 'spring' }}
                                style={{ display: 'inline-block', marginRight: '0.4rem' }}
                            >
                                {i === 2 ? (
                                    <span className="text-gradient" style={{ textShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}>{word}</span>
                                ) : word}
                            </motion.span>
                        ))}
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', maxWidth: '500px', margin: '0 auto' }}
                    >
                        Best prices. Instant WhatsApp delivery.
                    </motion.p>
                </motion.div>
            </section>

            {/* Search */}
            <div className="glass-panel" style={{ padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', position: 'relative', zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search for software, VPNs, or courses..."
                        value={search}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearch(val);
                            if (val.length > 1 && allBooks.length > 0) {
                                const matches = allBooks.filter(b =>
                                    b.title.toLowerCase().includes(val.toLowerCase()) ||
                                    b.category.toLowerCase().includes(val.toLowerCase())
                                ).slice(0, 5);
                                setSuggestions(matches);
                                setShowSuggestions(true);
                            } else {
                                setShowSuggestions(false);
                            }
                        }}
                        onFocus={() => { if (search.length > 1) setShowSuggestions(true); }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                    />
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'var(--card-bg)', // Use theme variable
                                backdropFilter: 'blur(10px)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '0 0 10px 10px',
                                marginTop: '5px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                overflow: 'hidden'
                            }}
                        >
                            {suggestions.map((book, i) => (
                                <a
                                    key={book.id}
                                    href={`/product/${book.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.8rem 1rem',
                                        textDecoration: 'none',
                                        borderBottom: i < suggestions.length - 1 ? '1px solid var(--glass-border)' : 'none',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>{book.title}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{book.category}</div>
                                    </div>
                                    <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content */}
            <div className="home-main" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
                <section>
                    {/* Books Grid or Loader */}
                    {loading ? (
                        <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (
                        <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book, index) => (
                                    <BookCard key={book.id} book={book} index={index} />
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', gridColumn: '1/-1' }}>
                                    <h3>No products found in {activeCategory}.</h3>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try a different category or search term.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Auto-Loading Indicator */}
                    {loadingMore && (
                        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
                            />
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Loading more products...</p>
                        </div>
                    )}

                    {/* Category Bundle Card (Only if loaded and has books) */}
                    {!loading && filteredBooks.length > 0 && (() => {
                        const catBtn = categoryButtons[activeCategory] || {};
                        const bundleMsg = catBtn.message || `I want to buy all ${activeCategory} items bundle`;
                        const bundleLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bundleMsg)}`;

                        // Safe Price Calculation
                        let totalPrice = 0;
                        try {
                            totalPrice = filteredBooks.reduce((sum, b) => {
                                if (b.price && typeof b.price === 'string') {
                                    const numIndex = b.price.match(/\d/);
                                    if (numIndex) {
                                        const cleanStr = b.price.replace(/[^0-9]/g, '');
                                        const num = parseInt(cleanStr);
                                        return sum + (isNaN(num) ? 0 : num);
                                    }
                                } else if (typeof b.price === 'number') {
                                    return sum + b.price;
                                }
                                return sum;
                            }, 0);
                        } catch (e) {
                            console.error("Price calculation error", e);
                        }

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                className="glass-panel glow-border"
                                style={{ marginTop: '3rem', padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '16px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(236, 72, 153, 0.05))', border: '1px solid rgba(6, 182, 212, 0.3)' }}
                            >
                                <h3 className="outfit" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: '0.5rem' }}>
                                    Limited Time Offer — Hurry Up!
                                </h3>

                                {/* Countdown Timer */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    {[{ label: 'HRS', value: hours }, { label: 'MIN', value: minutes }, { label: 'SEC', value: seconds }].map((unit, i) => (
                                        <motion.div
                                            key={unit.label}
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            style={{
                                                background: 'rgba(251, 191, 36, 0.1)',
                                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                                borderRadius: '12px',
                                                padding: '0.6rem 0.8rem',
                                                minWidth: '60px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: '900', color: 'var(--accent-gold)', fontFamily: 'monospace' }}>
                                                {unit.value}
                                            </div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1px', marginTop: '2px' }}>
                                                {unit.label}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.a
                                    href={bundleLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn whatsapp-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)' }}
                                >
                                    Claim Deal
                                </motion.a>
                            </motion.div>
                        );
                    })()}
                </section>

                {/* Sidebar */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <TrustWidget />
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Categories</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {['All', 'Free', 'Paid'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="btn"
                                style={{
                                    justifyContent: 'flex-start',
                                    background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                                    border: '1px solid transparent',
                                    color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {cat}
                            </button>
                        ))}

                        <div style={{ margin: '0.5rem 0', borderTop: '1px solid var(--glass-border)' }}></div>

                        {/* Dynamic Categories (Parents & Children) */}
                        {(() => {
                            // Get Top Level Categories (No Parent)
                            const parents = customCategories.filter(c => !c.parent).map(c => c.name);

                            return parents.map(parent => {
                                const children = customCategories.filter(c => c.parent === parent);
                                const isOpen = expandedParents[parent] || activeCategory === parent || children.some(c => c.name === activeCategory);

                                return (
                                    <div key={parent}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <button
                                                onClick={() => setActiveCategory(parent)}
                                                className="btn"
                                                style={{
                                                    justifyContent: 'flex-start',
                                                    flex: 1,
                                                    background: activeCategory === parent ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                                                    color: activeCategory === parent ? 'var(--primary)' : 'white',
                                                    fontSize: '0.85rem',
                                                    paddingLeft: '0'
                                                }}
                                            >
                                                {parent}
                                            </button>
                                            {children.length > 0 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setExpandedParents(p => ({ ...p, [parent]: !p[parent] })); }}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 5px' }}
                                                >
                                                    {isOpen ? '−' : '+'}
                                                </button>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {isOpen && children.length > 0 && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    style={{ overflow: 'hidden', paddingLeft: '0.8rem', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--glass-border)', marginLeft: '5px' }}
                                                >
                                                    {children.map(child => (
                                                        <button
                                                            key={child.id}
                                                            onClick={() => setActiveCategory(child.name)}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                textAlign: 'left',
                                                                padding: '0.4rem 0.5rem',
                                                                color: activeCategory === child.name ? 'var(--accent-gold)' : 'var(--text-muted)',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            {child.name}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            });
                        })()}
                    </div>

                    <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px' }}>
                        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Need Help?</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            We're here to assist you anytime.
                        </p>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn whatsapp-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                            Contact Support
                        </a>
                    </div>
                </aside>
            </div >
        </div >
    );
};

export default Home;
