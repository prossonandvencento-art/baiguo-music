import React from 'react';
import { Headphones, Disc, Radio, Sliders, Mail, Heart, Github, Twitter, Send } from 'lucide-react';
import { CURATOR_INFO, avatarCurator } from '../data/initialData';

interface CuratorProfileProps {
  totalTracksCount: number;
  totalFavoritesCount: number;
  isCurator?: boolean;
  onOpenCuratorModal?: () => void;
}

export const CuratorProfile: React.FC<CuratorProfileProps> = ({
  totalTracksCount,
  totalFavoritesCount,
  isCurator = false,
  onOpenCuratorModal,
}) => {
  return (
    <section id="curator" className="relative bg-[#08080b] py-24 md:py-32 border-t border-zinc-800/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-20">
          {/* Avatar Column (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl p-1 bg-zinc-900 group">
              <img
                src={avatarCurator}
                alt={CURATOR_INFO.name}
                className="w-full h-full object-cover rounded-2xl filter saturate-90 contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="mt-6">
              <h3 className="text-xl sm:text-2xl font-display italic text-white">
                {CURATOR_INFO.name}
              </h3>
              <p className="text-xs font-mono text-blue-400 mt-1">{CURATOR_INFO.role}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 mt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>正在聆听: 24bit/96kHz Hi-Res</span>
              </div>

              {onOpenCuratorModal && (
                <div className="mt-4">
                  <button
                    onClick={onOpenCuratorModal}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      isCurator
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-amber-300 border border-zinc-700 hover:border-amber-500/40'
                    }`}
                  >
                    <span>{isCurator ? '👑 主理人管理模式' : '🔑 主理人登入 (传歌与管理)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bio & Listening Gear (Span 8) */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-[0.25em] font-mono">
                The Curator
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-6">
              声音不言，<span className="font-display italic text-zinc-100">自有归处</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light mb-8 max-w-2xl">
              {CURATOR_INFO.bio}
            </p>

            {/* Audio Hardware Gear */}
            <div className="bg-[#121218] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
                <Headphones className="w-4 h-4 text-blue-400" />
                <span>My Listening Setup · 私人听音回放系统</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CURATOR_INFO.setupGear.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl flex flex-col"
                  >
                    <span className="text-xs text-zinc-500 font-mono">{item.label}</span>
                    <span className="text-sm text-zinc-200 font-medium mt-1">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Stats Bar (Matching reference 3-column stats with tabular figures) */}
        <div className="pt-16 border-t border-zinc-800/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
              <div className="text-6xl md:text-7xl font-display text-white tracking-tight tabular-nums mb-2">
                {totalTracksCount}
                <span className="text-blue-400 font-sans text-4xl ml-1">+</span>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
                Curated Tracks
              </span>
              <p className="text-xs text-zinc-500 mt-2 max-w-[220px]">
                精选归档曲目，涵盖氛围、电音与独立民谣。
              </p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
              <div className="text-6xl md:text-7xl font-display text-white tracking-tight tabular-nums mb-2">
                {totalFavoritesCount}
                <span className="text-blue-400 font-sans text-4xl ml-1">♥</span>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
                Loved Tracks
              </span>
              <p className="text-xs text-zinc-500 mt-2 max-w-[220px]">
                已标记红心收藏的声音切片。
              </p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center px-4 pt-6 md:pt-0">
              <div className="text-6xl md:text-7xl font-display text-white tracking-tight tabular-nums mb-2">
                2,400
                <span className="text-blue-400 font-sans text-4xl ml-1">h</span>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
                Listening Time
              </span>
              <p className="text-xs text-zinc-500 mt-2 max-w-[220px]">
                黑胶唱针与耳机陪伴下的深夜专注时光。
              </p>
            </div>
          </div>
        </div>

        {/* Footer Contact CTA (Matching reference: "Let's create together / Say Hi") */}
        <div className="mt-24 pt-16 border-t border-zinc-800/60 text-center flex flex-col items-center">
          <span className="text-xs text-zinc-400 uppercase tracking-[0.25em] font-mono mb-4">
            Have a track recommendation?
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display italic text-white tracking-tight mb-8">
            Share your sound with me.
          </h2>
          <a
            href="https://t.me/baiguolililove"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-full p-[2px] transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <span className="absolute inset-0 rounded-full accent-gradient opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0d0d12] group-hover:bg-[#14141c] rounded-full px-8 py-3.5 flex items-center gap-3 backdrop-blur-xl transition-all duration-300">
              <Send className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="text-sm sm:text-base font-medium text-zinc-100 group-hover:text-amber-300">
                https://t.me/baiguolililove
              </span>
              <span className="text-amber-400 group-hover:translate-x-1 transition-transform">↗</span>
            </div>
          </a>

          {/* Copyright & Availability */}
          <div className="mt-16 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono border-t border-zinc-900 pt-6">
            <div>© 2026 白果音乐 (Baiguo Music). Crafted for music lovers.</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Offline Ready · Web Audio Synthesizer Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
