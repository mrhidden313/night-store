import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER, BookContext } from '../context/BookContext';
import { useContext } from 'react';

const BookCard = ({ book, index = 0 }) => {
    const { whatsappNumber } = useContext(BookContext);

    const whatsappMessage = `I want to buy "${book.title}"`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

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
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    className="card-img"
                />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    // backdropFilter: 'blur(4px)',
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
                    {/* Price Removed as per request */}

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
