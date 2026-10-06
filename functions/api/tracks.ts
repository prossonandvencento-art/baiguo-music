// GET /api/tracks - 获取所有曲目
// POST /api/tracks - 添加新曲目

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

export const onRequestGet: PagesFunction<{ TRACKS_KV: KVNamespace }> = async (context) => {
  const tracks = await getTracksFromKV(context.env);
  return new Response(JSON.stringify({ success: true, tracks }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost: PagesFunction<{ TRACKS_KV: KVNamespace }> = async (context) => {
  const newTrack: Track = await context.request.json();
  
  if (!newTrack || !newTrack.id) {
    return new Response(JSON.stringify({ success: false, message: '曲目数据不完整' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const current = await getTracksFromKV(context.env);
  const updated = [newTrack, ...current.filter((t) => t.id !== newTrack.id)];
  await saveTracksToKV(context.env, updated);

  return new Response(JSON.stringify({ success: true, track: newTrack }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
