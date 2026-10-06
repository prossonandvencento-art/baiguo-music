// POST /api/upload/cover - 上传封面图片到R2

export const onRequestPost: PagesFunction<{ MUSIC_BUCKET: R2Bucket }> = async (context) => {
  const formData = await context.request.formData();
  const coverFile = formData.get('cover');

  if (!coverFile || !(coverFile instanceof File)) {
    return new Response(JSON.stringify({ success: false, message: '未接收到封面文件' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 生成文件名
  const timestamp = Date.now();
  const key = `covers/cover-${timestamp}.jpg`;

  // 上传到R2
  await context.env.MUSIC_BUCKET.put(key, coverFile.stream(), {
    httpMetadata: {
      contentType: coverFile.type || 'image/jpeg',
    },
  });

  const fileUrl = `/uploads/covers/cover-${timestamp}.jpg`;
  
  return new Response(JSON.stringify({ success: true, url: fileUrl, filename: key }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
