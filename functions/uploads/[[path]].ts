// /uploads/* - 从R2读取上传的音频和封面文件

export const onRequestGet: PagesFunction<{ MUSIC_BUCKET: R2Bucket }> = async (context) => {
  const path = context.params.path as string[];
  const key = path.join('/');

  const object = await context.env.MUSIC_BUCKET.get(key);

  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(object.body, {
    headers,
  });
};
