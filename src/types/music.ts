export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // e.g. "04:18"
  durationSeconds: number;
  coverImage: string;
  genre: string;
  mood: string;
  year: string;
  story: string; // 推荐理由 / 故事
  lyricsSnippet?: string;
  audioUrl?: string; // Optional user audio file URL or audio synthesis preset
  synthPreset: 'guofeng_funk' | 'cosmic' | 'lofi' | 'synthwave' | 'acoustic' | 'rain';
  likes: number;
  isCustom?: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  content: string[];
  recommendedTrackId?: string;
  coverImage?: string;
}

export type MoodCategory = 'all' | 'guofeng_funk' | 'midnight' | 'ambient' | 'synth' | 'acoustic' | 'favorites';
