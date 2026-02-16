import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="glass-panel" style={{ marginTop: '4rem', padding: '2rem 0', borderRadius: '24px 24px 0 0', borderBottom: 'none', position: 'relative' }}>
            <div className="container">
                <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h3 className="outfit" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'white' }}>Night</span><span style={{ color: 'var(--primary)' }}>Store</span>
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Premium Software, VPNs & Courses at unbeatable prices.</p>
                    </div>
                    <div className="footer-right" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'right' }}>
                        <p>Created by <span style={{ color: 'var(--primary)' }}>Mr Farman</span></p>
                        <p>&copy; {new Date().getFullYear()} Night Store. All Rights Reserved.</p>
                    </div>
                </div>

                {/* Hidden Trigger Dot */}
                <Link
                    to="/secret"
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        width: '6px',
                        height: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                        cursor: 'default'
                    }}
                    title="Admin Access"
                />
            </div>
        </footer>
    );
};

export default Footer;
