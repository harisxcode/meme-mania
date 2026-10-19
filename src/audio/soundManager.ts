/**
 * Meme Mania Procedural Audio Synthesizer
 * 100% Web Audio API - Zero external MP3/WAV dependencies!
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  
  // Music Loop state
  private isMusicPlaying: boolean = false;
  private musicInterval: number | null = null;
  private musicStep: number = 0;
  private tempoBpm: number = 132;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  public setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicMuted(): boolean {
    return this.musicMuted;
  }

  // --- MEME SFX GENERATORS ---

  /**
   * The Legendary VINE BOOM:
   * Deep 45Hz sub-bass thump with pitch drop, clipping drive, and resonance.
   */
  public playVineBoom() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    
    // Sub-oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + 0.5);

    gain.gain.setValueAtTime(1.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    // Punch noise transient
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.sfxGain);

    osc.start(t);
    noiseSource.start(t);
    osc.stop(t + 0.75);
    noiseSource.stop(t + 0.08);
  }

  /**
   * BRUH sound effect:
   * Dual formant synthesiser pitching downward
   */
  public playBruh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const formant1 = this.ctx.createBiquadFilter();
    const formant2 = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.35);

    // Formants for "UH" sound
    formant1.type = 'bandpass';
    formant1.frequency.setValueAtTime(550, t);
    formant1.Q.setValueAtTime(4.0, t);

    formant2.type = 'bandpass';
    formant2.frequency.setValueAtTime(1100, t);
    formant2.Q.setValueAtTime(3.5, t);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(formant1);
    osc.connect(formant2);
    formant1.connect(gain);
    formant2.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  /**
   * Doge WOW:
   * Sparkling high harmonic twinkle
   */
  public playWow() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  /**
   * Dogecoin collection chime:
   * Bright double-ding with shiny overtone
   */
  public playCoin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, t); // B5
    osc1.frequency.setValueAtTime(1318.51, t + 0.06); // E6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1975.53, t); // B6
    osc2.frequency.setValueAtTime(2637.02, t + 0.06); // E7

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  /**
   * Jump sound (Boing):
   * Pitch bending upward sine wave
   */
  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.18);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  /**
   * Slide sound (Whoosh):
   * Swept bandpass filtered white noise
   */
  public playSlide() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + 0.25);
    filter.Q.setValueAtTime(3.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    whiteNoise.start(t);
    whiteNoise.stop(t + 0.25);
  }

  /**
   * Lane change swoosh:
   */
  public playLaneChange() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Stumble sound ("Emotional Damage"):
   * Squeaky slip / cartoon dissonance
   */
  public playStumble() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(450, t);
    osc1.frequency.linearRampToValueAtTime(180, t + 0.2);
    osc2.frequency.setValueAtTime(430, t); // Dissonant beat
    osc2.frequency.linearRampToValueAtTime(170, t + 0.2);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  /**
   * Power-Up activation fanfares:
   */
  public playPowerUp(type: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    if (type === 'much_speed') {
      // Supersonic rush
      this.playWow();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.3);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (type === 'stonks') {
      // Ascending triumphant cash chord
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      chords.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        noteOsc.type = 'square';
        noteOsc.frequency.setValueAtTime(freq, t + i * 0.06);
        noteGain.gain.setValueAtTime(0.25, t + i * 0.06);
        noteGain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.06 + 0.2);
        noteOsc.connect(noteGain);
        noteGain.connect(this.sfxGain);
        noteOsc.start(t + i * 0.06);
        noteOsc.stop(t + i * 0.06 + 0.2);
      });
    } else if (type === 'gigachad') {
      // Powerful synth brass flex chords + Vine Boom
      this.playVineBoom();
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(65.41, t); // C2
      bassGain.gain.setValueAtTime(0.6, t);
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      bassOsc.connect(bassGain);
      bassGain.connect(this.sfxGain);
      bassOsc.start(t);
      bassOsc.stop(t + 0.5);
    } else if (type === 'rickroll') {
      // 8-bit Never Gonna Give You Up 4-note motif
      // D4, E4, A4, G4
      const melody = [293.66, 329.63, 440.0, 392.0];
      melody.forEach((f, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mOsc.type = 'triangle';
        mOsc.frequency.setValueAtTime(f, t + i * 0.1);
        mGain.gain.setValueAtTime(0.3, t + i * 0.1);
        mGain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.15);
        mOsc.connect(mGain);
        mGain.connect(this.sfxGain);
        mOsc.start(t + i * 0.1);
        mOsc.stop(t + i * 0.1 + 0.15);
      });
    } else {
      // General powerup chime
      this.playWow();
    }
  }

  /**
   * Game Over sad trombone:
   */
  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    this.playVineBoom();

    const notes = [277.18, 261.63, 246.94, 233.08]; // C#4, C4, B3, Bb3
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + 0.2 + i * 0.25;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      // Vibrato
      if (i === 3) {
        osc.frequency.linearRampToValueAtTime(freq - 15, t + 0.7);
      }

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (i === 3 ? 0.7 : 0.22));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + (i === 3 ? 0.75 : 0.24));
    });
  }

  // --- PROCEDURAL SYNTH RUNNER BGM ---

  public startMusic(boostSpeed: boolean = false) {
    if (this.isMusicPlaying) {
      if (boostSpeed) {
        this.tempoBpm = 160;
      } else {
        this.tempoBpm = 132;
      }
      return;
    }

    this.initContext();
    this.isMusicPlaying = true;
    this.tempoBpm = boostSpeed ? 160 : 132;
    this.musicStep = 0;

    const tickMs = (60 / this.tempoBpm / 4) * 1000; // 16th note tick
    this.musicInterval = window.setInterval(() => {
      this.stepMusic();
    }, tickMs);
  }

  public setSpeedBoostMusic(boosted: boolean) {
    this.tempoBpm = boosted ? 160 : 132;
    if (this.isMusicPlaying && this.musicInterval) {
      clearInterval(this.musicInterval);
      const tickMs = (60 / this.tempoBpm / 4) * 1000;
      this.musicInterval = window.setInterval(() => {
        this.stepMusic();
      }, tickMs);
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private stepMusic() {
    if (this.musicMuted || this.isMuted || !this.ctx || !this.musicGain) {
      this.musicStep = (this.musicStep + 1) % 64;
      return;
    }

    const t = this.ctx.currentTime;
    const step = this.musicStep;

    // 1. Kick on 0, 4, 8, 12... (Four-on-the-floor runner drive)
    if (step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(130, t);
      kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.1);
      kickGain.gain.setValueAtTime(0.4, t);
      kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      kickOsc.connect(kickGain);
      kickGain.connect(this.musicGain);
      kickOsc.start(t);
      kickOsc.stop(t + 0.12);
    }

    // 2. Offbeat Hi-hat on 2, 6, 10, 14
    if (step % 4 === 2) {
      const hatBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
      const data = hatBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const hatSource = this.ctx.createBufferSource();
      hatSource.buffer = hatBuffer;
      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.setValueAtTime(7000, t);
      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(0.18, t);
      hatGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      hatSource.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.musicGain);
      hatSource.start(t);
      hatSource.stop(t + 0.04);
    }

    // 3. Cyber Synth Bassline (Driving 16th notes)
    // Progression: Am - F - C - G
    const chordIdx = Math.floor(step / 16);
    const rootNotes = [110.0, 87.31, 130.81, 98.0]; // A2, F2, C3, G2
    const currentRoot = rootNotes[chordIdx];

    if (step % 2 === 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      const octaveMult = (step % 4 === 2) ? 2 : 1;
      bassOsc.frequency.setValueAtTime(currentRoot * octaveMult, t);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(600, t);
      bassFilter.Q.setValueAtTime(3.5, t);

      bassGain.gain.setValueAtTime(0.25, t);
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.musicGain);
      bassOsc.start(t);
      bassOsc.stop(t + 0.1);
    }

    // 4. Arpeggiator Melody
    const arpNotes = [
      currentRoot * 2,
      currentRoot * 2.4, // minor/major third approx
      currentRoot * 3,   // fifth
      currentRoot * 4    // octave
    ];
    const arpNote = arpNotes[step % 4];

    if (step % 2 === 1 && Math.random() > 0.3) {
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'triangle';
      arpOsc.frequency.setValueAtTime(arpNote, t);
      arpGain.gain.setValueAtTime(0.12, t);
      arpGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      arpOsc.connect(arpGain);
      arpGain.connect(this.musicGain);
      arpOsc.start(t);
      arpOsc.stop(t + 0.08);
    }

    this.musicStep = (this.musicStep + 1) % 64;
  }
}

export const soundManager = new SoundManager();
