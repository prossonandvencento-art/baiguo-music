import { Track, JournalArticle } from '../types/music';

// Generated image assets from Phase 1
import albumCosmic from '../assets/images/album_cosmic_horizon_1791208343924.jpg';
import albumTongmenGate from '../assets/images/album_tongmen_gate_1791210864871.jpg';
import albumPifuWuzui from '../assets/images/album_pifu_wuzui_1791211070949.jpg';
import albumLofi from '../assets/images/album_lofi_midnight_1791208355585.jpg';
import albumSynthwave from '../assets/images/album_synthwave_retro_1791208366083.jpg';
import albumAcoustic from '../assets/images/album_acoustic_guitar_1791208375317.jpg';
import avatarCurator from '../assets/images/avatar_curator_portrait_1791208386494.jpg';
import logoBaiguo from '../assets/images/baiguo_music_logo_1791208914562.jpg';
import yishengsuotongAudio from '../assets/audio/yishengsuotong.mp3';
import pifuwuzuiAudio from '../assets/audio/pifuwuzui.mp3';

export { avatarCurator, logoBaiguo, yishengsuotongAudio, pifuwuzuiAudio };

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: '一生所铜 · 铜门秘境',
    artist: '白果放克乐团 · 铜门客',
    album: '铜门专属 Funk Vol. 1',
    duration: '00:16',
    durationSeconds: 16,
    coverImage: albumTongmenGate,
    genre: '国风 Funk · 一生所铜专属',
    mood: 'guofeng_funk',
    year: '2026',
    story: '铜门专属定制原声！经典旋律《一生所爱》与国风 Funk 律动灵魂交融。铜门自开，金石丝竹伴随强劲低音放克鼓点，在云海深渊之巅奏响“一生所铜”的震撼回响。',
    lyricsSnippet: '“苦海翻起爱恨，在世间难逃避命运 · 铜门推开云海翻，一生所爱一生所铜。”',
    synthPreset: 'guofeng_funk',
    audioUrl: yishengsuotongAudio,
    likes: 666,
  },
  {
    id: 'track-2',
    title: '匹夫无罪 · 怀璧其罪',
    artist: '白果国潮放克 · 封神2',
    album: '铜门放克录',
    duration: '01:00',
    durationSeconds: 60,
    coverImage: albumPifuWuzui,
    genre: '国风电子Funk · 赛博国潮',
    mood: 'guofeng_funk',
    year: '2026',
    story: '取材于“匹夫无罪，怀璧其罪”古训，融合现代重低音放克（Heavy Bass Funk）与国风戏腔电子律动。双姝执幡立于废墟之水，在暗涌中迸发震撼的情绪张力与超燃节拍。',
    lyricsSnippet: '“送你一束玫瑰，学会容忍 · 谁是鬼看沉默都是鬼，谁是神管一切都是神，匹夫无罪，怀璧其罪。”',
    synthPreset: 'guofeng_funk',
    audioUrl: pifuwuzuiAudio,
    likes: 998,
  },
  {
    id: 'track-3',
    title: '青花夜行 · 弄堂放克',
    artist: '白果律动工坊',
    album: '东方微醺放克录',
    duration: '04:05',
    durationSeconds: 245,
    coverImage: albumSynthwave,
    genre: 'Guofeng Neo-Soul & Funk',
    mood: 'guofeng_funk',
    year: '2025',
    story: '把青花瓷的细腻意境融入 70 年代摩城放克与 Neo-Soul 律动。贝斯线如行云流水，铜门深处的夜色因此有了温暖的温度。',
    lyricsSnippet: '“夜色如釉，弄堂回声 · 放克节奏里，青花纹路悄然蔓延。”',
    synthPreset: 'guofeng_funk',
    likes: 389,
  },
  {
    id: 'track-4',
    title: 'Cedar & Echoes · 木吉他与晨雾',
    artist: 'Elias Thorne',
    album: 'Cabin in the Woods',
    duration: '03:26',
    durationSeconds: 206,
    coverImage: albumAcoustic,
    genre: 'Acoustic Folk & Fingerstyle',
    mood: 'acoustic',
    year: '2026',
    story: '雪松木吉他箱体的温润共鸣，指尖拂过琴弦的微小擦弦声清晰可辨。像清晨山林木屋推开窗，一阵混杂着松针香与薄雾的清冽空气扑面而来。',
    lyricsSnippet: '“木纹记录着岁月的年轮，六根琴弦勾勒出远方的轮廓 · 简单的音符，最深的情感。”',
    synthPreset: 'acoustic',
    likes: 318,
  },
];

export const INITIAL_JOURNAL: JournalArticle[] = [
  {
    id: 'art-1',
    title: '深夜两点半的爵士电台与雨声：论独处时的声音庇护所',
    category: '聆听手记',
    readTime: '5 min read',
    date: 'Oct 2025',
    summary: '为什么人在独处时会对某种特定的低保真白噪音产生深切依恋？声音如何重新界定我们的个人边界与心理空间。',
    content: [
      '深夜两点半，城市的公共声浪逐渐熄灭，白天的社交角色和信息过载终于被按下了暂停键。在这扇紧闭的窗前，很多人都会不自觉地打开一段雨声采样或一段轻缓的黑胶爵士。',
      '心理学家常提到“声音遮蔽”（Sound Masking）与“心理庇护所”的概念。现代人需要的并不总是绝对的死寂——绝对的无声反而会让人听到自己焦虑的耳鸣。我们需要的，是一种具有包容性、规律感且充满温度的声响。',
      '爵士乐里即兴的萨克斯弱音器气声、弱拍踩镲的轻擦，与窗外的雨滴形成了一种奇妙的声学互文。在这个由声波构建的微型空间里，你无需对任何人做出回应，只需静静任由思绪随旋律沉入深海。'
    ],
    recommendedTrackId: 'track-2',
    coverImage: albumLofi,
  },
  {
    id: 'art-2',
    title: '模拟磁带的质感与失真之美：为什么我们依然留恋温暖的 Lo-Fi',
    category: '声音美学',
    readTime: '8 min read',
    date: 'Nov 2025',
    summary: '高解析度数字音频普及的今天，为什么年轻一代反而沉迷于磁带饱和、高频衰减与颤音抖晃？',
    content: [
      '在数字音频早已达到 24bit/192kHz 无损甚至更高精度的今天，音乐制作人却在软硬件中疯狂寻找“模拟失真插件”——加点磁带饱和度（Tape Saturation），加一点 Wow & Flutter（抖晃），甚至故意截断 15kHz 以上的高频。',
      '这是怀旧，还是人类感知系统的本能选择？高精度的纯数字正弦波完美得近乎冷酷，边缘锋利。而模拟介质——无论是黑胶的微观沟槽还是磁带上的磁粉颗粒——都在物理层面为声音注入了一种“阻尼感”。',
      '这种物理摩擦带来的不完美，恰恰是“人性的温度”。它让声音像一杯冒着热气的温水，不再刺眼，也不再逼仄。'
    ],
    recommendedTrackId: 'track-3',
    coverImage: albumSynthwave,
  },
  {
    id: 'art-3',
    title: '环境音乐的减法哲学：从布莱恩·伊诺到生成式声景',
    category: '音乐哲学',
    readTime: '6 min read',
    date: 'Dec 2025',
    summary: '“环境音乐必须像水一样，既能引人入胜，也能被轻易忽略。” 当音乐不再索取你的注意力，真正的宁静才开始降临。',
    content: [
      '1975年，布莱恩·伊诺（Brian Eno）在一次车祸卧床休养时，友人为他放了一张竖琴黑胶唱片便离开了。音响音量开得极低，窗外恰好在下着大雨。伊诺无力起身调大音量，只能躺在床上静静听着。',
      '那一刻，他突然顿悟：为什么音乐必须占据房间的前景？为什么它不能像阳光、雨滴或空气中的灰尘一样，成为环境光晕的一部分？',
      '这诞生了 Ambient Music（环境音乐）的开山纲领：“它必须既是可以被专注倾听的，也可以是完全可以被忽略的。” 它不强加高潮，不刻意煽情，只是静静地在你的房间里拓宽维度的界限。'
    ],
    recommendedTrackId: 'track-1',
    coverImage: albumCosmic,
  },
  {
    id: 'art-4',
    title: '黑胶唱片内圈刻字与实体唱片的永恒仪式感',
    category: '黑胶文化',
    readTime: '4 min read',
    date: 'Jan 2026',
    summary: '从唱片套封套取出盘片、吹拂灰尘、降下唱臂……在这个瞬时流媒体时代，我们为什么依然渴望缓慢而神圣的仪式。',
    content: [
      '如果你拥有一张黑胶唱片，在它最内圈靠近标签的死槽（Run-out groove）区域，对着光线仔细端详，通常能看到母带工程师用手工刻下的矩阵编码，有时甚至是一句秘密暗号。',
      '流媒体算法给人类带来了触手可及的千万曲库，却也抽干了每一次选择背后的重量感。你可以随手划过 30 首歌曲，每首只听前奏 5 秒。',
      '但在黑胶唱机前，你必须从封套中抽出那张沉甸甸的 180g 重盘，仔细清洁，将唱针缓缓放置在首道纹路。这种“不得不慢下来”的物理约束，拯救了我们被碎片化撕裂的专注力。'
    ],
    recommendedTrackId: 'track-4',
    coverImage: albumAcoustic,
  },
];

export const CURATOR_INFO = {
  name: '白果音乐 · 聆听主理人',
  role: 'Sound Architect & Independent Vinyl Collector',
  location: 'Shanghai / Virtual Ether',
  bio: '欢迎来到白果音乐！我不是专业音乐人，只是一个无可救药的声音收集者。创建白果音乐这个主页，是为了在信息洪流中圈出一片安静纯粹的角落，存放那些在深夜陪伴过我、抚平过焦躁的音符。',
  setupGear: [
    { label: '耳机系统', value: 'Sennheiser HD650 + Chord Mojo 2' },
    { label: '黑胶唱机', value: 'Audio-Technica AT-LP120XUSB + Ortofon 2M Red' },
    { label: '监听音箱', value: 'Genelec 8030C Raw Aluminum' },
    { label: '便携播放', value: 'Sony Walkman NW-WM1AM2' },
  ],
  stats: [
    { label: '精选曲目', value: '142', unit: '首' },
    { label: '黑胶收藏', value: '380', unit: '张' },
    { label: '沉浸聆听', value: '2,400', unit: '小时' },
  ]
};
