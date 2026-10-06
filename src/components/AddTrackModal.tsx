import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Music, Sparkles, Image, Check, FileAudio } from 'lucide-react';
import { Track } from '../types/music';
import { cropAndCompressCoverImage } from '../utils/audioStorage';

// Presets for covers
import albumTongmenGate from '../assets/images/album_tongmen_gate_1791210864871.jpg';
import albumPifuWuzui from '../assets/images/album_pifu_wuzui_1791211070949.jpg';
import albumCosmic from '../assets/images/album_cosmic_horizon_1791208343924.jpg';
import albumLofi from '../assets/images/album_lofi_midnight_1791208355585.jpg';
import albumSynthwave from '../assets/images/album_synthwave_retro_1791208366083.jpg';
import albumAcoustic from '../assets/images/album_acoustic_guitar_1791208375317.jpg';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (newTrack: Track, audioFile?: File) => void;
  initialAudioFile?: File | null;
}

export const AddTrackModal: React.FC<AddTrackModalProps> = ({
  isOpen,
  onClose,
  onAddTrack,
  initialAudioFile,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [mood, setMood] = useState<'guofeng_funk' | 'midnight' | 'ambient' | 'synth' | 'acoustic'>('guofeng_funk');
  const [synthPreset, setSynthPreset] = useState<'guofeng_funk' | 'cosmic' | 'lofi' | 'synthwave' | 'acoustic' | 'rain'>('guofeng_funk');
  const [story, setStory] = useState('');
  const [coverImage, setCoverImage] = useState<string>(albumTongmenGate);
  const [audioFileUrl, setAudioFileUrl] = useState<string | undefined>(undefined);
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [rawAudioFile, setRawAudioFile] = useState<File | null>(null);
  const [durationStr, setDurationStr] = useState('03:45');
  const [durationSec, setDurationSec] = useState(225);

  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const processAudioFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioFileUrl(url);
    setAudioFileName(file.name);
    setRawAudioFile(file);

    // Auto extract title & artist if format is "Artist - Title" or "Title"
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (cleanName.includes('-')) {
      const parts = cleanName.split('-');
      setArtist(parts[0].trim());
      setTitle(parts.slice(1).join('-').trim());
    } else {
      setTitle(cleanName);
    }

    // Auto measure duration
    const audioElem = new window.Audio();
    audioElem.src = url;
    audioElem.onloadedmetadata = () => {
      const sec = Math.round(audioElem.duration);
      if (sec && !isNaN(sec)) {
        setDurationSec(sec);
        const mins = Math.floor(sec / 60);
        const remSec = sec % 60;
        setDurationStr(`${mins.toString().padStart(2, '0')}:${remSec.toString().padStart(2, '0')}`);
      }
    };
  };

  useEffect(() => {
    if (isOpen && initialAudioFile) {
      processAudioFile(initialAudioFile);
    }
  }, [isOpen, initialAudioFile]);

  if (!isOpen) return null;

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const cropped = await cropAndCompressCoverImage(file);
        setCoverImage(cropped);
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setCoverImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const genreMap = {
      guofeng_funk: '国风 Funk & 东方律动',
      midnight: 'Lo-Fi & Neo-Soul',
      ambient: 'Ambient & Drone',
      synth: 'Synthwave & Electronic',
      acoustic: 'Acoustic & Folk',
    };

    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim() || '独立分享者',
      album: album.trim() || 'Single Collection',
      duration: durationStr,
      durationSeconds: durationSec,
      coverImage: coverImage,
      genre: genreMap[mood],
      mood: mood,
      year: new Date().getFullYear().toString(),
      story: story.trim() || '收录于白果音乐个人珍藏曲库，旋律响起的那一刻，洗尽尘嚣与浮躁。',
      lyricsSnippet: '“在音符里找到彼此，音乐是最温柔的避风港。”',
      audioUrl: audioFileUrl,
      synthPreset: synthPreset,
      likes: 1,
      isCustom: true,
    };

    onAddTrack(newTrack, rawAudioFile || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#121218] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SHARE YOUR SOUND</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display italic text-white">
            添加你的音乐分享
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            无需懂任何技术！填入歌名，上传音频或使用内置合成器，立刻加入你的专属音乐主页。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Song Name & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                歌曲名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: 晴天 / Midnight Rain"
                className="w-full bg-[#181822] border border-zinc-700/80 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                艺术家 / 演唱者
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="例如: 周杰伦 / 独立音乐人"
                className="w-full bg-[#181822] border border-zinc-700/80 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Audio Upload or Sound Preset */}
          <div className="p-4 bg-[#181822] border border-zinc-800 rounded-2xl">
            <label className="block text-xs font-mono text-zinc-300 mb-2 flex items-center justify-between">
              <span>音频来源 (本地文件或合成器)</span>
              <span className="text-[11px] text-zinc-500 font-sans">支持 MP3, WAV, FLAC</span>
            </label>

            {/* Hidden file input */}
            <input
              type="file"
              ref={audioInputRef}
              accept="audio/*"
              onChange={handleAudioFileUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 border border-zinc-700 transition-colors cursor-pointer shrink-0"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>{audioFileName ? '更换本地音频' : '上传我的音频文件'}</span>
              </button>

              <div className="text-xs text-zinc-400 truncate w-full">
                {audioFileName ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> 已加载: {audioFileName}
                  </span>
                ) : (
                  <span className="text-zinc-500">
                    未选择文件？系统将自动使用所选声学合成器生成背景音乐
                  </span>
                )}
              </div>
            </div>

            {/* Synth preset fallback choice */}
            {!audioFileName && (
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-zinc-500">生成式音效预设:</span>
                {(['guofeng_funk', 'lofi', 'cosmic', 'synthwave', 'acoustic', 'rain'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSynthPreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      synthPreset === p
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {p === 'guofeng_funk' ? '铜门国风Funk' : p === 'lofi' ? '暖心Lo-Fi' : p === 'cosmic' ? '深空氛围' : p === 'synthwave' ? '复古电音' : p === 'acoustic' ? '木吉他' : '雨声白噪'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mood category & Cover Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                所属情绪分类
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
                className="w-full bg-[#181822] border border-zinc-700/80 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none"
              >
                <option value="guofeng_funk">铜门国风Funk (Guofeng Funk)</option>
                <option value="midnight">深夜放空 (Midnight Chill)</option>
                <option value="ambient">氛围声景 (Ambient & Drone)</option>
                <option value="synth">复古电音 (Synthwave)</option>
                <option value="acoustic">民谣木吉他 (Acoustic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                唱片封面配图
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  onChange={handleCoverFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded-xl border border-zinc-700 shrink-0"
                >
                  上传封面
                </button>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {[albumTongmenGate, albumPifuWuzui, albumCosmic, albumLofi, albumSynthwave, albumAcoustic].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Preset"
                      onClick={() => setCoverImage(img)}
                      className={`w-9 h-9 rounded-lg object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        coverImage === img ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Story / 为什么推荐这首歌 */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              分享心语 / 推荐故事 (随笔笔记)
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="写下这首歌触动你的那一刻，或者适合在什么场景下聆听..."
              className="w-full bg-[#181822] border border-zinc-700/80 focus:border-blue-400 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full accent-gradient hover:opacity-95 text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <span>发布到我的音乐主页</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
