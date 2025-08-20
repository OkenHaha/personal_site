import React from 'react';
import './Home2.scss';

const InfinityAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Scale canvas for better rendering
    canvas.width = 400 * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = '400px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);
    
    const centerX = 200; // Half of 400px
    const centerY = 100; // Half of 200px
    const a = 60;     // overall size
    const stretch = 1.8; // widen factor
    let t = 0;
    const speed = 0.01;
    
    function draw() {
      ctx.clearRect(0, 0, 400, 200);
      
      // Draw infinity path
      ctx.beginPath();
      for (let p = 0; p < Math.PI * 2; p += 0.01) {
        const x = centerX + (a * Math.cos(p) * stretch);
        const y = centerY + (a * Math.sin(p) * Math.cos(p));
        if (p === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Dot position
      const x = centerX + (a * Math.cos(t) * stretch);
      const y = centerY + (a * Math.sin(t) * Math.cos(t));
      
      // Moving dot
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      
      t += speed;
      requestAnimationFrame(draw);
    }
    
    draw();
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="infinity-canvas"
    />
  );
};



const Home2 = () => {
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const section1 = document.querySelector('.section1');
      
      if (section1) {
        // blur grows as you scroll down (max ~10px)
        const blurAmount = Math.min(scrollY / 50, 10); 
        section1.style.filter = `blur(${blurAmount}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Create bugs dynamically
  const bugs = Array.from({ length: 17 }, (_, i) => {
    const size = 2 + Math.random() * 3;
    const initialX = 45 + Math.random() * 10; 
    const initialY = 45 + Math.random() * 20;
    
    return (
      <div 
        key={i}
        className="bug"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${initialX}%`,
          top: `${initialY}%`,
          '--radius': `${10 + Math.random() * 20}px`,
          '--angle': `${Math.random() * 360}deg`,
          '--rotation-direction': Math.random() > 0.5 ? '1' : '-1',
          '--speed': `${0.03 + Math.random() * 0.03}`,
          '--drift-direction': Math.random() > 0.5 ? '1' : '-1',
          '--drift-distance': `${80 + Math.random() * 40}px`
        }}
      />
    );
  });

  return (
    <>
    <section className="section1">
      <div className="lamp-background">
        <div className="glow-base"></div>
        
        {bugs}
        
        <div className="infinity-animation">
          <InfinityAnimation />
        </div>
        
        <section className="h-screen flex flex-col items-center justify-center bg-black">
          <h1 className="text-6xl mt-24 font-bold text-white mb-4">Welcome</h1>
        </section>
        
        {/* Scroll Text */}
        <div className="scroll-indicator">
          <div className="arrow-animation">
            <div className="arrow-container">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="arrow-down"
              >
                <polyline className="arrow-point1" points="7 13 12 18 17 13"></polyline>
                <polyline className="arrow-point2" points="7 6 12 11 17 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
        
      </div>
      <div className="text-overlay">
        <h1 className="text-9xl font-bold text-white mb-4">W E L C O M E</h1>
        {/* <p className="text-xl text-gray-300">Discover the infinite possibilities.</p> */}
      </div>
    </section>


      <section className="section-2">
        <h2>Section 2</h2>
        <p>This slides up and covers the hero.</p>
      </section>

      <section className="section-3">
        <h2>Section 3</h2>
        <p>More content…</p>
      </section>

    </>
  );
};

export default Home2;