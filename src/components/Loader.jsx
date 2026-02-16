import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

const Loader = ({ fullScreen = true }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return 95; // Stall at 95%
                const increment = Math.random() * 10 + 5;
                return Math.min(prev + increment, 95);
            });
        }, 150);
        return () => clearInterval(interval);
    }, []);

    const radius = 30; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div style={{
            position: fullScreen ? 'fixed' : 'relative',
            top: 0, left: 0,
            width: '100%',
            height: fullScreen ? '100vh' : '400px',
            background: fullScreen ? 'var(--bg-dark)' : 'transparent',
            zIndex: fullScreen ? 9999 : 10,
            display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
        }}>
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                <svg width="100" height="100" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background Track */}
                    <circle
                        cx="40" cy="40" r={radius}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="6"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="40" cy="40" r={radius}
                        stroke="var(--primary)" // User reference was blue, using primary (violet) or we can use '#3b82f6' (blue)
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ filter: 'drop-shadow(0 0 4px var(--primary))' }}
                    />
                </svg>

                {/* Percentage Text */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 'bold', fontSize: '1.1rem', color: 'white'
                }}>
                    {Math.round(progress)}%
                </div>
            </div>

            <motion.h3
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="outfit"
                style={{ marginTop: '1rem', color: 'var(--text-muted)', letterSpacing: '1px', fontSize: '1rem' }}
            >
                Loading...
            </motion.h3>
        </div>
    );
};

export default Loader;
