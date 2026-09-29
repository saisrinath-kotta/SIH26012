import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Video, Square, Download, X, RefreshCw, AlertCircle, Camera } from 'lucide-react';
import { CanvasVideoRecorder } from '../../utils/recordingUtils';

export default function VideoRecorderModal({
  isOpen,
  onClose,
  canvasElement,
  onTakeSnapshot,
  onRecordingStateChange
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const timerRef = useRef(null);

  const recorder = useMemo(() => {
    return canvasElement ? new CanvasVideoRecorder(canvasElement) : null;
  }, [canvasElement]);

  // Handle timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const nextSec = prev + 1;
          if (onRecordingStateChange) onRecordingStateChange(true, nextSec);
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (onRecordingStateChange) onRecordingStateChange(false, 0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, onRecordingStateChange]);

  const handleStart = () => {
    setErrorMsg(null);
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);
    try {
      if (!recorder) {
        throw new Error('3D Canvas is initializing. Please try again.');
      }
      recorder.startRecording(30);
      setIsRecording(true);
    } catch (err) {
      setErrorMsg(err.message || 'Browser failed to initialize canvas stream.');
    }
  };

  const handleStop = async () => {
    if (!recorder || !isRecording) return;
    try {
      const result = await recorder.stopRecording();
      setIsRecording(false);
      setRecordedVideoUrl(result.url);
    } catch (err) {
      setErrorMsg('Error finalizing video recording: ' + err.message);
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (!recordedVideoUrl) return;
    CanvasVideoRecorder.downloadRecording(
      recordedVideoUrl,
      `cadastral_3d_flight_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.webm`
    );
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 border border-slate-700/80 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">3D Cadastre Flight Recorder</h2>
              <p className="text-xs text-slate-400">
                Direct WebGL canvas capture & high-definition screen video
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Video Preview or Recording Status */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden">
          {isRecording ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-semibold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>RECORDING 3D CANVAS</span>
              </div>
              <div className="text-4xl font-mono font-extrabold text-white tracking-wider">
                {formatTimer(recordingSeconds)}
              </div>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                Interact with the 3D scene, fly across parcels, or cycle layers. The stream is capturing at 30 FPS.
              </p>
            </div>
          ) : recordedVideoUrl ? (
            <div className="w-full flex flex-col items-center gap-3">
              <video
                src={recordedVideoUrl}
                controls
                autoPlay
                className="w-full max-h-48 rounded-lg border border-slate-700 bg-black"
              />
              <span className="text-xs text-emerald-400 font-medium">
                Flight capture complete! Ready to save.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <Video className="w-10 h-10 text-slate-600 mb-1" />
              <p className="text-sm font-semibold text-slate-300">Ready to record 3D scene</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Records your camera fly-throughs, parcel selections, and strata view toggles directly to a standard WebM video file.
              </p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onTakeSnapshot}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 border border-slate-700/80 transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Save Snapshot</span>
          </button>

          <div className="flex items-center gap-2">
            {isRecording ? (
              <button
                onClick={handleStop}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Recording</span>
              </button>
            ) : recordedVideoUrl ? (
              <>
                <button
                  onClick={handleStart}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video (.webm)</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>Start Recording</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
