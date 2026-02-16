import { motion } from 'framer-motion';
import { useContext } from 'react';
import { BookContext } from '../context/BookContext';
import { MessageCircle } from 'lucide-react';

const About = () => {
    const { logo, whatsappGroup } = useContext(BookContext);

    return (
        <div className="container" style={{ padding: 'clamp(6rem, 10vw, 10rem) 1rem 3rem', textAlign: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 4rem)', borderRadius: '16px' }}
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    style={{ marginBottom: '1.5rem' }}
                >
                    <img
                        src={logo || '/logo.png'}
                        alt="Logo"
                        style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            objectFit: 'cover', border: '3px solid var(--primary)',
                            boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                        }}
                    />
                </motion.div>

                <h1 className="outfit" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: '1.5rem' }}>
                    About Night Store
                </h1>
                <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                    Night Store is your one-stop destination for premium software subscriptions, VPNs, streaming services, and digital products at unbeatable prices with instant WhatsApp delivery.
                </p>

                <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left', marginTop: '2.5rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '0.6rem', fontSize: '1.1rem' }}>Our Mission</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            To provide premium digital products at the most affordable prices with fast, reliable delivery via WhatsApp.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--secondary)', marginBottom: '0.6rem', fontSize: '1.1rem' }}>Our Vision</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Building the most trusted platform for digital deals — empowering users with premium tools at pocket-friendly prices.
                        </p>
                    </div>
                </div>

                {/* WhatsApp Group Link */}
                {whatsappGroup && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(37, 211, 102, 0.05)', borderRadius: '16px', border: '1px solid rgba(37, 211, 102, 0.2)' }}
                    >
                        <h3 style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>Join Our Community</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Get exclusive deals, updates & support in our WhatsApp group!
                        </p>
                        <a
                            href={whatsappGroup}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn whatsapp-btn"
                            style={{ padding: '0.7rem 2rem', fontSize: '0.95rem', borderRadius: '10px' }}
                        >
                            Join WhatsApp Group
                        </a>
                    </motion.div>
                )}

                <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Team Owner:</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.8rem', color: 'var(--primary)', flexWrap: 'wrap' }}>
                        <span>Farman Khan</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
