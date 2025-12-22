import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import './SwipeCards.css';

const SwipeCards = () => {
  const [cards, setCards] = useState(cardData);

  return (
    <div className="swipe-section-wrapper">
      {/* Section Header */}
      <div className="swipe-section-header">
        <span className="script-sub">Explore & Discover</span>
        <h2 className="section-title">Swipe Through Deliciousness</h2>
      </div>

      {/* Cards Container with Visual Indicators */}
      <div className="swipe-cards-wrapper">
        {/* Left Visual Indicator (non-interactive) */}
        {cards.length > 0 && (
          <div className="swipe-indicator swipe-indicator-left">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
        )}

        {/* Cards */}
        <div className="swipe-cards-container">
          {cards.length === 0 ? (
            <div className="swipe-empty-state">
              <button
                className="swipe-reset-btn"
                onClick={() => setCards(cardData)}
              >
                Reset
              </button>
            </div>
          ) : (
            <>
              {cards.map((card, index) => {
                return (
                  <Card
                    key={card.id}
                    cards={cards}
                    setCards={setCards}
                    isFront={index === cards.length - 1}
                    {...card}
                  />
                );
              })}
              {/* Hover Hint - Only show on front card */}
              <div className="swipe-hint">
                <span className="swipe-hint-text">← Swipe Me →</span>
                <span className="swipe-hint-subtext">Drag to discover more</span>
              </div>
            </>
          )}
        </div>

        {/* Right Visual Indicator (non-interactive) */}
        {cards.length > 0 && (
          <div className="swipe-indicator swipe-indicator-right">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ id, url, setCards, cards, isFront }) => {
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    const xValue = x.get();
    if (Math.abs(xValue) > 50) {
      setCards((pv) => pv.filter((v) => v.id !== id));
    }
  };

  return (
    <motion.img
      src={url}
      alt="Swipeable card"
      className="swipe-card"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragElastic={1}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => isFront && setIsHovered(true)}
      onMouseLeave={() => isFront && setIsHovered(false)}
    />
  );
};

export default SwipeCards;

const cardData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=650&h=850&auto=format&fit=crop",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=650&h=850&auto=format&fit=crop",
  },
];
