/**
 * Echoes Web Audio Engine
 * Supports synthesized generative ambient music presets and user-provided audio elements.
 * Provides real-time frequency analysis for visualizers.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: GainNode | null = null;
  public analyserNode: AnalyserNode | null = null;

  // Real Audio Element for user-uploaded MP3/WAV
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  // Synth state
  private isPlaying: boolean = false;
  private currentPreset: string = 'cosmic';
  private timerId: number | null = null;
  private activeNodes: Array<OscillatorNode | AudioBufferSourceNode> = [];
  private vinylNode: AudioBufferSourceNode | null = null;
  private vinylGain: GainNode | null = null;
  private isVinylNoiseEnabled: boolean = true;
  private volume: number = 0.8;
  private playbackSpeed: number = 1.0;

  // Playback timer simulation for synthesized tracks
  private currentProgressSeconds: number = 0;
  private trackDurationSeconds: number = 240;
  private onTimeUpdateCallback: ((current: number, duration: number) => void) | null = null;
  private progressInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyserNode.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate vinyl noise buffer
  private createVinylCrackleBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 5; // 5 seconds loop
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      // Periodic dust clicks + gentle white noise
      const isPop = Math.random() < 0.0015;
      const noise = (Math.random() * 2 - 1) * 0.03;
      data[i] = isPop ? (Math.random() > 0.5 ? 0.35 : -0.35) : noise;
    }
    return buffer;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public setSpeed(speed: number) {
    this.playbackSpeed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
  }

  public toggleVinylNoise(enable: boolean) {
    this.isVinylNoiseEnabled = enable;
    if (this.vinylGain && this.ctx) {
      this.vinylGain.gain.setValueAtTime(enable ? 0.12 : 0, this.ctx.currentTime);
    }
  }

  public setOnTimeUpdate(cb: (current: number, duration: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public seek(seconds: number) {
    this.currentProgressSeconds = Math.max(0, Math.min(this.trackDurationSeconds, seconds));
    if (this.audioElement && !isNaN(this.audioElement.duration)) {
      this.audioElement.currentTime = this.currentProgressSeconds;
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentProgressSeconds, this.trackDurationSeconds);
    }
  }

  public playTrack(
    preset: 'guofeng_funk' | 'cosmic' | 'lofi' | 'synthwave' | 'acoustic' | 'rain',
    audioUrl?: string,
    durationSeconds: number = 240,
    startTime: number = 0
  ) {
    this.initContext();
    this.stop();

    this.isPlaying = true;
    this.currentPreset = preset;
    this.trackDurationSeconds = durationSeconds;
    this.currentProgressSeconds = startTime;

    if (audioUrl && audioUrl.trim().length > 0) {
      // Play real audio file (e.g. user uploaded)
      this.playCustomAudio(audioUrl);
    } else {
      // Play synthesized generative music
      this.startSynthPreset(preset);
    }

    // Start progress tracking
    this.startProgressTimer();
  }

  private playCustomAudio(url: string) {
    if (!this.ctx || !this.masterGain) return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
      this.audioSourceNode.connect(this.masterGain);
    }

    this.audioElement.src = url;
    this.audioElement.currentTime = this.currentProgressSeconds;
    this.audioElement.playbackRate = this.playbackSpeed;
    this.audioElement.volume = this.volume;
    this.audioElement.loop = true;

    this.audioElement.onloadedmetadata = () => {
      if (this.audioElement && !isNaN(this.audioElement.duration)) {
        this.trackDurationSeconds = this.audioElement.duration;
      }
    };

    this.audioElement.play().catch((err) => {
      console.warn('Audio element play interrupted or blocked, fallback to synth:', err);
      this.startSynthPreset(this.currentPreset as 'cosmic');
    });
  }

  private startProgressTimer() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.progressInterval = window.setInterval(() => {
      if (!this.isPlaying) return;

      if (this.audioElement && !this.audioElement.paused) {
        this.currentProgressSeconds = this.audioElement.currentTime;
      } else {
        this.currentProgressSeconds += 1;
        if (this.currentProgressSeconds >= this.trackDurationSeconds) {
          this.currentProgressSeconds = 0; // Loop track
        }
      }

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentProgressSeconds, this.trackDurationSeconds);
      }
    }, 1000);
  }

  private startSynthPreset(preset: string) {
    if (!this.ctx || !this.masterGain) return;

    // Start Vinyl noise if enabled
    this.startVinylNoise();

    // Setup rhythmic chords/notes based on preset
    let step = 0;
    const bpm = preset === 'guofeng_funk' ? 104 : preset === 'synthwave' ? 116 : preset === 'lofi' ? 76 : 60;
    const intervalMs = (60 / bpm) * 1000 * (preset === 'guofeng_funk' || preset === 'synthwave' ? 0.5 : 2);

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      this.playPresetChord(preset, step);
      step = (step + 1) % 16;
      this.timerId = window.setTimeout(playChordStep, intervalMs);
    };

    playChordStep();
  }

  private playPresetChord(preset: string, step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Guofeng Funk: Slap Bass + Pentatonic Funk Stabs (E minor pentatonic + Doric funk vibes)
    if (preset === 'guofeng_funk') {
      // 16-step funk bass groove (E, E, G, A, D, E, B, D)
      const funkBassScale = [82.41, 82.41, 98.0, 110.0, 82.41, 146.83, 110.0, 123.47, 82.41, 98.0, 110.0, 146.83, 164.81, 146.83, 110.0, 98.0];
      const bassFreq = funkBassScale[step % funkBassScale.length];

      // Slap Bass Oscillator
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(bassFreq, now);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4.5, now);
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.22);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);

      // Funk Chord / Pipa Pentatonic Stabs on Syncopated Offbeats (Steps 2, 6, 10, 14)
      if (step % 4 === 2) {
        const pentatonicChords = [
          [329.63, 392.0, 493.88, 587.33, 659.25], // Em7/9 pentatonic
          [392.0, 440.0, 523.25, 659.25, 783.99],  // G maj pentatonic
        ];
        const chord = pentatonicChords[Math.floor(step / 8) % pentatonicChords.length];

        chord.forEach((freq, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const pOsc = this.ctx.createOscillator();
          const pFilter = this.ctx.createBiquadFilter();
          const pGain = this.ctx.createGain();

          pOsc.type = 'triangle';
          pOsc.frequency.setValueAtTime(freq, now + idx * 0.015);

          pFilter.type = 'bandpass';
          pFilter.frequency.setValueAtTime(freq * 1.2, now);
          pFilter.Q.setValueAtTime(3.0, now);

          pGain.gain.setValueAtTime(0.001, now);
          pGain.gain.linearRampToValueAtTime(0.06, now + 0.02);
          pGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

          pOsc.connect(pFilter);
          pFilter.connect(pGain);
          pGain.connect(this.masterGain);

          pOsc.start(now);
          pOsc.stop(now + 0.3);
        });
      }
      return;
    }

    // Harmonic chord maps (Frequencies in Hz)
    // Cosmic: Dm9, Bbmaj7, Fadd9, C
    const cosmicChords = [
      [146.83, 220.0, 261.63, 329.63, 440.0], // D3, A3, C4, E4, A4
      [116.54, 174.61, 233.08, 293.66, 349.23], // Bb2, F3, Bb3, D4, F4
      [174.61, 261.63, 329.63, 392.0, 523.25], // F3, C4, E4, G4, C5
      [130.81, 196.0, 246.94, 293.66, 392.0], // C3, G3, B3, D4, G4
    ];

    // Lo-Fi: Neo-soul Rhodes chords (Fmaj9, Em7, Dm9, Cmaj7)
    const lofiChords = [
      [174.61, 261.63, 329.63, 349.23, 440.0], // F3, C4, E4, F4, A4
      [164.81, 246.94, 293.66, 329.63, 392.0], // E3, B3, D4, E4, G4
      [146.83, 220.0, 261.63, 329.63, 440.0], // D3, A3, C4, E4, A4
      [130.81, 196.0, 246.94, 261.63, 329.63], // C3, G3, B3, C4, E4
    ];

    // Synthwave: 80s bassline & bright lead
    const synthNotes = [110.0, 130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94];

    // Acoustic: Gentle fingerpicked warm harmonics
    const acousticChords = [
      [110.0, 164.81, 220.0, 277.18, 329.63], // A2, E3, A3, C#4, E4
      [146.83, 220.0, 293.66, 369.99, 440.0], // D3, A3, D4, F#4, A4
      [123.47, 185.0, 246.94, 311.13, 369.99], // B2, F#3, B3, D#4, F#4
      [164.81, 246.94, 329.63, 392.0, 493.88], // E3, B3, E4, G4, B4
    ];

    if (preset === 'synthwave') {
      // Fast arpeggiated bass synth
      const rootFreq = synthNotes[step % synthNotes.length];
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(rootFreq * 0.5, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
      return;
    }

    const chordList =
      preset === 'cosmic' ? cosmicChords :
      preset === 'lofi' ? lofiChords :
      acousticChords;

    const currentChord = chordList[step % chordList.length];

    // Play each note in the chord with subtle stagger (strum feel)
    currentChord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = now + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      if (preset === 'lofi') {
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, noteTime);
      } else if (preset === 'acoustic') {
        osc.type = 'triangle';
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, noteTime);
        filter.Q.setValueAtTime(2.0, noteTime);
      } else {
        // cosmic pad
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, noteTime);
      }

      osc.frequency.setValueAtTime(freq, noteTime);

      const decayTime = preset === 'acoustic' ? 1.8 : 3.5;
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + decayTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + decayTime);
    });
  }

  private startVinylNoise() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const buffer = this.createVinylCrackleBuffer();
      if (!buffer) return;

      this.vinylNode = this.ctx.createBufferSource();
      this.vinylNode.buffer = buffer;
      this.vinylNode.loop = true;

      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.setValueAtTime(this.isVinylNoiseEnabled ? 0.1 : 0, this.ctx.currentTime);

      this.vinylNode.connect(this.vinylGain);
      this.vinylGain.connect(this.masterGain);

      this.vinylNode.start();
    } catch (e) {
      console.warn('Vinyl noise init error:', e);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.vinylNode) {
      try {
        this.vinylNode.stop();
        this.vinylNode.disconnect();
      } catch {
        // ignore
      }
      this.vinylNode = null;
    }
  }

  public resume() {
    if (!this.isPlaying) {
      this.initContext();
      this.isPlaying = true;
      if (this.audioElement && this.audioElement.src) {
        this.audioElement.play().catch(console.warn);
      } else {
        this.startSynthPreset(this.currentPreset);
      }
      this.startProgressTimer();
    }
  }

  public stop() {
    this.pause();
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public getFrequencyData(array: Uint8Array) {
    if (this.analyserNode && this.isPlaying) {
      // Cast array for TS 5.7+ compatibility
      this.analyserNode.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
