import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import TextPressure from '../components/TextPressure';
import FocusReveal from '../components/FocusReveal';
import GravityDots from '../components/GravityDots';
import PopModal from '../components/PopModal';
import './Lifestyle.css';

const sections = [
    {
        id: 1,
        title: "The Slow Morning",
        subtitle: "Rituals",
        text: "Start your day with intention. A slow morning isn't about laziness; it's about grounding yourself before the world demands your energy. Brew your coffee with care, listen to the silence, and breathe.",
        fullText: "The art of the slow morning begins before sunrise. It's a deliberate choice to resist the rush, to savor the quiet hours when the world is still asleep. This isn't about waking up at 4 AM or following a rigid routine—it's about creating space for yourself.\n\nStart with a simple ritual: brewing coffee or tea with full attention. Feel the warmth of the cup in your hands. Notice the aroma. These small moments of mindfulness set the tone for your entire day. Consider journaling for just five minutes, not to solve problems, but to acknowledge them. Stretch your body gently, honoring its need for movement after rest.\n\nThe slow morning is your gift to yourself—a buffer between sleep and the demands of the day. It's where clarity lives, where creativity awakens, and where you remember who you are before the world tells you who to be.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        modalImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "left"
    },
    {
        id: 2,
        title: "Mindful Spaces",
        subtitle: "Environment",
        text: "Your home is a reflection of your mind. Clear the clutter to clear your thoughts. We explore how minimal design and natural materials can create a sanctuary of peace in a chaotic world.",
        fullText: "Our environments shape us more than we realize. A cluttered space creates mental noise; a thoughtful space invites calm. Mindful living isn't about perfection or minimalism for its own sake—it's about intentionality.\n\nBegin by observing your space. What brings you joy? What drains your energy? Keep only what serves a purpose or sparks genuine happiness. Natural materials—wood, linen, stone—ground us in ways that plastic and synthetic fabrics cannot. They age beautifully, telling stories of use and care.\n\nConsider light as a design element. Morning sun streaming through sheer curtains, the warm glow of a lamp in the evening—these moments matter. Plants bring life and breath to your space. Even a single potted herb on a windowsill can transform your relationship with your home.\n\nYour space should be a sanctuary, not a showroom. It should whisper 'rest here' rather than shout 'look at me.' This is where you restore yourself, where you can simply be.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        modalImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "right"
    },
    {
        id: 3,
        title: "Culinary Arts",
        subtitle: "Nourishment",
        text: "Cooking is an act of love. It transforms simple ingredients into memories. Discover the joy of seasonal eating and the art of plating that turns every meal into a celebration.",
        fullText: "Cooking is one of the most fundamental acts of care we can offer—to ourselves and to others. It's alchemy: transforming raw ingredients into nourishment, comfort, and joy. When we cook with intention, we're not just feeding bodies; we're creating experiences and memories.\n\nSeasonal eating connects us to the rhythm of nature. Tomatoes in summer taste like sunshine. Root vegetables in winter ground us. Shopping at farmers markets, touching produce, talking to growers—these rituals matter. They remind us that food has a story before it reaches our plates.\n\nThe art of plating isn't about Instagram-worthy perfection. It's about honoring the food and the people you're serving. A simple garnish of fresh herbs, the way you arrange vegetables on a plate—these small gestures say 'I care about this moment with you.'\n\nCook slowly when you can. Let sauces simmer, let dough rest, let flavors develop. The kitchen is where we practice patience, creativity, and generosity. It's where we transform ingredients into love.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        modalImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "left"
    },
    {
        id: 4,
        title: "Sustainable Habits",
        subtitle: "Conscious Living",
        text: "Small choices ripple outward. From zero-waste kitchen swaps to ethically sourced linens, we explore how to live lighter on the earth without sacrificing beauty or comfort.",
        fullText: "Sustainable living isn't about perfection—it's about progress. Every small choice matters: the reusable bag you remember, the plastic you refuse, the local business you support. These decisions ripple outward in ways we may never see.\n\nStart in your kitchen: glass jars instead of plastic containers, cloth napkins instead of paper, composting your scraps. These aren't sacrifices; they're upgrades. Natural materials feel better, last longer, and honor the earth that provides for us.\n\nConsider the lifecycle of what you buy. Who made it? Under what conditions? Will it last? Can it be repaired? These questions transform shopping from mindless consumption into conscious curation. Buy less, choose better, make it last.\n\nSustainability is also about community. Share resources with neighbors. Repair instead of replace. Support local makers and farmers. These choices build resilience—personal and collective. They remind us that we're part of something larger, that our actions matter, that another way of living is possible.",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        modalImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "right"
    },
    {
        id: 5,
        title: "Community & Gathering",
        subtitle: "Connection",
        text: "The table is where we connect. It's where stories are shared and bonds are strengthened. Learn how to host with grace, creating an atmosphere where everyone feels welcome.",
        fullText: "The table is sacred ground. It's where we gather, where we share not just food but stories, laughter, and presence. In our hyper-connected yet often isolated world, the simple act of gathering around a table becomes revolutionary.\n\nHosting isn't about impressing people with elaborate meals or perfect decor. It's about creating space where people feel seen and welcomed. Light candles. Put phones away. Ask real questions and listen to the answers. The magic isn't in the menu—it's in the attention you give.\n\nSet the table with care, even for simple meals. Cloth napkins, real plates, flowers from your garden or the corner store. These gestures say 'you matter, this moment matters.' They slow us down and remind us that eating together is about more than just consuming calories.\n\nCreate rituals: Sunday dinners, seasonal gatherings, potlucks with neighbors. These regular touchpoints build community and continuity. They give us something to look forward to, something to belong to. In a world that often feels fragmented, the table brings us back together.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        modalImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        align: "left"
    }
];

const Lifestyle = () => {
    const [selectedSection, setSelectedSection] = useState(null);

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
            {/* 1. Hero Section - Sticky Note Style (Gravity Dots Background) */}
            <header className="life-hero-fullscreen">
                <GravityDots className="dots-background">
                    <div className="life-hero-content">
                        <div style={{ position: 'relative', height: 'auto', width: '100%', maxWidth: '1400px' }}>
                            <TextPressure
                                text="Living|Intentionally"
                                fontFamily="Playfair Display"
                                fontUrl="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
                                flex={false}
                                alpha={false}
                                stroke={false}
                                width={true}
                                weight={true}
                                italic={true}
                                textColor="var(--life-hero-text)"
                                minFontSize={80}
                                scale={false}
                            />
                        </div>
                    </div>
                </GravityDots>
            </header>

            {/* Standalone Scroll Indicator Section */}
            <div className="scroll-indicator-section">
                <div className="scroll-indicator">
                    <span className="scroll-text">SCROLL</span>
                    <div className="mouse-icon">
                        <div className="wheel"></div>
                    </div>
                    <div className="scroll-line"></div>
                </div>
            </div>

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
                            <button
                                className="life-btn-underline"
                                onClick={() => setSelectedSection(section)}
                            >
                                Read Story
                            </button>
                        </div>
                    </section>
                ))}
            </div>

            <section className="life-quote-fullscreen">
                <div className="quote-overlay"></div>
                <div className="quote-content">
                    <FocusReveal text="Simplicity is the ultimate sophistication." />

                    <div className="quote-attribution">
                        <span className="attribution-line"></span>
                        <span className="attribution-text">Leonardo da Vinci</span>
                        <span className="attribution-line"></span>
                    </div>
                </div>
            </section>


            {/* Removed Simple Footer Section as requested */}
            {/* Removed Simple Footer Section as requested */}
            <Footer />

            <PopModal
                isOpen={!!selectedSection}
                onClose={() => setSelectedSection(null)}
                content={selectedSection}
            />
        </div>
    );
};

export default Lifestyle;
