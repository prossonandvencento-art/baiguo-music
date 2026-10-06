import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Clock, X, Play } from 'lucide-react';
import { JournalArticle, Track } from '../types/music';

interface JournalSectionProps {
  articles: JournalArticle[];
  tracks: Track[];
  onPlayTrackById: (trackId: string) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  articles,
  tracks,
  onPlayTrackById,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  const getRecommendedTrack = (trackId?: string) => {
    if (!trackId) return null;
    return tracks.find((t) => t.id === trackId) || null;
  };

  return (
    <section id="journal" className="relative bg-[#08080b] py-24 md:py-32 border-t border-zinc-800/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-[0.25em] font-mono">
                Liner Notes & Journal
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">
              Recent <span className="font-display italic font-normal text-zinc-100">musings</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-lg">
              关于黑胶仪式、模拟质感、环境音乐与深夜听音心理学的随笔。
            </p>
          </div>
        </div>

        {/* Journal Horizontal Cards (Matching reference layout) */}
        <div className="flex flex-col space-y-4">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-3xl sm:rounded-full bg-[#101015]/60 hover:bg-[#14141c] border border-zinc-800/70 hover:border-zinc-700 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                {/* Thumbnail */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 mb-0.5">
                    {article.category}
                  </div>
                  <h4 className="text-base sm:text-lg md:text-xl font-medium text-zinc-200 group-hover:text-blue-300 transition-colors truncate">
                    {article.title}
                  </h4>
                </div>
              </div>

              {/* Right Side Info & Action */}
              <div className="flex items-center gap-5 sm:gap-6 self-end sm:self-center pr-2 shrink-0">
                <span className="text-xs text-zinc-500 font-mono">{article.readTime}</span>
                <span className="text-xs text-zinc-600 font-mono hidden sm:inline">{article.date}</span>
                <div className="w-8 h-8 rounded-full bg-zinc-800/80 group-hover:bg-zinc-100 group-hover:text-zinc-950 flex items-center justify-center transition-all duration-300 text-xs text-zinc-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#121218] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-3">
              <span>{selectedArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-500">{selectedArticle.date}</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-500">{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display italic text-white mb-6 leading-snug">
              {selectedArticle.title}
            </h3>

            {/* Summary callout */}
            <div className="p-4 bg-zinc-900 border-l-2 border-blue-400 rounded-r-2xl text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-8">
              {selectedArticle.summary}
            </div>

            {/* Article Content paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-light mb-8">
              {selectedArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Recommended Companion Track */}
            {selectedArticle.recommendedTrackId && (
              <div className="pt-6 border-t border-zinc-800">
                <div className="text-xs font-mono text-zinc-400 mb-3">
                  推荐伴读音乐 / COMPANION SOUNDTRACK:
                </div>
                {(() => {
                  const recTrack = getRecommendedTrack(selectedArticle.recommendedTrackId);
                  if (!recTrack) return null;
                  return (
                    <div className="flex items-center justify-between p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={recTrack.coverImage}
                          alt={recTrack.title}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-white">{recTrack.title}</div>
                          <div className="text-xs text-zinc-400">{recTrack.artist}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onPlayTrackById(recTrack.id);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>播放此曲</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
