import React, { useState } from 'react';
import { X, Lock, KeyRound, Check, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

interface CuratorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  isCurator: boolean;
  onLogout: () => void;
}

export const CuratorAuthModal: React.FC<CuratorAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isCurator,
  onLogout,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const input = password.trim();
    if (!input) {
      setErrorMsg('请输入主理人密码');
      return;
    }

    // Check custom password from localStorage if set, otherwise default to 'tongmen' or 'baiguo'
    const customPass = localStorage.getItem('curator_master_pass');
    const validLocally = customPass
      ? input === customPass
      : input.toLowerCase() === 'tongmen' || input.toLowerCase() === 'baiguo';

    // Also attempt server verification if available
    try {
      const res = await fetch('/api/curator/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input }),
      });
      const data = await res.json();
      if (data.success || validLocally) {
        localStorage.setItem('echoes_curator_auth', 'true');
        onLoginSuccess();
        onClose();
        return;
      }
    } catch {
      // Offline fallback
      if (validLocally) {
        localStorage.setItem('echoes_curator_auth', 'true');
        onLoginSuccess();
        onClose();
        return;
      }
    }

    setErrorMsg('密码错误。默认密码为 tongmen（铜门），请重新输入。');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) return;
    localStorage.setItem('curator_master_pass', newPass.trim());
    setSuccessNotice(`✅ 主理人密码已更新为: ${newPass.trim()}`);
    setIsChangingPass(false);
    setNewPass('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121218] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-lg shadow-amber-500/10">
          <KeyRound className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>CURATOR EXCLUSIVE</span>
          </div>
          <h3 className="text-2xl font-display italic text-white">
            {isCurator ? '白果音乐 · 主理人管理中心' : '主理人专属登入'}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {isCurator
              ? '您当前已具有主理人独家传歌、换封面、编辑与删除全部权限。访客只能收听您的音乐。'
              : '只有白果音乐主理人可以上传新歌、更换封面与管理曲库。普通访客无需密码，享受纯净全站聆听。'}
          </p>
        </div>

        {successNotice && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 text-center">
            {successNotice}
          </div>
        )}

        {isCurator ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-emerald-200">
                <div className="font-semibold text-emerald-300">主理人身份已激活</div>
                <div className="text-zinc-400 mt-0.5">全站上传按钮与编辑功能已对您解锁</div>
              </div>
            </div>

            {isChangingPass ? (
              <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                <label className="block text-xs font-mono text-zinc-300">
                  设置新主理人密码:
                </label>
                <input
                  type="text"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="输入新的安全密码..."
                  className="w-full bg-[#181822] border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPass(false)}
                    className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs"
                  >
                    保存新密码
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(true)}
                  className="text-xs text-zinc-400 hover:text-amber-300 transition-colors"
                >
                  修改主理人密码 →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  退出主理人模式
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>主理人通行密钥 (Passkey)</span>
                <span className="text-[11px] text-amber-400/80 font-sans">默认: tongmen</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码 (如 tongmen)..."
                  className="w-full bg-[#181822] border border-zinc-700/80 focus:border-amber-400 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-red-400 mt-1.5">{errorMsg}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>验证并开启管理模式</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-zinc-500">
                提示：为保障个人音乐空间纯正，仅主理人可发布音频与修改文字
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
