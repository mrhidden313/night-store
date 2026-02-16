const SkeletonCard = () => {
    return (
        <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', height: '420px' }}>
            <div className="skeleton" style={{ height: '220px', width: '100%' }} />
            <div style={{ padding: '1.5rem' }}>
                <div className="skeleton" style={{ height: '15px', width: '30%', marginBottom: '1rem', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '25px', width: '90%', marginBottom: '1rem', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '15px', width: '100%', marginBottom: '0.5rem', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '15px', width: '80%', marginBottom: '2rem', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '45px', width: '100%', borderRadius: '10px' }} />
            </div>
        </div>
    );
};

export default SkeletonCard;
