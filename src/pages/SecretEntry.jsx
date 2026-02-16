import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const SecretEntry = () => {
    const [pin, setPin] = useState('');
    const navigate = useNavigate();

    const checkPin = (e) => {
        e.preventDefault();
        if (pin === '1122') {
            toast.success('Identity Verified');
            navigate('/admin-login');
        } else {
            toast.error('Unauthorized Access Attempt Logged');
            setPin('');
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '350px', padding: '3rem', borderRadius: '32px', textAlign: 'center' }}
            >
                <div style={{ width: '60px', height: '60px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                    <KeyRound size={30} />
                </div>
                <h2 className="outfit" style={{ marginBottom: '1rem' }}>Enter PIN</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Proof of ownership required to proceed.</p>

                <form onSubmit={checkPin}>
                    <input
                        type="password"
                        placeholder="••••"
                        value={pin}
                        maxLength={4}
                        onChange={(e) => setPin(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            padding: '1.2rem',
                            borderRadius: '16px',
                            color: 'white',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            letterSpacing: '10px',
                            outline: 'none',
                            marginBottom: '1.5rem'
                        }}
                        autoFocus
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Unlock <ShieldCheck size={18} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SecretEntry;
