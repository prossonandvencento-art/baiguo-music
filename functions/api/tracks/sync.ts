// POST /api/tracks/sync - 同步整个曲目列表

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

export const onRequestPost: PagesFunction<{ TRACKS_KV: KVNamespace }> = async (context) => {
  const { tracks } = await context.request.json();

  if (!Array.isArray(tracks)) {
    return new Response(JSON.stringify({ success: false, message: '参数格式不正确' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await context.env.TRACKS_KV.put('all_tracks', JSON.stringify(tracks));

  return new Response(JSON.stringify({ success: true, tracks }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
