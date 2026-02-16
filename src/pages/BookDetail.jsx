import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { BookContext } from '../context/BookContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import DOMPurify from 'dompurify';
import SEO from '../components/SEO';
import BookCard from '../components/BookCard';

const BookDetail = () => {
    const { id } = useParams();
    const { books, whatsappNumber, whatsappGroup } = useContext(BookContext);
    const book = books.find(b => String(b.id) === String(id));

    const [countdown, setCountdown] = useState(15);
    const [canDownload, setCanDownload] = useState(false);

    useEffect(() => {
        if (book?.type === 'free' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanDownload(true);
        }
    }, [countdown, book]);

    if (!book) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}><h2>Product not found</h2><Link to="/" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Go Home</Link></div>;

    const relatedBooks = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 3);

    const whatsappMessage = book.whatsappText
        ? book.whatsappText
        : `I want to buy "${book.title}" from Night Store`;

    const whatsappLink = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
        : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="container" style={{ padding: '6rem 1rem 3rem' }}>
            <SEO
                title={`${book.title} | Night Store`}
                description={`Get ${book.title}. Premium software/course. Price: ${book.price || 'Free'}. Instant delivery via WhatsApp.`}
                image={book.image}
            />
            <Link to="/" className="btn" style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> Back to Products
            </Link>

            <article className="glass-panel" style={{ padding: 'clamp(1.2rem, 4vw, 3rem)', borderRadius: '16px' }}>
                <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div className="book-detail-meta" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {book.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Tag size={14} /> {book.category}</span>
                    </div>
                    <h1 className="outfit" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: 'white', marginBottom: '1.5rem' }}>{book.title}</h1>
                    <img src={book.image} alt={book.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px' }} />
                </header>

                <div
                    className="blog-content"
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#e2e8f0', lineHeight: '1.8' }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(book.content, { ADD_ATTR: ['target', 'class', 'style'] }) }}
                />

                {/* Action Area */}
                <div style={{ marginTop: '3rem', padding: 'clamp(1.2rem, 3vw, 3rem)', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    {book.type === 'paid' ? (
                        <>
                            <h2 className="outfit" style={{ marginBottom: '1rem' }}>Unlock Premium Access</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                                Get instant access to {book.title} with full warranty and support.
                            </p>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn whatsapp-btn"
                                style={{ width: '100%', maxWidth: '400px', margin: '0 auto', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', marginBottom: '1rem', boxShadow: '0 0 20px rgba(37,211,102,0.2)' }}
                            >
                                Claim Deal
                            </a>
                        </>
                    ) : (
                        <>
                            <h2 className="outfit" style={{ marginBottom: '1rem' }}>Get This For Free</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                Join our community to get this instantly!
                            </p>

                            {book.downloadUrl && (
                                <a
                                    href={book.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                    style={{
                                        width: '100%', maxWidth: '300px', margin: '0 auto 1rem',
                                        justifyContent: 'center', padding: '0.8rem 2rem',
                                        fontSize: '1rem', background: 'var(--primary)',
                                        color: 'white', boxShadow: '0 0 20px rgba(22, 163, 74, 0.3)'
                                    }}
                                >
                                    Download Content
                                </a>
                            )}

                            <a
                                href={whatsappGroup || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn whatsapp-btn"
                                style={{ padding: '0.8rem 2rem', fontSize: '1rem', width: '100%', maxWidth: '300px', justifyContent: 'center' }}
                            >
                                Join WhatsApp Group
                            </a>
                        </>
                    )}
                </div>
            </article>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
                <section style={{ marginTop: '3rem' }}>
                    <h2 className="outfit" style={{ marginBottom: '1.5rem' }}>Related Products</h2>
                    <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {relatedBooks.map(b => <BookCard key={b.id} book={b} />)}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BookDetail;
