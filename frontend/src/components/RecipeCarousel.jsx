import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import RecipeCard from './RecipeCard';
import { FaCertificate } from "react-icons/fa"; // Premium Icon

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import './RecipeCarousel.css';

const RecipeCarousel = ({ title, recipes }) => {
    return (
        <div className="recipe-carousel-container">
            <div className="carousel-header">
                <div className="cuisine-badge">
                    <FaCertificate className="cuisine-icon" />
                    <h3 className="carousel-title">{title}</h3>
                </div>
                <div className="recipe-count">{recipes.length} Recipes</div>
            </div>

            <div className="carousel-wrapper">
                <Swiper
                    modules={[Navigation, FreeMode, Mousewheel]}
                    spaceBetween={10} // Reduced mobile spacing
                    slidesPerView={'auto'} // Default mobile view
                    centeredSlides={false} // Disable auto-centering
                    slidesOffsetBefore={10} // Forces 10px from Left
                    slidesOffsetAfter={10} // Fixed right gap
                    freeMode={true}
                    grabCursor={true}
                    mousewheel={{
                        forceToAxis: true,
                        sensitivity: 1,
                        releaseOnEdges: true,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    className="mySwiper"
                    style={{ padding: '20px 10px 40px 10px' }} // Padding for shadows/hover
                    breakpoints={{
                        320: {
                            centeredSlides: false, // FORCE Left Align
                            slidesPerView: 'auto',
                            spaceBetween: 20, // Standardized Gap
                            slidesOffsetBefore: 26, // Left gap
                            slidesOffsetAfter: 20, // Standardized End Offset
                        },
                        768: {
                            centeredSlides: false, // Desktop: Not centered
                            slidesPerView: 'auto',
                            spaceBetween: 30,
                        }
                    }}
                >
                    {recipes.map((recipe) => (
                        <SwiperSlide key={recipe._id} className="carousel-slide-custom">
                            <div className="carousel-item swiper-slide-custom">
                                <RecipeCard recipe={recipe} />
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* Custom Nav Buttons */}
                    <div className="swiper-button-prev carousel-nav-btn left">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                    <div className="swiper-button-next carousel-nav-btn right">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </Swiper>
            </div>
        </div>
    );
};

export default RecipeCarousel;

