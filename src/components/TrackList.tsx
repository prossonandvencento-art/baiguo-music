import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Search, Sparkles, BookOpen, Music2, Upload, Plus, FileAudio, Trash2 } from 'lucide-react';
import { Track, MoodCategory } from '../types/music';

interface TrackListProps {
  tracks: Track[];
  currentTrackId: string;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  favorites: string[];
  onOpenStory: (track: Track) => void;
  onOpenAddTrack?: (initialFile?: File) => void;
  onDeleteTrack?: (trackId: string) => void;
  isCurator?: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  favorites,
  onOpenStory,
  onOpenAddTrack,
  onDeleteTrack,
  isCurator = false,
}) => {
  const [activeMood, setActiveMood] = useState<MoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [trackPendingDelete, setTrackPendingDelete] = useState<Track | null>(null);
  const dropzoneInputRef = useRef<HTMLInputElement | null>(null);

  const filterTabs: Array<{ id: MoodCategory; label: string }> = [
    { id: 'all', label: '全部音轨' },
    { id: 'guofeng_funk', label: '铜门国风Funk 🎸' },
    { id: 'midnight', label: '深夜放空' },
    { id: 'ambient', label: '氛围声景' },
    { id: 'synth', label: '复古电音' },
    { id: 'acoustic', label: '民谣吉他' },
    { id: 'favorites', label: `我的收藏 (${favorites.length})` },
  ];

  const filteredTracks = tracks.filter((t) => {
    // Mood filter
    if (activeMood === 'favorites') {
      if (!favorites.includes(t.id)) return false;
    } else if (activeMood !== 'all' && t.mood !== activeMood) {
      return false;
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchArtist = t.artist.toLowerCase().includes(q);
      const matchGenre = t.genre.toLowerCase().includes(q);
      const matchStory = t.story.toLowerCase().includes(q);
      return matchTitle || matchArtist || matchGenre || matchStory;
    }

    return true;
  });

  return (
    <section id="library" className="relative bg-[#08080b] py-24 md:py-32 border-t border-zinc-800/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-[0.25em] font-mono">
                Sonic Archive
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">
              Archive <span className="font-display italic font-normal text-zinc-100">library</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-lg">
              所有收录的曲目与个人听感，每一首都带有独立故事。
            </p>
          </div>

          {/* Action Bar: Search & Upload */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-60 md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索歌曲、艺术家或情绪..."
                className="w-full bg-[#121218] border border-zinc-800 focus:border-zinc-500 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Upload Button (Curator Only) */}
            {isCurator && onOpenAddTrack && (
              <button
                onClick={() => onOpenAddTrack()}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>上传新音乐</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Audio Dropzone Banner in Archive Library (Curator Only) */}
        {isCurator && onOpenAddTrack && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                onOpenAddTrack(file);
              }
            }}
            onClick={() => dropzoneInputRef.current?.click()}
            className={`mb-8 p-6 rounded-3xl border border-dashed transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 shadow-xl shadow-amber-500/10 scale-[1.01]'
                : 'border-zinc-800 bg-[#0e0e13]/80 hover:border-zinc-700 hover:bg-[#121218]'
            }`}
          >
            <input
              type="file"
              ref={dropzoneInputRef}
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onOpenAddTrack(file);
                if (dropzoneInputRef.current) dropzoneInputRef.current.value = '';
              }}
              className="hidden"
            />
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-medium text-white flex items-center gap-2 justify-center sm:justify-start">
                  <span>上传更多音乐到 Archive library</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    支持 MP3 / WAV / FLAC / AAC
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  点击此处浏览文件或直接将音频拖入，系统将自动解析时长、配置封面并永久保存在您的浏览器
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors">
                <FileAudio className="w-3.5 h-3.5 text-amber-400" />
                <span>选择本地文件</span>
              </span>
            </div>
          </div>
        )}

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMood(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeMood === tab.id
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Track List Table / Rows */}
        {filteredTracks.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl bg-[#0e0e13]">
            <Music2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">未找到匹配的曲目</p>
            <p className="text-zinc-600 text-xs mt-1">尝试换一个关键词，或添加一首你喜欢的音乐</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {filteredTracks.map((track, index) => {
              const isCurrent = currentTrackId === track.id;
              const isCurrentPlaying = isCurrent && isPlaying;
              const isFav = favorites.includes(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className={`group relative flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-zinc-900/90 border-blue-500/40 shadow-lg shadow-blue-500/5'
                      : 'bg-[#101015]/60 hover:bg-[#15151c] border-zinc-800/60 hover:border-zinc-700'
                  }`}
                >
                  {/* Left: Index, Cover, Title, Artist */}
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Index */}
                    <span className="w-6 text-xs font-mono text-zinc-500 group-hover:text-zinc-300 text-center shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Album Art with Play overlay */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                      <img
                        src={track.coverImage}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                          isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-4 h-4 fill-white text-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Title & Unboxed Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm sm:text-base font-medium truncate ${
                            isCurrent ? 'text-blue-300 font-semibold' : 'text-zinc-100 group-hover:text-white'
                          }`}
                        >
                          {track.title}
                        </h4>
                        {track.isCustom && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                            自选上传
                          </span>
                        )}
                      </div>

                      {/* Clean Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-zinc-400 truncate mt-0.5 font-light">
                        <span>{track.artist}</span>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span className="text-zinc-500">{track.genre}</span>
                        <span aria-hidden="true" className="text-zinc-600 hidden sm:inline">·</span>
                        <span className="text-zinc-500 hidden sm:inline">{track.album}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Story Button, Like Button, Duration */}
                  <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                    {/* Read Story / 推荐寄语 Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenStory(track);
                      }}
                      className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800/40 hover:bg-zinc-800 transition-colors"
                      title="阅读歌曲背后的故事"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>故事</span>
                    </button>

                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(track.id);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title={isFav ? '取消收藏' : '加入收藏'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      />
                    </button>

                    {/* Delete Button (Curator Only) */}
                    {isCurator && onDeleteTrack && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTrackPendingDelete(track);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                        title="从曲库中删除此歌曲"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Duration */}
                    <span className="text-xs font-mono text-zinc-500 tabular-nums w-12 text-right">
                      {track.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Track Confirmation Modal */}
        {trackPendingDelete && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setTrackPendingDelete(null)}
          >
            <div
              className="w-full max-w-sm bg-[#13131a] border border-red-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-white text-center">确认删除歌曲？</h3>
              <p className="text-xs text-zinc-400 text-center mt-2 leading-relaxed">
                即将从您的曲库与主页中移除《<span className="text-zinc-200 font-semibold">{trackPendingDelete.title}</span>》。
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setTrackPendingDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteTrack && trackPendingDelete) {
                      onDeleteTrack(trackPendingDelete.id);
                      setTrackPendingDelete(null);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
