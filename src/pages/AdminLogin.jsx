import { useState, useContext } from 'react';
import { BookContext } from '../context/BookContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login, lockoutTime } = useContext(BookContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const result = login(username, password);

        if (result.success) {
            toast.success('Successfully logged in!');
            navigate('/admin');
        } else if (result.locked) {
            const wait = Math.ceil((lockoutTime - Date.now()) / 1000);
            toast.error(`Account locked. Please wait ${wait}s.`);
        } else {
            toast.error('Invalid credentials. Access denied.');
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '400px', padding: '3rem', borderRadius: '32px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '70px', height: '70px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                        <Lock size={35} />
                    </div>
                    <h2 className="outfit">Night Store</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Admin Login Panel</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
                        Login to Dashboard
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <ShieldAlert size={14} /> 256-bit AES Encryption Active
                </div>
            </motion.div>
        </div >
    );
};

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    padding: '0.8rem 1rem 0.8rem 2.5rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
};

export default AdminLogin;
