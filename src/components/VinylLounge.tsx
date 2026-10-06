import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Sparkles, Disc, Radio, Sliders } from 'lucide-react';
import { Track } from '../types/music';
import { audioEngine } from '../utils/audioEngine';

interface VinylLoungeProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (track: Track) => void;
  tracks: Track[];
}

export const VinylLounge: React.FC<VinylLoungeProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  tracks,
}) => {
  const [rpm, setRpm] = useState<33 | 45>(33);
  const [vinylCrackle, setVinylCrackle] = useState(true);
  const [frequencies, setFrequencies] = useState<number[]>(new Array(24).fill(10));
  const animRef = useRef<number | null>(null);

  // Toggle vinyl noise
  const handleToggleVinylCrackle = () => {
    const nextState = !vinylCrackle;
    setVinylCrackle(nextState);
    audioEngine.toggleVinylNoise(nextState);
  };

  // Toggle RPM
  const handleRpmChange = (newRpm: 33 | 45) => {
    setRpm(newRpm);
    audioEngine.setSpeed(newRpm === 45 ? 1.25 : 1.0);
  };

  // Real-time frequency bars
  useEffect(() => {
    const dataArray = new Uint8Array(24);

    const updateFrequencies = () => {
      if (isPlaying) {
        audioEngine.getFrequencyData(dataArray);
        const mapped = Array.from(dataArray).map((v) => Math.max(8, (v / 255) * 60));
        setFrequencies(mapped);
      } else {
        setFrequencies(new Array(24).fill(6));
      }
      animRef.current = requestAnimationFrame(updateFrequencies);
    };

    animRef.current = requestAnimationFrame(updateFrequencies);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  return (
    <section id="vinyl-lab" className="relative bg-[#08080b] py-24 md:py-36 border-t border-zinc-800/40 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-16 md:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-xs text-zinc-400 uppercase tracking-[0.3em] font-mono">
              Sound Lab & Vinyl Lounge
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight mb-4">
            Analog <span className="font-display italic text-zinc-100">ritual</span>
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
            交互式黑胶唱机与声音调谐实验室。唱针降落于微观凹槽，感受纯粹的模拟物理触感。
          </p>
        </div>

        {/* Main Turntable Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-[1100px] mx-auto">
          {/* Turntable Platter Unit (Span 7) */}
          <div className="lg:col-span-7 bg-[#121218] border border-zinc-800 rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Turntable Body Details */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(78,133,191,0.8)]" />
                <span className="text-xs font-mono tracking-widest text-zinc-300">
                  ECHO-DECK MK II
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  DIRECT DRIVE · PRECISION GYRO
                </span>
              </div>
            </div>

            {/* Platter & Vinyl Disc & Tonearm */}
            <div className="relative aspect-square max-w-[400px] mx-auto flex items-center justify-center">
              {/* Platter outer rim */}
              <div className="w-full h-full rounded-full bg-[#181822] border-4 border-zinc-800/80 shadow-2xl flex items-center justify-center relative p-3">
                {/* Vinyl Record */}
                <div
                  className={`w-full h-full rounded-full bg-[#0a0a0f] border border-zinc-700/40 relative flex items-center justify-center shadow-inner overflow-hidden ${
                    isPlaying ? 'animate-spin-slow' : 'paused'
                  }`}
                  style={{
                    animationDuration: rpm === 45 ? '12s' : '18s',
                  }}
                >
                  {/* Concentric Vinyl Grooves */}
                  <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
                  <div className="absolute inset-12 rounded-full border border-white/[0.05]" />
                  <div className="absolute inset-16 rounded-full border border-white/[0.03]" />
                  <div className="absolute inset-20 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-24 rounded-full border border-white/[0.06]" />

                  {/* Vinyl light sheen / reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.06] via-transparent to-white/[0.06] pointer-events-none" />

                  {/* Center Label (Album Art & Title) */}
                  <div className="w-32 h-32 rounded-full border-2 border-zinc-900 bg-zinc-800 relative overflow-hidden flex items-center justify-center shadow-md">
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center">
                      <span className="font-display italic text-xs text-white leading-tight">
                        {currentTrack.title.split('·')[0]}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-300 mt-0.5">
                        {rpm} RPM
                      </span>
                    </div>
                    {/* Spindle hole */}
                    <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-500 absolute" />
                  </div>
                </div>

                {/* Tonearm */}
                <div
                  className="absolute -top-3 -right-2 w-32 h-44 pointer-events-none transition-transform duration-1000 ease-out origin-top-right z-30"
                  style={{
                    transform: isPlaying ? 'rotate(18deg)' : 'rotate(0deg)',
                  }}
                >
                  {/* Tonearm base pivot */}
                  <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-600 shadow-xl flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-zinc-950 border border-zinc-700" />
                  </div>
                  {/* Tonearm metal rod */}
                  <div className="absolute top-7 right-6 w-1.5 h-32 bg-gradient-to-b from-zinc-400 via-zinc-500 to-zinc-600 rounded-full shadow-md origin-top transform -rotate-12" />
                  {/* Cartridge & Stylus headshell */}
                  <div className="absolute bottom-6 right-12 w-6 h-9 bg-zinc-900 border border-zinc-700 rounded-sm shadow-lg flex items-center justify-center">
                    <div className="w-1.5 h-3 bg-red-500 rounded-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Turntable Control Bar */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Play / Stop Platter */}
                <button
                  onClick={onTogglePlay}
                  className="px-5 py-2.5 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>停止转盘</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>启动转盘</span>
                    </>
                  )}
                </button>

                {/* RPM switch */}
                <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-full p-1 text-xs font-mono">
                  <button
                    onClick={() => handleRpmChange(33)}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      rpm === 33 ? 'bg-zinc-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    33 RPM
                  </button>
                  <button
                    onClick={() => handleRpmChange(45)}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      rpm === 45 ? 'bg-zinc-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    45 RPM
                  </button>
                </div>
              </div>

              {/* Vinyl crackle toggle */}
              <button
                onClick={handleToggleVinylCrackle}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-all ${
                  vinylCrackle
                    ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-500'
                }`}
                title="开启/关闭模拟黑胶唱针沙沙底噪"
              >
                <Radio className="w-3 h-3" />
                <span>黑胶底噪: {vinylCrackle ? '开启' : '静音'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Frequency Spectrum & Liner Note (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Real-time spectrum visualizer */}
            <div className="bg-[#121218] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Real-time Audio Spectrum
                </span>
                <span className="text-[11px] font-mono text-blue-400">
                  {isPlaying ? 'ACTIVE STREAM' : 'IDLE'}
                </span>
              </div>

              {/* Bar graph */}
              <div className="h-24 flex items-end gap-1.5 justify-between py-2 border-b border-zinc-800/80">
                {frequencies.map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-zinc-800 rounded-t-sm overflow-hidden flex flex-col justify-end"
                  >
                    <div
                      className="w-full accent-gradient rounded-t-sm transition-all duration-75"
                      style={{ height: `${height}px` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-2">
                <span>32Hz</span>
                <span>500Hz</span>
                <span>4kHz</span>
                <span>16kHz</span>
              </div>
            </div>

            {/* Currently Playing Track Story Card */}
            <div className="bg-[#121218] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
                LINER NOTE · 唱片内页附语
              </div>
              <h3 className="text-2xl font-display italic text-white mb-2">
                {currentTrack.title}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-light mb-4">
                {currentTrack.story}
              </p>
              {currentTrack.lyricsSnippet && (
                <div className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-xs text-blue-300 font-mono italic">
                  {currentTrack.lyricsSnippet}
                </div>
              )}
            </div>

            {/* Quick Vinyl Selection Carousel */}
            <div className="bg-[#121218] border border-zinc-800 rounded-3xl p-5 shadow-xl">
              <div className="text-xs font-mono text-zinc-400 mb-3">
                放上其他唱片 / SELECT DISC
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {tracks
                  .filter(
                    (t) =>
                      t.id !== 'track-5' &&
                      t.id !== 'track-6' &&
                      !t.title.toLowerCase().includes('rainy window') &&
                      !t.title.toLowerCase().includes('solar wind')
                  )
                  .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTrack(t)}
                    className={`shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                      t.id === currentTrack.id
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <img
                      src={t.coverImage}
                      alt={t.title}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs truncate max-w-[100px]">{t.title.split('·')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
