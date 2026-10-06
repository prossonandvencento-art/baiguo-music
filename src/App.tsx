/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Track } from './types/music';
import { INITIAL_TRACKS, INITIAL_JOURNAL } from './data/initialData';
import { audioEngine } from './utils/audioEngine';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedBento } from './components/FeaturedBento';
import { VinylLounge } from './components/VinylLounge';
import { TrackList } from './components/TrackList';
import { JournalSection } from './components/JournalSection';
import { CuratorProfile } from './components/CuratorProfile';
import { MusicPlayerDock } from './components/MusicPlayerDock';
import { AddTrackModal } from './components/AddTrackModal';
import { SongStoryDrawer } from './components/SongStoryDrawer';
import { EditTrackModal } from './components/EditTrackModal';
import { CuratorAuthModal } from './components/CuratorAuthModal';
import { CosmicCanvas } from './components/CosmicCanvas';
import { Sparkles, X, Check } from 'lucide-react';
import {
  saveAudioFile,
  loadAudioFile,
  cropAndCompressCoverImage,
  saveCoverImage,
  loadCoverImage,
} from './utils/audioStorage';

export default function App() {
  // Load custom tracks from localStorage if any
  const [tracks, setTracks] = useState<Track[]>(() => {
    let deletedIds: string[] = [];
    try {
      const savedDeleted = localStorage.getItem('echoes_deleted_tracks');
      if (savedDeleted) deletedIds = JSON.parse(savedDeleted);
    } catch {}

    try {
      const saved = localStorage.getItem('echoes_custom_tracks');
      if (saved) {
        const parsed: Track[] = JSON.parse(saved);
        const filtered = parsed.filter(
          (t) =>
            !deletedIds.includes(t.id) &&
            t.id !== 'track-5' &&
            t.id !== 'track-6' &&
            !t.title.toLowerCase().includes('rainy window') &&
            !t.title.toLowerCase().includes('solar wind')
        );
        const initialFiltered = INITIAL_TRACKS.filter((t) => !deletedIds.includes(t.id));
        // Combine custom tracks with initial defaults
        return [...filtered, ...initialFiltered];
      }
    } catch (e) {
      console.warn('Failed to parse saved tracks from localStorage', e);
    }
    return INITIAL_TRACKS.filter((t) => !deletedIds.includes(t.id));
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('echoes_favorites');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return ['track-1', 'track-2'];
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStoryTrack, setSelectedStoryTrack] = useState<Track | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [initialAddAudioFile, setInitialAddAudioFile] = useState<File | null>(null);
  const [isCurator, setIsCurator] = useState<boolean>(() => {
    try {
      return localStorage.getItem('echoes_curator_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isCuratorModalOpen, setIsCuratorModalOpen] = useState(false);
  const [hasCustomAudio, setHasCustomAudio] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    '欢迎来到铜门专属 Funk 音乐空间！已备好国风放克精选曲目，点击试听沉浸摇摆。'
  );

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Sync server tracks on startup (so any visitor gets all songs uploaded by curator)
  useEffect(() => {
    fetch('/api/tracks')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tracks) && data.tracks.length > 0) {
          let deletedIds: string[] = [];
          try {
            const savedDeleted = localStorage.getItem('echoes_deleted_tracks');
            if (savedDeleted) deletedIds = JSON.parse(savedDeleted);
          } catch {}
          const valid = data.tracks.filter(
            (t: Track) =>
              !deletedIds.includes(t.id) &&
              t.id !== 'track-5' &&
              t.id !== 'track-6' &&
              !t.title.toLowerCase().includes('rainy window') &&
              !t.title.toLowerCase().includes('solar wind')
          );
          if (valid.length > 0) {
            setTracks(valid);
          }
        } else {
          // Sync default tracks to server so visitors can fetch them
          fetch('/api/tracks/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tracks: INITIAL_TRACKS }),
          }).catch(() => {});
        }
      })
      .catch((err) => {
        console.warn('Server sync fallback to local', err);
      });
  }, []);

  // Load custom audio from IndexedDB on startup & sync initial tracks
  useEffect(() => {
    let deletedIds: string[] = [];
    try {
      const savedDeleted = localStorage.getItem('echoes_deleted_tracks');
      if (savedDeleted) deletedIds = JSON.parse(savedDeleted);
    } catch {}

    // Check if there are user customized text overrides in localStorage
    let savedOverrides: Record<string, Partial<Track>> = {};
    try {
      const savedStr = localStorage.getItem('echoes_track_text_overrides');
      if (savedStr) {
        savedOverrides = JSON.parse(savedStr);
      }
    } catch (e) {
      console.warn('Failed to parse text overrides', e);
    }

    setTracks((prev) =>
      prev
        .filter(
          (t) =>
            !deletedIds.includes(t.id) &&
            t.id !== 'track-5' &&
            t.id !== 'track-6' &&
            !t.title.toLowerCase().includes('rainy window') &&
            !t.title.toLowerCase().includes('solar wind')
        )
        .map((t) => {
        const initial = INITIAL_TRACKS.find((it) => it.id === t.id);
        const override = savedOverrides[t.id];
        if (initial) {
          return {
            ...t,
            title: override?.title || initial.title,
            artist: override?.artist || initial.artist,
            album: override?.album || initial.album,
            duration: initial.duration,
            durationSeconds: initial.durationSeconds,
            coverImage: initial.coverImage,
            genre: override?.genre || initial.genre,
            story: override?.story !== undefined ? override.story : initial.story,
            lyricsSnippet: override?.lyricsSnippet !== undefined ? override.lyricsSnippet : initial.lyricsSnippet,
            audioUrl: t.audioUrl?.startsWith('blob:') ? t.audioUrl : initial.audioUrl,
          };
        }
        return override ? { ...t, ...override } : t;
      })
    );

    loadAudioFile('track-1').then((url) => {
      if (url) {
        setHasCustomAudio(true);
        setTracks((prev) =>
          prev.map((t) => (t.id === 'track-1' ? { ...t, audioUrl: url } : t))
        );
      }
    });

    loadAudioFile('track-2').then((url) => {
      if (url) {
        setTracks((prev) =>
          prev.map((t) => (t.id === 'track-2' ? { ...t, audioUrl: url } : t))
        );
      }
    });

    // Restore any custom user-uploaded covers from storage
    INITIAL_TRACKS.forEach((it) => {
      loadCoverImage(it.id).then((savedCover) => {
        if (savedCover) {
          setTracks((prev) =>
            prev.map((t) => (t.id === it.id ? { ...t, coverImage: savedCover } : t))
          );
        }
      });
    });

    // Restore any custom track audio files from IndexedDB
    try {
      const saved = localStorage.getItem('echoes_custom_tracks');
      if (saved) {
        const customTracks: Track[] = JSON.parse(saved);
        customTracks.forEach((ct) => {
          loadAudioFile(ct.id).then((url) => {
            if (url) {
              setTracks((prev) =>
                prev.map((item) => (item.id === ct.id ? { ...item, audioUrl: url } : item))
              );
            }
          });
        });
      }
    } catch (e) {
      console.warn('Failed to restore custom tracks audio', e);
    }
  }, []);

  const handleUploadHeroAudio = async (file: File) => {
    try {
      // 1. Upload to server so all visitors can hear it
      const formData = new FormData();
      formData.append('audio', file);
      fetch('/api/upload/audio', { method: 'POST', body: formData })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.url) {
            fetch('/api/tracks/track-1', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioUrl: data.url }),
            }).catch(() => {});
          }
        })
        .catch(() => {});

      // 2. Local fallback
      const url = await saveAudioFile('track-1', file);
      setHasCustomAudio(true);
      setTracks((prev) =>
        prev.map((t) => (t.id === 'track-1' ? { ...t, audioUrl: url } : t))
      );
      setCurrentTrackIndex(0);
      audioEngine.playTrack('guofeng_funk', url, 16);
      setIsPlaying(true);
      setToastMessage(`🎉 成功载入原版音频《${file.name}》！正在播放，已同步到云端服务器供所有网友收听。`);
    } catch (err) {
      console.warn('IndexedDB save fallback', err);
      const url = URL.createObjectURL(file);
      setHasCustomAudio(true);
      setTracks((prev) =>
        prev.map((t) => (t.id === 'track-1' ? { ...t, audioUrl: url } : t))
      );
      setCurrentTrackIndex(0);
      audioEngine.playTrack('guofeng_funk', url, 16);
      setIsPlaying(true);
    }
  };

  const handleUploadTrackAudio = async (trackId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);
      fetch('/api/upload/audio', { method: 'POST', body: formData })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.url) {
            fetch(`/api/tracks/${trackId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioUrl: data.url }),
            }).catch(() => {});
          }
        })
        .catch(() => {});

      const url = await saveAudioFile(trackId, file);
      setTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, audioUrl: url } : t))
      );
      const idx = tracks.findIndex((t) => t.id === trackId);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
        const targetTrack = tracks[idx];
        audioEngine.playTrack(targetTrack.synthPreset, url, targetTrack.durationSeconds);
        setIsPlaying(true);
      }
      setToastMessage(`🎉 已为曲目成功载入原版音频《${file.name}》！已同步至服务器。`);
    } catch (err) {
      console.warn('IndexedDB track audio fallback', err);
      const url = URL.createObjectURL(file);
      setTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, audioUrl: url } : t))
      );
      const idx = tracks.findIndex((t) => t.id === trackId);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
        const targetTrack = tracks[idx];
        audioEngine.playTrack(targetTrack.synthPreset, url, targetTrack.durationSeconds);
        setIsPlaying(true);
      }
    }
  };

  const handleUploadTrackCover = async (trackId: string, file: File) => {
    try {
      // Auto crop to 1:1 square centered composition and compress
      const croppedDataUrl = await cropAndCompressCoverImage(file);
      await saveCoverImage(trackId, croppedDataUrl);

      // Upload to server
      const blob = await (await fetch(croppedDataUrl)).blob();
      const coverData = new FormData();
      coverData.append('cover', blob, 'cover.jpg');
      fetch('/api/upload/cover', { method: 'POST', body: coverData })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.url) {
            fetch(`/api/tracks/${trackId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ coverImage: data.url }),
            }).catch(() => {});
          }
        })
        .catch(() => {});

      setTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, coverImage: croppedDataUrl } : t))
      );
      const track = tracks.find((t) => t.id === trackId);
      setToastMessage(`🖼️ 成功更换《${track?.title.split('·')[0] || '曲目'}》唱片封面！已自动居中裁剪为1:1正方形并同步保存。`);
    } catch (err) {
      console.warn('Cover crop fallback', err);
      const rawUrl = URL.createObjectURL(file);
      setTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, coverImage: rawUrl } : t))
      );
      setToastMessage(`🖼️ 唱片封面已更新！`);
    }
  };

  const handleSaveTrackText = (updatedTrack: Track) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === updatedTrack.id ? updatedTrack : t))
    );

    // Sync to server
    fetch(`/api/tracks/${updatedTrack.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTrack),
    }).catch(() => {});

    try {
      const saved = localStorage.getItem('echoes_track_text_overrides');
      const overrides: Record<string, Partial<Track>> = saved ? JSON.parse(saved) : {};
      overrides[updatedTrack.id] = {
        title: updatedTrack.title,
        artist: updatedTrack.artist,
        album: updatedTrack.album,
        genre: updatedTrack.genre,
        story: updatedTrack.story,
        lyricsSnippet: updatedTrack.lyricsSnippet,
      };
      localStorage.setItem('echoes_track_text_overrides', JSON.stringify(overrides));
    } catch (e) {
      console.warn('Failed to save track overrides to localStorage', e);
    }
    setToastMessage(`✨ 已成功保存《${updatedTrack.title}》的文字信息！已全局生效并同步保存。`);
  };

  const handleResetTrackText = (trackId: string) => {
    const initial = INITIAL_TRACKS.find((t) => t.id === trackId);
    if (initial) {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === trackId
            ? {
                ...t,
                title: initial.title,
                artist: initial.artist,
                album: initial.album,
                genre: initial.genre,
                story: initial.story,
                lyricsSnippet: initial.lyricsSnippet,
              }
            : t
        )
      );

      fetch(`/api/tracks/${trackId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initial),
      }).catch(() => {});

      try {
        const saved = localStorage.getItem('echoes_track_text_overrides');
        if (saved) {
          const overrides = JSON.parse(saved);
          delete overrides[trackId];
          localStorage.setItem('echoes_track_text_overrides', JSON.stringify(overrides));
        }
      } catch {}
      setToastMessage(`🔄 已将该曲目文字信息恢复为默认值。`);
    }
  };

  const handleDeleteTrack = (trackId: string) => {
    const trackToDelete = tracks.find((t) => t.id === trackId);
    const title = trackToDelete?.title || '曲目';

    const remaining = tracks.filter((t) => t.id !== trackId);

    // If currently playing track was deleted, switch to next available track or stop
    if (currentTrack?.id === trackId) {
      if (remaining.length > 0) {
        setCurrentTrackIndex(0);
        const next = remaining[0];
        if (isPlaying) {
          audioEngine.playTrack(next.synthPreset, next.audioUrl, next.durationSeconds);
        }
      } else {
        audioEngine.pause();
        setIsPlaying(false);
      }
    }

    setTracks(remaining);

    // Call server delete
    fetch(`/api/tracks/${trackId}`, { method: 'DELETE' }).catch(() => {});

    // Remove from favorites if favored
    setFavorites((prev) => {
      const updated = prev.filter((id) => id !== trackId);
      try {
        localStorage.setItem('echoes_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Remove from custom tracks in localStorage
    try {
      const savedCustom = localStorage.getItem('echoes_custom_tracks');
      if (savedCustom) {
        const customTracks: Track[] = JSON.parse(savedCustom);
        const updatedCustom = customTracks.filter((t) => t.id !== trackId);
        localStorage.setItem('echoes_custom_tracks', JSON.stringify(updatedCustom));
      }
    } catch {}

    // Record in echoes_deleted_tracks so it never comes back
    try {
      const savedDeleted = localStorage.getItem('echoes_deleted_tracks');
      const deletedIds: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
      if (!deletedIds.includes(trackId)) {
        deletedIds.push(trackId);
        localStorage.setItem('echoes_deleted_tracks', JSON.stringify(deletedIds));
      }
    } catch {}

    setToastMessage(`🗑️ 已成功从曲库中删除《${title}》！`);
  };

  // Auto-dismiss welcome toast after 7s
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 7000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Audio Playback Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.playTrack(
        currentTrack.synthPreset,
        currentTrack.audioUrl,
        currentTrack.durationSeconds
      );
      setIsPlaying(true);
    }
  };

  const handlePlayTrack = (track: Track) => {
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    }
    audioEngine.playTrack(track.synthPreset, track.audioUrl, track.durationSeconds);
    setIsPlaying(true);
  };

  const handlePlayTrackById = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (track) {
      handlePlayTrack(track);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    const nextTrack = tracks[nextIdx];
    audioEngine.playTrack(nextTrack.synthPreset, nextTrack.audioUrl, nextTrack.durationSeconds);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    const prevTrack = tracks[prevIdx];
    audioEngine.playTrack(prevTrack.synthPreset, prevTrack.audioUrl, prevTrack.durationSeconds);
    setIsPlaying(true);
  };

  const handleToggleLike = (trackId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(trackId);
      const updated = exists ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      try {
        localStorage.setItem('echoes_favorites', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const isLiked = favorites.includes(trackId);
          return {
            ...t,
            likes: isLiked ? Math.max(0, t.likes - 1) : t.likes + 1,
          };
        }
        return t;
      })
    );
  };

  const handleAddTrack = async (newTrack: Track, audioFile?: File) => {
    let finalTrack = { ...newTrack };
    if (audioFile) {
      try {
        const formData = new FormData();
        formData.append('audio', audioFile);
        const res = await fetch('/api/upload/audio', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          finalTrack.audioUrl = data.url;
        } else {
          const storedUrl = await saveAudioFile(newTrack.id, audioFile);
          finalTrack.audioUrl = storedUrl;
        }
      } catch (err) {
        console.warn('Failed to upload audio to server, fallback local', err);
        const storedUrl = await saveAudioFile(newTrack.id, audioFile);
        finalTrack.audioUrl = storedUrl;
      }
    }

    if (finalTrack.coverImage && finalTrack.coverImage.startsWith('data:')) {
      try {
        const blob = await (await fetch(finalTrack.coverImage)).blob();
        const coverData = new FormData();
        coverData.append('cover', blob, 'cover.jpg');
        const coverRes = await fetch('/api/upload/cover', { method: 'POST', body: coverData });
        const coverJson = await coverRes.json();
        if (coverJson.success && coverJson.url) {
          finalTrack.coverImage = coverJson.url;
        }
      } catch (err) {
        console.warn('Cover upload fallback', err);
      }
    }

    // Save to server so all visitors can hear it
    fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalTrack),
    }).catch(() => {});

    setTracks((prev) => {
      const updated = [finalTrack, ...prev];
      try {
        // Only save custom tracks
        const customOnly = updated.filter((t) => t.isCustom);
        localStorage.setItem('echoes_custom_tracks', JSON.stringify(customOnly));
      } catch (e) {
        console.warn('Error saving to localStorage', e);
      }
      return updated;
    });

    setCurrentTrackIndex(0);
    audioEngine.playTrack(finalTrack.synthPreset, finalTrack.audioUrl, finalTrack.durationSeconds);
    setIsPlaying(true);
    setToastMessage(`🎉 成功收录新曲目《${finalTrack.title}》！已同步到服务器，所有网友访问均可在线聆听。`);
    setInitialAddAudioFile(null);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080b] text-zinc-100 relative selection:bg-[#4E85BF] selection:text-white">
      {/* Background Procedural Cosmic Canvas */}
      <CosmicCanvas isPlaying={isPlaying} />

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isPlaying={isPlaying}
        currentTrackTitle={currentTrack?.title}
        onScrollTo={handleScrollTo}
        isCurator={isCurator}
        onOpenCuratorModal={() => setIsCuratorModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-zinc-900/90 border border-zinc-700/80 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs sm:text-sm text-zinc-200 max-w-md animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onScrollTo={handleScrollTo}
        onUploadAudio={handleUploadHeroAudio}
        hasCustomAudio={hasCustomAudio}
        isCurator={isCurator}
      />

      {/* Featured Bento Grid */}
      <FeaturedBento
        tracks={tracks}
        currentTrackId={currentTrack.id}
        isPlaying={isPlaying}
        onPlayTrack={handlePlayTrack}
        onToggleLike={handleToggleLike}
        favorites={favorites}
        onScrollToLibrary={() => handleScrollTo('library')}
        onUploadTrackAudio={handleUploadTrackAudio}
        onUploadTrackCover={handleUploadTrackCover}
        onEditTrack={(track) => {
          setEditingTrack(track);
          setIsEditModalOpen(true);
        }}
        isCurator={isCurator}
      />

      {/* Interactive Vinyl Lounge & Sound Lab */}
      <VinylLounge
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSelectTrack={handlePlayTrack}
        tracks={tracks}
      />

      {/* Complete Track Archive & Library */}
      <TrackList
        tracks={tracks}
        currentTrackId={currentTrack.id}
        isPlaying={isPlaying}
        onPlayTrack={handlePlayTrack}
        onToggleLike={handleToggleLike}
        favorites={favorites}
        onOpenStory={(track) => setSelectedStoryTrack(track)}
        onOpenAddTrack={(file) => {
          setInitialAddAudioFile(file || null);
          setIsAddModalOpen(true);
        }}
        onDeleteTrack={handleDeleteTrack}
        isCurator={isCurator}
      />

      {/* Music Journal / Liner Notes */}
      <JournalSection
        articles={INITIAL_JOURNAL}
        tracks={tracks}
        onPlayTrackById={handlePlayTrackById}
      />

      {/* Curator Profile & Audio Gear */}
      <CuratorProfile
        totalTracksCount={tracks.length}
        totalFavoritesCount={favorites.length}
        isCurator={isCurator}
        onOpenCuratorModal={() => setIsCuratorModalOpen(true)}
      />

      {/* Persistent Floating Music Player Dock */}
      <MusicPlayerDock
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        isFav={favorites.includes(currentTrack.id)}
        onToggleLike={handleToggleLike}
        onOpenStory={(track) => setSelectedStoryTrack(track)}
      />

      {/* Add Track Modal */}
      <AddTrackModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setInitialAddAudioFile(null);
        }}
        onAddTrack={handleAddTrack}
        initialAudioFile={initialAddAudioFile}
      />

      {/* Track Story Drawer Modal */}
      <SongStoryDrawer
        track={selectedStoryTrack}
        onClose={() => setSelectedStoryTrack(null)}
        isPlaying={isPlaying && currentTrack.id === selectedStoryTrack?.id}
        onTogglePlay={() => {
          if (selectedStoryTrack) {
            if (currentTrack.id === selectedStoryTrack.id) {
              handleTogglePlay();
            } else {
              handlePlayTrack(selectedStoryTrack);
            }
          }
        }}
        isFav={selectedStoryTrack ? favorites.includes(selectedStoryTrack.id) : false}
        onToggleLike={handleToggleLike}
      />

      {/* Edit Track Modal */}
      <EditTrackModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrack(null);
        }}
        track={editingTrack}
        onSaveTrack={handleSaveTrackText}
        onResetTrack={handleResetTrackText}
        onDeleteTrack={handleDeleteTrack}
      />

      {/* Curator Authentication Modal */}
      <CuratorAuthModal
        isOpen={isCuratorModalOpen}
        onClose={() => setIsCuratorModalOpen(false)}
        isCurator={isCurator}
        onLoginSuccess={() => {
          setIsCurator(true);
          setToastMessage('👑 欢迎白果音乐主理人！专属传歌、换封面与全站管理模式已激活。');
        }}
        onLogout={() => {
          setIsCurator(false);
          localStorage.removeItem('echoes_curator_auth');
          setToastMessage('🔒 已退出主理人模式，当前为普通访客纯净聆听视图。');
        }}
      />
    </div>
  );
}
