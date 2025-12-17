import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Coming Soon</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                We are crafting something special for this section. Stay tuned!
            </p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
    );
};

export default ComingSoon;
