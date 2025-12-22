import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import './SwipeCards.css';

const SwipeCards = () => {
  const [cards, setCards] = useState(cardData);

  return (
    <div className="swipe-cards-container">
      {cards.map((card) => {
        return (
          <Card key={card.id} cards={cards} setCards={setCards} {...card} />
        );
      })}
    </div>
  );
};

const Card = ({ id, url, setCards, cards }) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

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
