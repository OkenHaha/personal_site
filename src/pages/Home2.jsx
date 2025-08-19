import React from 'react';
import './Home2.scss';

const Home2 = () => {
  return (
    <div className="home2-container">
      <div className="lamp-background">
        {/* Base layer for light to blend into (simulates illuminated floor/wall) */}
        <div className="glow-base"></div>

        {/* The glowing light effect from the lamp */}
        <div className="light-triangle"></div>
      </div>
    </div>
  );
};

export default Home2;