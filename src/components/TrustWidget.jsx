import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';

const allBuyers = [
    { name: 'Ali Hassan', product: 'Netflix Premium', time: 'just now' },
    { name: 'Sarah Khan', product: 'Canva Pro', time: '1m ago' },
    { name: 'Usman Raza', product: 'NordVPN', time: '2m ago' },
    { name: 'Fatima Noor', product: 'Spotify Premium', time: '3m ago' },
    { name: 'Hamza Malik', product: 'ChatGPT Plus', time: '5m ago' },
    { name: 'Ayesha Tariq', product: 'Adobe Suite', time: '8m ago' },
    { name: 'Bilal Ahmed', product: 'YouTube Premium', time: '10m ago' },
    { name: 'Zara Sheikh', product: 'ExpressVPN', time: '12m ago' },
    { name: 'Omar Farooq', product: 'Disney+ Bundle', time: '15m ago' },
    { name: 'Hina Butt', product: 'Grammarly Pro', time: '18m ago' },
    { name: 'Danish Ali', product: 'Udemy Course Pack', time: '20m ago' },
    { name: 'Maira Iqbal', product: 'Figma Pro', time: '22m ago' },
    { name: 'Talha Siddiqui', product: 'Coursera Plus', time: '25m ago' },
    { name: 'Nadia Hussain', product: 'Amazon Prime', time: '28m ago' },
    { name: 'Faisal Javed', product: 'SurfShark VPN', time: '30m ago' },
    { name: 'Anum Zahra', product: 'Skillshare Premium', time: '33m ago' },
    { name: 'Kashif Rauf', product: 'Notion Pro', time: '35m ago' },
    { name: 'Sana Mir', product: 'HBO Max', time: '40m ago' },
    { name: 'Waqar Younis', product: 'LinkedIn Premium', time: '45m ago' },
    { name: 'Rabia Tanveer', product: 'Duolingo Plus', time: '50m ago' },
    { name: 'Junaid Akram', product: 'Envato Elements', time: '55m ago' },
    { name: 'Mehwish Hayat', product: 'Crunchyroll Premium', time: '1h ago' },
];

const colors = [
    'linear-gradient(135deg, #8b5cf6, #a855f7)',
    'linear-gradient(135deg, #16a34a, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #06b6d4, #0891b2)',
];

const ITEM_HEIGHT = 56; // px per item (including gap)

const TrustWidget = () => {
    const shuffled = useMemo(() => {
        const arr = [...allBuyers];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, []);

    // Double the list for seamless looping
    const doubledList = [...shuffled, ...shuffled];
    const totalHeight = shuffled.length * ITEM_HEIGHT;

    return (
        <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '20px', overflow: 'hidden' }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <ShieldCheck size={18} color="var(--primary)" /> Live Purchases
            </h4>

            {/* Scrolling container - shows ~4 items */}
            <div style={{
                height: `${ITEM_HEIGHT * 4}px`,
                overflow: 'hidden',
                position: 'relative',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}>
                <motion.div
                    animate={{ y: [0, -totalHeight] }}
                    transition={{
                        y: {
                            duration: shuffled.length * 2.5,
                            ease: 'linear',
                            repeat: Infinity,
                        }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                    {doubledList.map((buyer, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.7rem',
                                borderRadius: '10px', border: '1px solid var(--glass-border)',
                                height: `${ITEM_HEIGHT - 8}px`, boxSizing: 'border-box',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: colors[i % colors.length],
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0
                                }}>
                                    {buyer.name[0]}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '600', lineHeight: 1.2, margin: 0 }}>{buyer.name}</p>
                                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: 0 }}>got {buyer.product}</p>
                                </div>
                            </div>
                            <span style={{
                                fontSize: '0.58rem', color: 'var(--secondary)',
                                background: 'rgba(16, 185, 129, 0.1)', padding: '2px 5px',
                                borderRadius: '6px', flexShrink: 0, fontWeight: '600', whiteSpace: 'nowrap'
                            }}>
                                {buyer.time}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            border: '2px solid var(--bg-dark)', background: '#333',
                            overflow: 'hidden', marginLeft: n > 1 ? '-8px' : 0
                        }}>
                            <img src={`https://i.pravatar.cc/50?u=influencer${n}`} alt="user" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                    <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        border: '2px solid var(--bg-dark)', background: 'var(--primary)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.55rem', fontWeight: 'bold', marginLeft: '-8px'
                    }}>
                        +99
                    </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Trusted by <b>1000+</b> Social Media Influencers
                </span>
            </div>
        </div>
    );
};

export default TrustWidget;
