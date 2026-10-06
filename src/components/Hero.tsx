import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc3, Sparkles, ArrowDown, Upload, Check } from 'lucide-react';
import { Track } from '../types/music';
import heroBgCloud from '../assets/images/hero_cloud_abyss_1791209162952.jpg';

interface HeroProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onScrollTo: (id: string) => void;
  onUploadAudio?: (file: File) => void;
  hasCustomAudio?: boolean;
  isCurator?: boolean;
}

const ROLES = [
  '铜门律动玩家',
  'Guofeng Funk Groove',
  '金石丝竹放克客',
  '五音逍遥派',
];

export const Hero: React.FC<HeroProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onScrollTo,
  onUploadAudio,
  hasCustomAudio,
  isCurator = false,
}) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleFade, setRoleFade] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadAudio) {
      onUploadAudio(file);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleFade(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setRoleFade(true);
      }, 250);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] sm:min-h-screen flex flex-col justify-center items-center text-center px-6 pt-28 pb-20 overflow-hidden"
    >
      {/* Dynamic Cinematic Cloud Abyss Background Image (User Uploaded Artwork with Motion) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        <img
          src={heroBgCloud}
          alt="云海峡谷 · 铜门深处"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-110 saturate-105 animate-ken-burns scale-105"
        />

        {/* Dynamic Drifting Cloud Fog Overlay */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen animate-fog-drift pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)',
          }}
        />

        {/* Cinematic Golden Sunlight Rim Breathing Light */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-400/15 rounded-full blur-[130px] pointer-events-none animate-golden-rim" />

        {/* Ambient Dark Scrims ensuring flawless legibility and smooth page transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-[#08080b]/50 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#08080b]/30 to-[#08080b]/80 pointer-events-none" />
      </div>

      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-300/30 bg-black/40 backdrop-blur-xl mb-7 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[11px] sm:text-xs text-amber-200/90 uppercase tracking-[0.25em] font-mono">
          白果音乐 · 铜门秘境 · GUOFENG FUNK
        </span>
      </div>

      {/* Main Title: 铜门专属funk */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display italic tracking-tight text-white mb-6 leading-[0.92] drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
        铜门专属 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 font-normal">funk</span>
      </h1>

      {/* Dynamic Cycling Role Line */}
      <div className="text-lg sm:text-2xl md:text-3xl text-zinc-200 font-light mb-6 flex items-center justify-center gap-2 flex-wrap min-h-[44px]">
        <span className="text-zinc-400">一位</span>
        <span
          className={`font-display italic text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-normal inline-block border-b border-amber-500/40 pb-0.5 transition-all duration-300 ${
            roleFade
              ? 'opacity-100 transform translate-y-0 filter-none'
              : 'opacity-0 transform translate-y-2 filter blur-sm'
          }`}
        >
          {ROLES[roleIndex]}
        </span>
        <span className="text-zinc-400">的私人声音庇护所。</span>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-zinc-300/90 max-w-xl mx-auto mb-10 leading-relaxed font-normal drop-shadow-md">
        铜门启，云深动。当中国传统金石丝竹五声音阶，撞上骚动摇摆的放克贝斯（Slap Bass），在云海深渊之间唤醒独树一帜的东方律动灵魂。
      </p>

      {/* Hidden file input for direct audio replacement */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="inline-flex items-center gap-3 sm:gap-4 flex-wrap justify-center mb-12">
        <button
          onClick={onTogglePlay}
          className="group relative rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer shadow-xl shadow-amber-950/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 opacity-100 transition-opacity" />
          <div className="relative bg-zinc-950 text-white rounded-full px-6 py-2.5 transition-colors duration-300 flex items-center gap-2.5 font-medium">
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-amber-400 fill-current" />
                <span>暂停播放 · 一生所铜</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-amber-400 fill-current ml-0.5" />
                <span>试听一生所铜 · 铜门秘境</span>
              </>
            )}
          </div>
        </button>

        {/* Upload My Audio File Button (Curator Only) */}
        {isCurator && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative rounded-full p-[1.5px] transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl"
            title="上传您的原版 MP3/WAV 音乐文件，直接替换并永久保存"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/50 to-yellow-500/50 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative border border-amber-400/40 bg-[#121218]/90 backdrop-blur-xl text-amber-200 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2">
              {hasCustomAudio ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">已载入我的原声 (点击更换)</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>上传/载入我的音频文件</span>
                </>
              )}
            </div>
          </button>
        )}

        <button
          onClick={() => onScrollTo('featured')}
          className="group relative rounded-full p-[1.5px] transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 to-yellow-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative border border-white/20 group-hover:border-transparent bg-black/60 backdrop-blur-xl text-zinc-100 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2">
            <span>探索曲库</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </button>
      </div>

      {/* Now Playing Floating Card */}
      <div className="max-w-md w-full bg-zinc-900/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xl flex items-center justify-between gap-3 text-left shadow-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
            <img
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>NOW STREAMING</span>
            </div>
            <h4 className="text-sm font-medium text-white truncate">{currentTrack.title}</h4>
            <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current text-white" />
          ) : (
            <Play className="w-4 h-4 fill-current text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => onScrollTo('featured')}
        className="mt-12 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
      >
        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono group-hover:text-zinc-300 transition-colors">
          SCROLL
        </span>
        <div className="w-px h-8 bg-zinc-800 relative overflow-hidden">
          <div className="w-full h-3 accent-gradient rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
};
