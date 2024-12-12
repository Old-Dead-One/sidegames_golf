import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import Cookie from 'js-cookie';
import { useEffect } from 'react';
import find_a_game_blue from '../assets/find_a_game_blue.png';
// import find_a_game_green from '../assets/find_a_game_green.png';
import find_a_game_orange from '../assets/find_a_game_orange.png';
import find_a_game_pink from '../assets/find_a_game_pink.png';
import find_a_game_purple from '../assets/find_a_game_purple.png';
import background_pink from '../assets/background_pink.png';
import background_blue from '../assets/background_blue.png';
import background_green from '../assets/background_green.png';
import background_grey from '../assets/background_grey.png';
import background_purple from '../assets/background_purple.png';

interface CenteredGraphicProps {
  setNavbarColor: (color: string) => void;
  setBgColor: (color: string) => void;
}

const CenteredGraphic: React.FC<CenteredGraphicProps> = ({ setNavbarColor, setBgColor }) => {
  const location = useLocation();
  const images = [
    { src: find_a_game_blue, color: '#66d3fa', bg: background_blue },
    // { src: find_a_game_green, color: '#0062b8', bg: background_blue },
    { src: find_a_game_blue, color: '#25f78c', bg: background_green },
    { src: find_a_game_orange, color: '#808080', bg: background_grey },
    { src: find_a_game_purple, color: '#f72585', bg: background_pink },
    { src: find_a_game_pink, color: '#9159fe', bg: background_purple },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load theme from cookies on component mount
  useEffect(() => {
    const savedThemeIndex = Cookie.get('themeIndex');
    if (savedThemeIndex) {
      setCurrentImageIndex(Number(savedThemeIndex));
      setNavbarColor(images[Number(savedThemeIndex)].color);
      setBgColor(images[Number(savedThemeIndex)].bg);
    }
  }, [setNavbarColor, setBgColor]);

  const toggleImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % images.length;
      setNavbarColor(images[newIndex].color);
      // Save the new theme index to cookies
      Cookie.set('themeIndex', newIndex.toString());
      setBgColor(images[newIndex].bg)
      return newIndex;
    });
  };

  const showAdjustmentsIcon = location.pathname === '/' || location.pathname === '/Dashboard';

  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center
      "
      style={{
        backgroundImage: `url(${images[currentImageIndex].bg})`,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      <img
        src={images[currentImageIndex].src}
        alt="Find a Game"
        className="w-3/4 sm:w-4/5 md:w-2/3 lg:w-1/2 h-auto transform translate-x-[-13%] translate-y-[9%]"
        style={{ zIndex: 2 }} // Ensure this is lower than the Cart component
      />
      {showAdjustmentsIcon && (
        <AdjustmentsHorizontalIcon
          onClick={toggleImage}
          className=" h-6 w-6 absolute top-14 left-5 transform -translate-x-1/2 text-white cursor-pointer "
          style={{ fontSize: 10, backgroundColor: 'transparent', zIndex: 50 }}
        />
      )}
    </div>
  );
};

export default CenteredGraphic;