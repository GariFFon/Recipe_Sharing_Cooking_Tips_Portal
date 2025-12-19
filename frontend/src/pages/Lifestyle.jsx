import React, { useEffect } from 'react';
import './Lifestyle.css';

const sections = [
    {
        id: 1,
        title: "The Slow Morning",
        subtitle: "Rituals",
        text: "Start your day with intention. A slow morning isn't about laziness; it's about grounding yourself before the world demands your energy. Brew your coffee with care, listen to the silence, and breathe.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "left"
    },
    {
        id: 2,
        title: "Mindful Spaces",
        subtitle: "Environment",
        text: "Your home is a reflection of your mind. Clear the clutter to clear your thoughts. We explore how minimal design and natural materials can create a sanctuary of peace in a chaotic world.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "right"
    },
    {
        id: 3,
        title: "Culinary Arts",
        subtitle: "Nourishment",
        text: "Cooking is an act of love. It transforms simple ingredients into memories. Discover the joy of seasonal eating and the art of plating that turns every meal into a celebration.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", // Culinary replacement
        align: "left"
    },
    {
        id: 4,
        title: "Sustainable Habits",
        subtitle: "Conscious Living",
        text: "Small choices ripple outward. From zero-waste kitchen swaps to ethically sourced linens, we explore how to live lighter on the earth without sacrificing beauty or comfort.",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", // Sustainable
        align: "right"
    },
    {
        id: 5,
        title: "Community & Gathering",
        subtitle: "Connection",
        text: "The table is where we connect. It’s where stories are shared and bonds are strengthened. Learn how to host with grace, creating an atmosphere where everyone feels welcome.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "left"
    }
];

const Lifestyle = () => {

    // Simple scroll effect logic (optional, for parallax)
    useEffect(() => {
        const handleScroll = () => {
            const parallaxEls = document.querySelectorAll('.parallax-img');
            parallaxEls.forEach(el => {
                // Parallax logic if needed
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="lifestyle-page">
            <header className="life-hero-fullscreen">
                <div className="life-hero-content">
                    <h1 className="life-mega-title">
                        Living <br /> <em>Intentionally</em>
                    </h1>
                    <div className="scroll-indicator">
                        <span className="scroll-text">SCROLL</span>
                        <div className="mouse-icon">
                            <div className="wheel"></div>
                        </div>
                        <div className="scroll-line"></div>
                    </div>
                </div>
            </header>

            <div className="life-content-wrapper">
                {sections.map(section => (
                    <section key={section.id} className={`life-section align-${section.align}`}>
                        <div className="life-img-wrapper">
                            <div
                                className="life-img parallax-img"
                                style={{ backgroundImage: `url(${section.image})` }}
                            ></div>
                        </div>
                        <div className="life-text-content">
                            <span className="life-section-subtitle">{section.subtitle}</span>
                            <h2 className="life-section-title">{section.title}</h2>
                            <p className="life-section-desc">{section.text}</p>
                            <button className="life-btn-underline">Read Story</button>
                        </div>
                    </section>
                ))}
            </div>

            <section className="life-quote-fullscreen">
                <div className="quote-overlay"></div>
                <div className="quote-content">
                    <p>"Simplicity is the ultimate sophistication."</p>
                    <span>— Leonardo da Vinci</span>
                </div>
            </section>

            <section className="life-footer-simple">
                <div className="container">
                    <h3 className="footer-heading">Continue the Journey</h3>
                    <div className="footer-links">
                        <span className="footer-link">Wellness</span>
                        <span className="separator">/</span>
                        <span className="footer-link">Design</span>
                        <span className="separator">/</span>
                        <span className="footer-link">Travel</span>
                        <span className="separator">/</span>
                        <span className="footer-link">Shop</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Lifestyle;
