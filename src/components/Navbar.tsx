import React from 'react';
import { Volume2, Plus, Sparkles, Lock, Crown } from 'lucide-react';
import logoBaiguo from '../assets/images/baiguo_music_logo_1791208914562.jpg';

interface NavbarProps {
  onOpenAddModal: () => void;
  isPlaying: boolean;
  currentTrackTitle?: string;
  onScrollTo: (id: string) => void;
  isCurator?: boolean;
  onOpenCuratorModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  isPlaying,
  currentTrackTitle,
  onScrollTo,
  isCurator = false,
  onOpenCuratorModal,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-5 px-4 pointer-events-none">
      <nav className="pointer-events-auto inline-flex items-center rounded-full backdrop-blur-2xl border border-white/10 bg-[#0d0d12]/85 px-3 py-1.5 sm:py-2 shadow-2xl shadow-black/60 transition-all duration-300 hover:border-white/20 max-w-full">
        {/* Zone 1: Brand Wordmark (Single text element with logo image) */}
        <button
          onClick={() => onScrollTo('hero')}
          className="group flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-amber-300/40 p-[1px] bg-gradient-to-tr from-amber-400/30 to-amber-200/40 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
            <img
              src={logoBaiguo}
              alt="白果音乐"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="font-display italic text-lg sm:text-xl text-zinc-100 tracking-wide font-normal group-hover:text-amber-200 transition-colors">
            白果音乐
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-zinc-800 mx-1 sm:mx-2 hidden sm:block" />

        {/* Zone 2: Navigation Links (Text with hover states) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onScrollTo('featured')}
            className="px-2.5 sm:px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-full transition-colors"
          >
            精选
          </button>
          <button
            onClick={() => onScrollTo('library')}
            className="px-2.5 sm:px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-full transition-colors"
          >
            曲库
          </button>
          <button
            onClick={() => onScrollTo('vinyl-lab')}
            className="px-2.5 sm:px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-full transition-colors"
          >
            唱片机
          </button>
          <button
            onClick={() => onScrollTo('journal')}
            className="hidden md:inline-block px-2.5 sm:px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-full transition-colors"
          >
            手记
          </button>
          <button
            onClick={() => onScrollTo('curator')}
            className="hidden md:inline-block px-2.5 sm:px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-full transition-colors"
          >
            主理人
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-zinc-800 mx-1 sm:mx-2" />

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Pulse Indicator */}
          {isPlaying && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[11px] text-blue-300 font-mono">
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 bg-blue-400 h-2 animate-pulse" />
                <span className="w-0.5 bg-blue-400 h-3 animate-pulse delay-75" />
                <span className="w-0.5 bg-blue-400 h-1.5 animate-pulse delay-150" />
              </span>
              <span className="truncate max-w-[100px]">{currentTrackTitle || '播放中'}</span>
            </div>
          )}

          {/* Curator Mode Switcher or Login Button */}
          {isCurator ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenCuratorModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono transition-colors cursor-pointer"
                title="点击管理主理人权限"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">主理人</span>
              </button>
              <button
                onClick={onOpenAddModal}
                className="group relative inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-105 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-950 transition-transform group-hover:rotate-90 duration-300" />
                <span className="whitespace-nowrap">传歌</span>
              </button>
            </div>
          ) : (
            onOpenCuratorModal && (
              <button
                onClick={onOpenCuratorModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-700/80 hover:border-amber-500/40 text-xs font-mono transition-all cursor-pointer"
                title="站长/主理人登入 (普通访客可畅听全站)"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>主理人登入</span>
              </button>
            )
          )}
        </div>
      </nav>
    </header>
  );
};
