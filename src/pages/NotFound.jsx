import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ marginBottom: '2rem', display: 'inline-block', color: 'var(--primary)' }}
                >
                    <Ghost size={120} />
                </motion.div>
                <h1 className="outfit" style={{ fontSize: '6rem', marginBottom: '1rem', color: 'white' }}>404</h1>
                <h2 style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Oops! This book page doesn't exist.</h2>
                <Link to="/" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
                    Back to VetBook
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
