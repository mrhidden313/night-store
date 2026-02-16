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
    const { books, activeCategory, categoryButtons, loading } = useContext(BookContext);
    const [search, setSearch] = useState('');

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

    const filteredBooks = books
        .filter(book =>
            (activeCategory === 'All' || book.category === activeCategory) &&
            (book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
        );

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
            <div className="glass-panel" style={{ padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                    type="text"
                    placeholder="Search for software, VPNs, or courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                />
            </div>

            {/* Main Content */}
            <div className="home-main" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
                <section>
                    {/* Books Grid or Loader */}
                    {loading ? (
                        <Loader fullScreen={false} />
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
            </div>
        </div>
    );
};

export default Home;
