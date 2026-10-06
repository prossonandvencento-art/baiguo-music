import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, Edit3, Music2, User, BookOpen, Tag, Trash2 } from 'lucide-react';
import { Track } from '../types/music';

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  onSaveTrack: (updatedTrack: Track) => void;
  onResetTrack?: (trackId: string) => void;
  onDeleteTrack?: (trackId: string) => void;
}

export const EditTrackModal: React.FC<EditTrackModalProps> = ({
  isOpen,
  onClose,
  track,
  onSaveTrack,
  onResetTrack,
  onDeleteTrack,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [story, setStory] = useState('');
  const [lyricsSnippet, setLyricsSnippet] = useState('');

  useEffect(() => {
    if (track) {
      setTitle(track.title);
      setArtist(track.artist);
      setAlbum(track.album);
      setGenre(track.genre);
      setStory(track.story || '');
      setLyricsSnippet(track.lyricsSnippet || '');
    }
  }, [track]);

  if (!isOpen || !track) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: Track = {
      ...track,
      title: title.trim(),
      artist: artist.trim() || '未知艺术家',
      album: album.trim() || '放克录',
      genre: genre.trim() || '国风 Funk',
      story: story.trim(),
      lyricsSnippet: lyricsSnippet.trim(),
    };

    onSaveTrack(updated);
    onClose();
  };

  const handleReset = () => {
    if (onResetTrack && track) {
      onResetTrack(track.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#111116] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient light */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">修改曲目文字信息</h3>
              <p className="text-xs text-zinc-400 font-mono">
                正在编辑：{track.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Card Preview */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center gap-4">
          <img
            src={track.coverImage}
            alt={title}
            className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono text-amber-400 truncate">
              {genre || '流派'} · {track.duration}
            </div>
            <h4 className="text-sm font-semibold text-white truncate mt-0.5">
              {title || '曲目标题'}
            </h4>
            <p className="text-xs text-zinc-400 truncate">{artist || '艺术家'}</p>
            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1 italic">
              {story || '小字故事与推荐理由'}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5 text-amber-400" />
              <span>曲目标题 (大字)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：青花夜行 · 弄堂放克"
              required
              className="w-full px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all font-medium"
            />
          </div>

          {/* Artist & Genre grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>艺术家 / 署名</span>
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="例如：白果放克乐团"
                className="w-full px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>流派 / 标签小字</span>
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="例如：Guofeng Neo-Soul & Funk"
                className="w-full px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all"
              />
            </div>
          </div>

          {/* Album */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">
              所属专辑
            </label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="例如：东方微醺放克录"
              className="w-full px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all"
            />
          </div>

          {/* Story / Subtitle (小字描述) */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>卡片底部小字 / 故事与推荐理由</span>
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={3}
              placeholder="卡片底部展现的小字简介与创作意境..."
              className="w-full px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Lyrics snippet */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">
              金句歌词片段 (展开抽屉时展现)
            </label>
            <input
              type="text"
              value={lyricsSnippet}
              onChange={(e) => setLyricsSnippet(e.target.value)}
              placeholder="例如：“把青花瓷的细腻意境融入 70 年代摩城放克...”"
              className="w-full px-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/80 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/10 mt-6 gap-3">
            <div className="flex items-center gap-2">
              {onDeleteTrack && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`确定要从曲库中永久删除《${track.title}》吗？`)) {
                      onDeleteTrack(track.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/60 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="从曲库中永久删除此曲目"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除歌曲</span>
                </button>
              )}

              {onResetTrack && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="恢复至系统默认文字"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>恢复默认</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>保存并永久应用</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
