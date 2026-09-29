import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Film,
  Eye
} from 'lucide-react';
import { SCENE_CONFIG } from '../../data/cityData';

export default function CinematicController({
  currentScene,
  onSceneChange,
  isPlaying,
  onTogglePlay,
  mode,
  onToggleMode,
  onReset
}) {

  return (
    <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-3 px-4 pointer-events-none select-none">
      {/* Scene Navigation Bar */}
      <div className="pointer-events-auto glass-panel px-4 py-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl w-full border border-slate-700/60 shadow-2xl">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset to Scene 01"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSceneChange(Math.max(1, currentScene - 1))}
            disabled={currentScene === 1}
            title="Previous Scene"
            className={`p-2 rounded-xl border border-slate-700/60 transition-all ${
              currentScene === 1
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause Sequence' : 'Play Cinematic Sequence'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSceneChange(Math.min(12, currentScene + 1))}
            disabled={currentScene === 12}
            title="Next Scene"
            className={`p-2 rounded-xl border border-slate-700/60 transition-all ${
              currentScene === 12
                ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Timeline Scrubber Dots */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {SCENE_CONFIG.map((scene) => (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene.id)}
              title={`${scene.badge}: ${scene.title}`}
              className={`transition-all rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                currentScene === scene.id
                  ? 'w-7 h-7 bg-sky-400 text-slate-950 ring-2 ring-sky-400/40 shadow-lg shadow-sky-400/30 scale-110'
                  : 'w-6 h-6 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {scene.id}
            </button>
          ))}
        </div>

        {/* Right: Mode Switcher (Cinematic vs Explore) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMode}
            title={mode === 'CINEMATIC' ? 'Switch to Interactive Explore Mode' : 'Switch to Director Cinematic Mode'}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              mode === 'EXPLORE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/15'
                : 'bg-slate-800/80 text-sky-300 border-slate-700/60 hover:bg-slate-700'
            }`}
          >
            {mode === 'EXPLORE' ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXPLORE</span>
              </>
            ) : (
              <>
                <Film className="w-3.5 h-3.5 text-sky-400" />
                <span>CINEMATIC</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Explore Mode Active Hint */}
      {mode === 'EXPLORE' && (
        <div className="pointer-events-auto bg-slate-950/85 px-3 py-1 rounded-full border border-emerald-500/30 text-[11px] font-mono text-emerald-400 flex items-center gap-2 shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Interactive Orbit Active: Left Click Rotate • Right Click Pan • Scroll Zoom</span>
        </div>
      )}
    </div>
  );
}
