import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, Share2, Copy, Check } from 'lucide-react';
import { WHATSAPP_NUMBER, BookContext } from '../context/BookContext';
import { useContext, useState } from 'react';

const BADGE_STYLES = {
    'New': { bg: 'linear-gradient(135deg, #06b6d4, #3b82f6)', icon: '✨' },
    'Hot': { bg: 'linear-gradient(135deg, #ef4444, #f97316)', icon: '🔥' },
    'Best Seller': { bg: 'linear-gradient(135deg, #f59e0b, #eab308)', icon: '⭐' },
    'Limited': { bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)', icon: '⏰' },
};

const BookCard = ({ book, index = 0 }) => {
    const { whatsappNumber } = useContext(BookContext);
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const whatsappMessage = `I want to buy "${book.title}"`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    const productUrl = `${window.location.origin}/product/${book.id}`;

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShare(!showShare);
    };

    const handleCopyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => { setCopied(false); setShowShare(false); }, 1500);
    };

    const handleWhatsAppShare = (e) => {
        e.stopPropagation();
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out "${book.title}" 👉 ${productUrl}`)}`, '_blank');
        setShowShare(false);
    };

    const handleNativeShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({ title: book.title, text: book.excerpt || book.title, url: productUrl });
            } catch { /* user cancelled */ }
        }
        setShowShare(false);
    };

    // Alternate animation directions for variety
    const directions = [
        { x: -60, y: 0 },   // from left
        { x: 60, y: 0 },    // from right
        { x: 0, y: 50 },    // from bottom
        { x: -40, y: 30 },  // diagonal left-bottom
        { x: 40, y: 30 },   // diagonal right-bottom
        { x: 0, y: -50 },   // from top
    ];
    const dir = directions[index % directions.length];
    const badge = BADGE_STYLES[book.badge];

    return (
        <motion.div
            initial={{ opacity: 0, x: dir.x, y: dir.y, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 14 }}
            whileHover={{ y: -8, scale: 1.03, boxShadow: '0 15px 35px rgba(139, 92, 246, 0.25)' }}
            whileTap={{ scale: 0.97 }}
            className="book-card glass-panel"
            style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer'
            }}
        >
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                    src={book.image}
                    alt={book.title}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    className="card-img"
                />

                {/* Badge */}
                {badge && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: badge.bg, padding: '4px 10px', borderRadius: '20px',
                        fontSize: '0.7rem', color: 'white', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                        {badge.icon} {book.badge}
                    </div>
                )}

                {/* Free/Premium tag */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: book.type === 'free' ? 'var(--secondary)' : 'var(--accent-gold)'
                    }}></span>
                    {book.type === 'free' ? 'Free' : 'Premium'}
                </div>
            </div>

            <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {book.category}
                </div>
                <h3 className="outfit" style={{ margin: '0 0 0.8rem 0', fontSize: '1.2rem', lineHeight: '1.3', color: 'white' }}>
                    {book.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.5', flex: 1 }}>
                    {book.excerpt}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: book.type === 'paid' ? 'var(--accent-gold)' : 'var(--secondary)' }}>
                            {book.type === 'free' ? 'Free' : (book.price || 'Ask Price')}
                        </span>
                        {/* Share Button */}
                        <div style={{ position: 'relative' }}>
                            <button onClick={handleShare} style={{
                                background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)',
                                borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                            >
                                <Share2 size={14} />
                            </button>

                            {/* Share Dropdown */}
                            {showShare && (
                                <div style={{
                                    position: 'absolute', bottom: '100%', right: 0, marginBottom: '6px',
                                    background: 'rgba(15,23,42,0.95)', border: '1px solid var(--glass-border)',
                                    borderRadius: '10px', padding: '6px', minWidth: '150px', zIndex: 50,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)'
                                }}>
                                    <button onClick={handleWhatsAppShare} style={{
                                        width: '100%', padding: '8px 10px', background: 'none', border: 'none',
                                        color: '#25d366', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        gap: '8px', fontSize: '0.8rem', borderRadius: '6px',
                                    }}
                                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.target.style.background = 'none'}
                                    >
                                        <MessageCircle size={14} /> WhatsApp
                                    </button>
                                    <button onClick={handleCopyLink} style={{
                                        width: '100%', padding: '8px 10px', background: 'none', border: 'none',
                                        color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        gap: '8px', fontSize: '0.8rem', borderRadius: '6px',
                                    }}
                                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.target.style.background = 'none'}
                                    >
                                        {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                                    </button>
                                    {navigator.share && (
                                        <button onClick={handleNativeShare} style={{
                                            width: '100%', padding: '8px 10px', background: 'none', border: 'none',
                                            color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            gap: '8px', fontSize: '0.8rem', borderRadius: '6px',
                                        }}
                                            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={e => e.target.style.background = 'none'}
                                        >
                                            <Share2 size={14} /> More...
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Link to={`/product/${book.id}`} className="btn" style={{
                        width: '100%',
                        padding: '0.7rem',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontWeight: '600',
                        marginTop: '0',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                    }}>
                        Read More <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;
