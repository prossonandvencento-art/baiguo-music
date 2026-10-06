import React, { useRef } from 'react';
import { Play, Pause, Heart, Sparkles, Disc, Upload, ImagePlus, Edit3 } from 'lucide-react';
import { Track } from '../types/music';

interface FeaturedBentoProps {
  tracks: Track[];
  currentTrackId: string;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  favorites: string[];
  onScrollToLibrary: () => void;
  onUploadTrackAudio?: (trackId: string, file: File) => void;
  onUploadTrackCover?: (trackId: string, file: File) => void;
  onEditTrack?: (track: Track) => void;
  isCurator?: boolean;
}

export const FeaturedBento: React.FC<FeaturedBentoProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  favorites,
  onScrollToLibrary,
  onUploadTrackAudio,
  onUploadTrackCover,
  onEditTrack,
  isCurator = false,
}) => {
  // Take top 4 tracks for the featured bento grid
  const featuredTracks = tracks.slice(0, 4);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const activeUploadTrackIdRef = useRef<string | null>(null);
  const activeCoverTrackIdRef = useRef<string | null>(null);

  const handleUploadClick = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    activeUploadTrackIdRef.current = trackId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const trackId = activeUploadTrackIdRef.current;
    if (file && trackId && onUploadTrackAudio) {
      onUploadTrackAudio(trackId, file);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCoverClick = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    activeCoverTrackIdRef.current = trackId;
    coverInputRef.current?.click();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const trackId = activeCoverTrackIdRef.current;
    if (file && trackId && onUploadTrackCover) {
      onUploadTrackCover(trackId, file);
    }
    // reset input
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const getColSpan = (index: number) => {
    switch (index) {
      case 0:
        return 'md:col-span-7';
      case 1:
        return 'md:col-span-5';
      case 2:
        return 'md:col-span-5';
      case 3:
        return 'md:col-span-7';
      default:
        return 'md:col-span-6';
    }
  };

  return (
    <section id="featured" className="relative bg-[#08080b] py-24 md:py-32 border-t border-zinc-800/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-[0.25em] font-mono">
                Curated Selection
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">
              Featured <span className="font-display italic font-normal text-zinc-100">tracks</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-lg">
              四首最新的超燃funk，点燃你的情绪，陪伴每一个深夜。
            </p>
          </div>

          <button
            onClick={onScrollToLibrary}
            className="group hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-zinc-200 py-2.5 px-5 rounded-full border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 hover:bg-zinc-800/80 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span>全部曲目 ({tracks.length})</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Hidden inputs for track audio and cover upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          onChange={handleCoverChange}
          className="hidden"
        />

        {/* Bento Grid (Alternating spans: 7 / 5 / 5 / 7) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {featuredTracks.map((track, idx) => {
            const isCurrent = currentTrackId === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isFav = favorites.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className={`${getColSpan(
                  idx
                )} group relative bg-[#0e0e13] border border-zinc-800/80 rounded-3xl overflow-hidden min-h-[360px] md:min-h-[420px] flex flex-col justify-end p-7 md:p-8 cursor-pointer transition-all duration-500 hover:border-zinc-600 shadow-2xl card-glow`}
              >
                {/* Background Imagery */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={track.coverImage}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter saturate-85 contrast-110 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Halftone texture overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                      backgroundSize: '4px 4px',
                    }}
                  />
                  {/* Subtle dark gradient scrim for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-[#08080b]/50 to-transparent" />
                </div>

                {/* Top Corner Quick Badges */}
                <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span>{track.genre}</span>
                    <span aria-hidden="true">·</span>
                    <span>{track.duration}</span>
                  </div>

                  <div className="pointer-events-auto flex items-center gap-2">
                    {isCurator && onEditTrack && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTrack(track);
                        }}
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer text-zinc-300 hover:text-amber-400 group/btn"
                        title="修改此曲目的标题、艺术家和小字简介等文字"
                      >
                        <Edit3 className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                      </button>
                    )}

                    {isCurator && onUploadTrackCover && (
                      <button
                        onClick={(e) => handleCoverClick(track.id, e)}
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer text-zinc-300 hover:text-amber-400 group/btn"
                        title="上传/修改封面（自动1:1智能居中裁剪）"
                      >
                        <ImagePlus className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                      </button>
                    )}

                    {isCurator && onUploadTrackAudio && (
                      <button
                        onClick={(e) => handleUploadClick(track.id, e)}
                        className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer text-zinc-300 hover:text-amber-400"
                        title="上传/替换此歌曲的原版本地音频文件"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Favorite button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(track.id);
                      }}
                      className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer text-zinc-300 hover:text-red-400"
                      title={isFav ? '已喜欢' : '喜欢这首歌'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Hover Overlay with backdrop blur & interactive pill */}
                <div className="absolute inset-0 bg-black/55 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6 z-10">
                  <div className="p-[1.5px] rounded-full accent-gradient shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white text-zinc-950 px-6 py-2.5 rounded-full flex items-center gap-2 font-medium text-sm">
                      {isCurrentPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>暂停试听</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          <span>立即试听</span>
                        </>
                      )}
                      <span>—</span>
                      <span className="font-display italic text-base truncate max-w-[160px]">
                        {track.title.split('·')[0]}
                      </span>
                      <span className="text-xs">↗</span>
                    </div>
                  </div>

                  {isCurator && (
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {onUploadTrackCover && (
                        <button
                          onClick={(e) => handleCoverClick(track.id, e)}
                          className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-zinc-800 text-xs text-amber-200 hover:text-amber-100 flex items-center gap-1.5 border border-amber-400/30 backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg"
                          title="上传/修改封面（自动1:1智能居中裁剪）"
                        >
                          <ImagePlus className="w-3.5 h-3.5 text-amber-400" />
                          <span>换封面</span>
                        </button>
                      )}

                      {onEditTrack && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTrack(track);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-zinc-800 text-xs text-zinc-200 hover:text-white flex items-center gap-1.5 border border-white/20 backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-lg"
                          title="直接修改标题、小字与故事"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>修改文字</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Content Default (Bottom) */}
                <div className="relative z-10 flex justify-between items-end gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 font-mono">
                        {track.artist}
                      </span>
                      {isCurator && onEditTrack && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTrack(track);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-amber-300 p-0.5 cursor-pointer"
                          title="点击修改文字"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <h3
                      onClick={(e) => {
                        if (isCurator && onEditTrack) {
                          e.stopPropagation();
                          onEditTrack(track);
                        }
                      }}
                      className={`text-2xl md:text-3xl font-display italic text-white mt-1 truncate transition-colors ${
                        isCurator ? 'hover:text-amber-200 cursor-pointer' : ''
                      }`}
                      title={isCurator ? '点击可直接编辑修改标题与文字' : undefined}
                    >
                      {track.title}
                    </h3>
                    <p
                      onClick={(e) => {
                        if (isCurator && onEditTrack) {
                          e.stopPropagation();
                          onEditTrack(track);
                        }
                      }}
                      className={`text-xs text-zinc-400 line-clamp-1 mt-1 max-w-md transition-colors ${
                        isCurator ? 'hover:text-zinc-200 cursor-pointer' : ''
                      }`}
                      title={isCurator ? '点击可直接编辑修改小字描述' : undefined}
                    >
                      {track.story}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs text-zinc-500 font-mono">{track.year}</div>
                    {isCurrentPlaying && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 font-mono mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                        PLAYING
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
