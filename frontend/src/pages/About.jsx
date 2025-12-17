import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>About The Every Kitchen</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#555' }}>
                Welcome to <strong>The Every Kitchen</strong>, a sanctuary for food lovers, home cooks, and anyone who believes that the kitchen is the heart of the home.
            </p>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#555' }}>
                Our mission is simple: to inspire you to cook real, good food. We believe that cooking shouldn't be complicated or stressful. It should be an act of joy, bringing people together around the table.
            </p>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Founded by passionate food enthusiasts, we curate recipes that are both accessible for beginners and exciting for seasoned chefs. Join us on this culinary journey.
            </p>
        </div>
    );
};

export default About;
