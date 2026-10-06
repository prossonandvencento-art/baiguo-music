// PUT /api/tracks/:id - 更新曲目
// DELETE /api/tracks/:id - 删除曲目

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverImage: string;
  genre: string;
  mood: string;
  year: string;
  story: string;
  lyricsSnippet: string;
  synthPreset: string;
  audioUrl: string;
  likes: number;
}

async function getTracksFromKV(env: any): Promise<Track[]> {
  const data = await env.TRACKS_KV.get('all_tracks');
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

async function saveTracksToKV(env: any, tracks: Track[]) {
  await env.TRACKS_KV.put('all_tracks', JSON.stringify(tracks));
}

export const onRequestPut: PagesFunction<{ TRACKS_KV: KVNamespace }> = async (context) => {
  const id = context.params.id as string;
  const updates = await context.request.json();

  const current = await getTracksFromKV(context.env);
  const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
  await saveTracksToKV(context.env, updated);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestDelete: PagesFunction<{ TRACKS_KV: KVNamespace; MUSIC_BUCKET: R2Bucket }> = async (context) => {
  const id = context.params.id as string;

  const current = await getTracksFromKV(context.env);
  const target = current.find((t) => t.id === id);
  const updated = current.filter((t) => t.id !== id);
  await saveTracksToKV(context.env, updated);

  // 如果删除的曲目有上传到R2的文件，也一并删除
  if (target?.audioUrl && target.audioUrl.startsWith('/uploads/audio/')) {
    const key = target.audioUrl.replace('/uploads/audio/', 'audio/');
    try {
      await context.env.MUSIC_BUCKET.delete(key);
    } catch (e) {
      console.warn('Could not delete audio file from R2', e);
    }
  }
  if (target?.coverImage && target.coverImage.startsWith('/uploads/covers/')) {
    const key = target.coverImage.replace('/uploads/covers/', 'covers/');
    try {
      await context.env.MUSIC_BUCKET.delete(key);
    } catch (e) {
      console.warn('Could not delete cover from R2', e);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
