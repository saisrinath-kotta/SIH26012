import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCENE_CONFIG } from '../../data/cityData';

function SceneTitleContent({ config }) {
  const [showSecondaryText, setShowSecondaryText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondaryText(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1.5"
    >
      {/* Phase Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-2xl">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span className="font-mono text-[11px] font-bold tracking-widest text-sky-400 uppercase">
          {config.badge}
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-[11px] font-medium text-slate-300">
          {config.phase}
        </span>
      </div>

      {/* Main Cinematic Title Card */}
      <div className="flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl bg-slate-950/80 border border-slate-700/80 backdrop-blur-md shadow-2xl">
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
          {config.title}
        </h1>

        {/* Secondary Subtitle with cinematic delayed fade-in */}
        <AnimatePresence>
          {showSecondaryText && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm font-medium tracking-wide text-sky-200 max-w-xl"
            >
              {config.subtitle}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CinematicTitles({ currentScene }) {
  const config = SCENE_CONFIG.find((s) => s.id === currentScene) || SCENE_CONFIG[0];

  return (
    <div className="absolute top-16 left-0 right-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 z-20">
      <AnimatePresence mode="wait">
        <SceneTitleContent key={currentScene} config={config} />
      </AnimatePresence>
    </div>
  );
}
