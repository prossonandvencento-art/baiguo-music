import React, { useState } from 'react';
import { X, Play, Pause, Heart, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { Track } from '../types/music';

interface SongStoryDrawerProps {
  track: Track | null;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isFav: boolean;
  onToggleLike: (trackId: string) => void;
}

export const SongStoryDrawer: React.FC<SongStoryDrawerProps> = ({
  track,
  onClose,
  isPlaying,
  onTogglePlay,
  isFav,
  onToggleLike,
}) => {
  const [copied, setCopied] = useState(false);

  if (!track) return null;

  const handleCopyShareLink = () => {
    const textToCopy = `🎵 正在 Echoes 音乐空间聆听:《${track.title}》- ${track.artist}\n“${track.story}”\n✨ 欢迎戴上耳机，共享这份深夜声音。`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-[#121218] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

        {/* Card Header Content */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
            <img
              src={track.coverImage}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
              <span>{track.genre}</span>
              <span aria-hidden="true">·</span>
              <span>{track.year}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display italic text-white truncate">
              {track.title}
            </h3>
            <p className="text-xs text-zinc-400 truncate mt-0.5">{track.artist}</p>
          </div>
        </div>

        {/* Story Body */}
        <div className="mb-6 relative z-10">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
            WHY I SHARED THIS · 推荐寄语
          </div>
          <div className="p-4 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl text-sm text-zinc-200 leading-relaxed font-light">
            {track.story}
          </div>
        </div>

        {/* Lyrics or Quote snippet */}
        {track.lyricsSnippet && (
          <div className="mb-6 p-3.5 bg-blue-950/20 border border-blue-500/20 rounded-2xl text-xs text-blue-300 font-mono italic relative z-10">
            {track.lyricsSnippet}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800 relative z-10">
          <div className="flex items-center gap-2">
            {/* Play companion button */}
            <button
              onClick={onTogglePlay}
              className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>暂停</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>播放此曲</span>
                </>
              )}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleLike(track.id)}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
              title="收藏"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? 'fill-red-500 text-red-500' : 'text-zinc-400'
                }`}
              />
            </button>
          </div>

          {/* Copy Share Note button */}
          <button
            onClick={handleCopyShareLink}
            className="px-4 py-2 rounded-full border border-zinc-700 hover:border-zinc-500 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">已复制分享卡片!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>复制分享文案</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
