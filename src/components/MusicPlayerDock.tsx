import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  BookOpen,
  Radio,
} from 'lucide-react';
import { Track } from '../types/music';
import { audioEngine } from '../utils/audioEngine';

interface MusicPlayerDockProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFav: boolean;
  onToggleLike: (trackId: string) => void;
  onOpenStory: (track: Track) => void;
}

export const MusicPlayerDock: React.FC<MusicPlayerDockProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  isFav,
  onToggleLike,
  onOpenStory,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack.durationSeconds || 240);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isVinylNoise, setIsVinylNoise] = useState(true);

  // Sync audio time update
  useEffect(() => {
    audioEngine.setOnTimeUpdate((curr, dur) => {
      setCurrentTime(curr);
      if (dur > 0) setDuration(dur);
    });
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioEngine.seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    audioEngine.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const toggleVinyl = () => {
    const next = !isVinylNoise;
    setIsVinylNoise(next);
    audioEngine.toggleVinylNoise(next);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-40 px-3 sm:px-6 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-4xl bg-[#121218]/95 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-full p-2.5 sm:px-6 sm:py-3 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-6 transition-all">
        {/* Left: Track Info & Quick Heart */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Spinning Disc Cover */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/15 bg-zinc-900 shadow-md">
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className={`w-full h-full object-cover ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Title & Artist */}
            <div className="min-w-0 max-w-[130px] sm:max-w-[170px]">
              <h4 className="text-xs sm:text-sm font-medium text-white truncate">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate font-mono">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Like */}
            <button
              onClick={() => onToggleLike(currentTrack.id)}
              className="p-2 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              title={isFav ? '已收藏' : '加入收藏'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? 'fill-red-500 text-red-500' : 'text-zinc-400'
                }`}
              />
            </button>

            {/* Read Story */}
            <button
              onClick={() => onOpenStory(currentTrack)}
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer sm:hidden"
              title="查看故事"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Controls & Timeline Scrub */}
        <div className="flex flex-col items-center w-full sm:max-w-md gap-1">
          {/* Main Control Buttons */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1 text-xs transition-colors hidden sm:block ${
                isShuffle ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="随机播放"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onPrev}
              className="p-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="上一曲"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="下一曲"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsLoop(!isLoop)}
              className={`p-1 text-xs transition-colors hidden sm:block ${
                isLoop ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="单曲循环"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scrub Slider Bar with Timestamps */}
          <div className="w-full flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-zinc-500 tabular-nums">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-700/80 rounded-full appearance-none cursor-pointer accent-blue-400"
            />
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Sound Controls & Story Trigger */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Vinyl crackle toggle button */}
          <button
            onClick={toggleVinyl}
            className={`p-1.5 rounded-full border text-xs font-mono transition-colors ${
              isVinylNoise
                ? 'border-blue-500/40 text-blue-300 bg-blue-500/10'
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="黑胶唱针微底噪开关"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-400"
            />
          </div>

          {/* Story Drawer Trigger */}
          <button
            onClick={() => onOpenStory(currentTrack)}
            className="px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700/60"
            title="阅读唱片笔记"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>手记</span>
          </button>
        </div>
      </div>
    </div>
  );
};
