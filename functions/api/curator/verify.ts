// POST /api/curator/verify - 主理人密码验证

export const onRequestPost: PagesFunction = async (context) => {
  const { password } = await context.request.json();

  if (!password) {
    return new Response(JSON.stringify({ success: false, message: '请输入密码' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 验证密码：支持默认的 tongmen / baiguo，或者环境变量里配置的密码
  const validPassword = context.env.CURATOR_PASSWORD || 'tongmen';
  const valid =
    password.trim().toLowerCase() === validPassword.toLowerCase() ||
    password.trim().toLowerCase() === 'baiguo' ||
    password.trim().toLowerCase() === 'tongmen';

  if (valid) {
    return new Response(JSON.stringify({ success: true, token: 'curator-authenticated-token' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: false, message: '密码错误，主理人专属验证未通过' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
