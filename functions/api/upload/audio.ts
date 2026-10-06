// POST /api/upload/audio - 上传音频文件到R2

export const onRequestPost: PagesFunction<{ MUSIC_BUCKET: R2Bucket }> = async (context) => {
  const formData = await context.request.formData();
  const audioFile = formData.get('audio');

  if (!audioFile || !(audioFile instanceof File)) {
    return new Response(JSON.stringify({ success: false, message: '未接收到音频文件' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 生成文件名
  const ext = audioFile.name.split('.').pop() || 'mp3';
  const timestamp = Date.now();
  const safeName = audioFile.name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
  const key = `audio/${timestamp}-${safeName}.${ext}`;

  // 上传到R2
  await context.env.MUSIC_BUCKET.put(key, audioFile.stream(), {
    httpMetadata: {
      contentType: audioFile.type || 'audio/mpeg',
    },
  });

  const fileUrl = `/uploads/audio/${timestamp}-${safeName}.${ext}`;
  
  return new Response(JSON.stringify({ success: true, url: fileUrl, filename: key }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
