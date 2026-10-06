import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const CURATOR_PASSWORD = process.env.CURATOR_PASSWORD || 'tongmen';

// Ensure data and uploads directories exist
const dataDir = path.resolve(__dirname, 'data');
const uploadsDir = path.resolve(__dirname, 'uploads');
const audioUploadsDir = path.resolve(uploadsDir, 'audio');
const coverUploadsDir = path.resolve(uploadsDir, 'covers');

[dataDir, uploadsDir, audioUploadsDir, coverUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const tracksFilePath = path.resolve(dataDir, 'tracks.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));

// Multer storage configurations
const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, audioUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp3';
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\-\u4e00-\u9fa5]/g, '_');
    cb(null, `${Date.now()}-${cleanBase}${ext}`);
  },
});

const coverStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, coverUploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `cover-${Date.now()}${ext}`);
  },
});

const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const uploadCover = multer({
  storage: coverStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Helper to read server tracks
function getServerTracks() {
  if (fs.existsSync(tracksFilePath)) {
    try {
      const data = fs.readFileSync(tracksFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading tracks.json', e);
    }
  }
  return null;
}

// Helper to save server tracks
function saveServerTracks(tracks: any[]) {
  try {
    fs.writeFileSync(tracksFilePath, JSON.stringify(tracks, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving tracks.json', e);
  }
}

// --- API Endpoints ---

// Verify curator password
app.post('/api/curator/verify', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: '请输入密码' });
  }

  // Check password or allow default 'tongmen' or 'baiguo'
  const valid =
    password.trim().toLowerCase() === CURATOR_PASSWORD.toLowerCase() ||
    password.trim().toLowerCase() === 'baiguo' ||
    password.trim().toLowerCase() === 'tongmen';

  if (valid) {
    return res.json({ success: true, token: 'curator-authenticated-token' });
  }
  return res.status(401).json({ success: false, message: '密码错误，主理人专属验证未通过' });
});

// Get tracks
app.get('/api/tracks', (_req, res) => {
  const tracks = getServerTracks();
  res.json({ success: true, tracks: tracks || [] });
});

// Upload audio file (Curator only)
app.post('/api/upload/audio', uploadAudio.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '未接收到音频文件' });
  }
  const fileUrl = `/uploads/audio/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// Upload cover file (Curator only)
app.post('/api/upload/cover', uploadCover.single('cover'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '未接收到封面图片' });
  }
  const fileUrl = `/uploads/covers/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// Save or sync whole track list
app.post('/api/tracks/sync', (req, res) => {
  const { tracks } = req.body;
  if (Array.isArray(tracks)) {
    saveServerTracks(tracks);
    return res.json({ success: true, tracks });
  }
  res.status(400).json({ success: false, message: '参数格式不正确' });
});

// Add new track
app.post('/api/tracks', (req, res) => {
  const newTrack = req.body;
  if (!newTrack || !newTrack.id) {
    return res.status(400).json({ success: false, message: '曲目数据不完整' });
  }
  const current = getServerTracks() || [];
  const updated = [newTrack, ...current.filter((t: any) => t.id !== newTrack.id)];
  saveServerTracks(updated);
  res.json({ success: true, track: newTrack });
});

// Update track
app.put('/api/tracks/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const current = getServerTracks() || [];
  const updated = current.map((t: any) => (t.id === id ? { ...t, ...updates } : t));
  saveServerTracks(updated);
  res.json({ success: true });
});

// Delete track
app.delete('/api/tracks/:id', (req, res) => {
  const { id } = req.params;
  const current = getServerTracks() || [];
  const target = current.find((t: any) => t.id === id);
  const updated = current.filter((t: any) => t.id !== id);
  saveServerTracks(updated);

  // If track has an uploaded local audio file, attempt cleanup
  if (target?.audioUrl && target.audioUrl.startsWith('/uploads/')) {
    const filePath = path.resolve(__dirname, target.audioUrl.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not unlink audio file', err);
      }
    }
  }

  res.json({ success: true });
});

// Start development or production server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in dev
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static dist in prod
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Baiguo Music Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
