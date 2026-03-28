"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const Clouds = () => (
  <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
    <path d="M100,100 Q120,70 150,100 Q180,70 200,100 Q220,130 150,130 Z" fill="var(--color-paper)" opacity="0.8" />
    <path d="M400,80 Q430,40 470,80 Q510,40 540,80 Q560,120 470,120 Z" fill="var(--color-paper)" opacity="0.9" />
    <path d="M700,120 Q720,90 750,120 Q780,90 800,120 Q820,150 750,150 Z" fill="var(--color-paper)" opacity="0.7" />
  </svg>
);

const Mountains = () => (
  <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
    <path d="M0,200 L150,50 L300,200 Z" fill="var(--color-rio)" />
    <path d="M200,200 L400,20 L600,200 Z" fill="var(--color-tide)" opacity="0.8" />
    <path d="M500,200 L700,60 L900,200 Z" fill="var(--color-rio)" />
    <path d="M800,200 L950,80 L1000,200 L0,200 Z" fill="var(--color-tide)" opacity="0.8" />
  </svg>
);

const Hills = () => (
  <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
    <path d="M0,200 L0,150 Q150,100 300,160 T600,130 T850,170 T1000,150 L1000,200 Z" fill="var(--color-moss)" />
    <path d="M0,200 L0,170 Q100,140 250,180 T500,150 T750,190 T1000,170 L1000,200 Z" fill="var(--color-mata)" />
  </svg>
);

const Foreground = () => (
  <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
    <g transform="translate(50, 110)">
      <rect x="10" y="20" width="8" height="30" fill="var(--color-madeira)" />
      <circle cx="14" cy="10" r="20" fill="var(--color-mata)" />
    </g>
    <g transform="translate(250, 80)">
      <rect x="10" y="20" width="10" height="40" fill="var(--color-madeira)" />
      <circle cx="15" cy="10" r="25" fill="var(--color-moss)" />
    </g>
    <g transform="translate(550, 120)">
      <rect x="10" y="20" width="8" height="30" fill="var(--color-madeira)" />
      <circle cx="14" cy="10" r="20" fill="var(--color-mata)" />
    </g>
    <g transform="translate(850, 90)">
      <rect x="10" y="20" width="10" height="35" fill="var(--color-madeira)" />
      <circle cx="15" cy="10" r="22" fill="var(--color-moss)" />
    </g>
  </svg>
);

const BackgroundLayer = ({ speed, className, opacity, scale, children }: { speed: number, className: string, opacity: number, scale: number, children: React.ReactNode }) => {
  return (
    <div className={`absolute w-full h-64 flex ${className}`} style={{ opacity, transform: `scale(${scale})`, transformOrigin: 'bottom' }}>
      <motion.div
        className="flex w-[200%]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        <div className="w-1/2 h-full flex items-end">
          {children}
        </div>
        <div className="w-1/2 h-full flex items-end">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const Track = () => {
  return (
    <div className="absolute bottom-0 w-full h-[80px] z-20 flex flex-col justify-start overflow-hidden border-t-4" style={{ backgroundColor: 'var(--color-ferrovia)', borderColor: 'var(--color-ink)' }}>
      <div className="w-full h-3 mt-2 shadow-inner" style={{ backgroundColor: 'var(--color-rust)' }}></div>
      <motion.div
        className="flex w-[200%] h-full mt-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
      >
        <div className="w-1/2 h-full flex justify-around items-start">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-sm shadow-md" style={{ backgroundColor: 'var(--color-madeira)' }}></div>
          ))}
        </div>
        <div className="w-1/2 h-full flex justify-around items-start">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-sm shadow-md" style={{ backgroundColor: 'var(--color-madeira)' }}></div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const SmokeEmitter = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      setParticles((prev) => [...prev.slice(-15), { id: id++, x: 125, y: 10 }]);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={8}
          fill="var(--color-muted)"
          initial={{ opacity: 0.9, scale: 0.5, cx: p.x, cy: p.y }}
          animate={{ opacity: 0, scale: 5, cx: p.x - 200, cy: p.y - 150 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      ))}
    </>
  );
};

const Wheel = ({ cx, cy, r, isDriving = false }: { cx: number, cy: number, r: number, isDriving?: boolean }) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <circle cx="0" cy="0" r={r} fill="var(--color-rust)" stroke="var(--color-ferrovia)" strokeWidth="4" />
        <circle cx="0" cy="0" r={r - 4} fill="transparent" stroke="var(--color-latao)" strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={(r * Math.cos((i * Math.PI) / 6)).toFixed(4)}
            y2={(r * Math.sin((i * Math.PI) / 6)).toFixed(4)}
            stroke="var(--color-ferrovia)"
            strokeWidth="2"
          />
        ))}
        {isDriving && (
          <circle cx={r * 0.6} cy="0" r="4" fill="var(--color-latao)" />
        )}
      </motion.g>
    </g>
  );
};

const ConnectingRod = () => {
  const steps = 30;
  const x = [];
  const y = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    x.push(15 * Math.cos(angle));
    y.push(15 * Math.sin(angle));
  }
  return (
    <motion.g
      animate={{ x, y }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    >
      <rect x="190" y="156" width="120" height="8" fill="var(--color-latao)" rx="4" stroke="var(--color-cobre)" strokeWidth="1" />
      <circle cx="190" cy="160" r="4" fill="var(--color-ferrovia)" />
      <circle cx="250" cy="160" r="4" fill="var(--color-ferrovia)" />
      <circle cx="310" cy="160" r="4" fill="var(--color-ferrovia)" />
    </motion.g>
  );
};

const PistonAssembly = () => {
  const steps = 30;
  const x1 = [];
  const x2 = [];
  const y2 = [];
  const cx = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const pinX = 190 + 15 * Math.cos(angle);
    const pinY = 160 + 15 * Math.sin(angle);
    x2.push(pinX);
    y2.push(pinY);
    const dx = Math.sqrt(60 * 60 - Math.pow(pinY - 160, 2));
    const crossheadX = pinX - dx;
    x1.push(crossheadX);
    cx.push(crossheadX - 10);
  }
  return (
    <>
      <motion.line
        y1="160"
        stroke="var(--color-latao)" strokeWidth="6"
        animate={{ x1, x2, y2 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.rect
        y="155" width="20" height="10" fill="var(--color-ferrovia)"
        animate={{ x: cx }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      {/* Piston shaft going into the box */}
      <motion.line
        y1="160" y2="160"
        x2="120"
        stroke="var(--color-latao)" strokeWidth="4"
        animate={{ x1: cx }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </>
  );
};

const Locomotive = () => {
  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      className="relative w-[500px] h-[250px]"
    >
      <svg width="100%" height="100%" viewBox="0 0 500 250" className="overflow-visible">
        <SmokeEmitter />
        
        {/* Tender (Coal Car) */}
        <g transform="translate(380, 70)">
          <rect x="0" y="0" width="100" height="90" fill="var(--color-ferrovia)" />
          <rect x="0" y="0" width="100" height="10" fill="var(--color-rust)" />
          <rect x="10" y="20" width="80" height="50" fill="var(--color-fuligem)" />
          {/* Coal */}
          <path d="M 10 0 Q 30 -20 50 0 T 90 0 Z" fill="var(--color-ink)" />
          {/* Tender Chassis */}
          <rect x="-10" y="90" width="120" height="15" fill="var(--color-rust)" />
          {/* Tender Wheels */}
          <Wheel cx={20} cy={115} r={15} />
          <Wheel cx={60} cy={115} r={15} />
          {/* Coupling */}
          <rect x="-20" y="95" width="20" height="5" fill="var(--color-cobre)" />
        </g>

        {/* Cab */}
        <rect x="280" y="40" width="90" height="120" fill="var(--color-ferrovia)" />
        <rect x="290" y="50" width="25" height="40" fill="var(--color-tide)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="330" y="50" width="25" height="40" fill="var(--color-tide)" stroke="var(--color-ink)" strokeWidth="2" />
        <rect x="275" y="30" width="100" height="10" fill="var(--color-rust)" rx="2" />
        <rect x="280" y="100" width="90" height="5" fill="var(--color-rust)" />

        {/* Boiler */}
        <rect x="100" y="60" width="180" height="80" fill="var(--color-fuligem)" />
        <rect x="100" y="60" width="180" height="15" fill="var(--color-ferrovia)" /> {/* Highlight */}
        <rect x="100" y="130" width="180" height="10" fill="var(--color-ink)" /> {/* Shadow */}
        
        {/* Boiler Bands */}
        <rect x="130" y="60" width="4" height="80" fill="var(--color-latao)" />
        <rect x="180" y="60" width="4" height="80" fill="var(--color-latao)" />
        <rect x="230" y="60" width="4" height="80" fill="var(--color-latao)" />

        {/* Domes on boiler */}
        <path d="M 150 60 Q 165 20 180 60 Z" fill="var(--color-ferrovia)" />
        <rect x="160" y="30" width="10" height="5" fill="var(--color-bronze)" /> {/* Brass detail */}
        
        <path d="M 220 60 Q 235 30 250 60 Z" fill="var(--color-ferrovia)" />
        <rect x="230" y="40" width="10" height="5" fill="var(--color-bronze)" />

        {/* Chimney */}
        <polygon points="110,60 115,10 145,10 135,60" fill="var(--color-ferrovia)" />
        <rect x="110" y="5" width="40" height="8" fill="var(--color-rust)" rx="2" />

        {/* Front Plate (Silver/Bronze) */}
        <rect x="70" y="60" width="30" height="80" fill="var(--color-bronze)" />
        <ellipse cx="70" cy="100" rx="15" ry="40" fill="var(--color-cobre)" />
        <ellipse cx="70" cy="100" rx="10" ry="30" fill="var(--color-rust)" />
        
        {/* Headlight */}
        <rect x="50" y="70" width="20" height="25" fill="var(--color-ferrovia)" />
        <circle cx="55" cy="82.5" r="10" fill="var(--color-amber)" />
        {/* Light beam */}
        <motion.polygon 
          points="50,82.5 -100,20 -100,145" 
          fill="url(#lightBeam)" 
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        />
        <defs>
          <linearGradient id="lightBeam" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Chassis / Frame */}
        <rect x="50" y="140" width="330" height="20" fill="var(--color-rust)" />
        <rect x="50" y="140" width="330" height="5" fill="var(--color-cobre)" /> {/* Highlight */}

        {/* Cowcatcher */}
        <polygon points="50,140 10,185 70,185 70,140" fill="var(--color-ferrovia)" />
        <line x1="25" y1="185" x2="60" y2="140" stroke="var(--color-latao)" strokeWidth="3" />
        <line x1="40" y1="185" x2="65" y2="140" stroke="var(--color-latao)" strokeWidth="3" />
        <line x1="55" y1="185" x2="70" y2="140" stroke="var(--color-latao)" strokeWidth="3" />

        {/* Wheels */}
        {/* Small front wheels */}
        <Wheel cx={90} cy={170} r={15} />
        <Wheel cx={130} cy={170} r={15} />

        {/* Large driving wheels */}
        <Wheel cx={190} cy={160} r={25} isDriving={true} />
        <Wheel cx={250} cy={160} r={25} isDriving={true} />
        <Wheel cx={310} cy={160} r={25} isDriving={true} />

        {/* Small back wheel */}
        <Wheel cx={360} cy={170} r={15} />

        {/* Connecting Rod */}
        <ConnectingRod />
        
        {/* Piston Box */}
        <rect x="110" y="150" width="40" height="20" fill="var(--color-bronze)" rx="2" />
        <rect x="115" y="155" width="30" height="10" fill="var(--color-cobre)" />
        
        {/* Piston Assembly */}
        <PistonAssembly />
      </svg>
    </motion.div>
  );
};

export default function TrainAnimation() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-end" style={{ backgroundColor: 'var(--color-tide)' }}>
      {/* Sun/Moon */}
      <div className="absolute top-10 right-20 w-24 h-24 rounded-full" style={{ backgroundColor: 'var(--color-amber)', boxShadow: '0 0 50px var(--color-amber)' }}></div>

      {/* Clouds */}
      <BackgroundLayer speed={60} className="top-10 z-0 h-40" opacity={0.8} scale={1}>
        <Clouds />
      </BackgroundLayer>

      {/* Mountains */}
      <BackgroundLayer speed={40} className="bottom-[120px] z-0" opacity={0.6} scale={1}>
        <Mountains />
      </BackgroundLayer>
      
      {/* Hills */}
      <BackgroundLayer speed={20} className="bottom-[80px] z-10" opacity={1} scale={1}>
        <Hills />
      </BackgroundLayer>
      
      {/* Foreground Trees */}
      <BackgroundLayer speed={10} className="bottom-[60px] z-20" opacity={1} scale={1}>
        <Foreground />
      </BackgroundLayer>

      {/* Track */}
      <Track />

      {/* Train */}
      <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 z-30">
        <Locomotive />
      </div>
    </div>
  );
}
