// Silnik audio Web Audio API zoptymalizowany pod iOS Safari (w tym iOS 17+ audioSession playback)

class ToySoundEngine {
  constructor() {
    this.ctx = null;
    this.mode = 'piano'; // 'piano' | 'dj' | 'bells' | 'mute'
  }

  unlock() {
    try {
      if ('audioSession' in navigator && navigator.audioSession.type !== 'playback') {
        navigator.audioSession.type = 'playback';
      }
    } catch (_) {
      // starsze wersje Safari ignorują audioSession
    }

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  playNote(freq, durationSec = 0.42) {
    if (this.mode === 'mute') return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const dur = Math.max(0.18, Math.min(durationSec, 1.8));

    if (this.mode === 'piano') {
      // Ciepłe zabawkowo-akustyczne pianinko (dwa oscylatory + delikatny filtr)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      const g2 = this.ctx.createGain();
      g2.gain.setValueAtTime(0.22, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4.5, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.8, now + dur);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.42, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.16, now + dur * 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.08);

      osc1.connect(filter);
      osc2.connect(g2);
      g2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + dur + 0.1);
      osc2.stop(now + dur + 0.1);
    } else if (this.mode === 'dj') {
      // Imprezowy syntezator DJ Fisher-Price (lekko odstrojony sawtooth + filtr z rezonansem)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(freq * 1.004, now);

      const g2 = this.ctx.createGain();
      g2.gain.setValueAtTime(0.3, now);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(3.5, now);
      filter.frequency.setValueAtTime(freq * 6, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 2.2, now + dur * 0.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.14, now + dur * 0.65);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.06);

      osc1.connect(filter);
      osc2.connect(g2);
      g2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + dur + 0.08);
      osc2.stop(now + dur + 0.08);
    } else if (this.mode === 'bells') {
      // Dzwonki / cymbałki dziecięce
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const overtoneGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 3, now);

      overtoneGain.gain.setValueAtTime(0.18, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + Math.max(0.45, dur + 0.18));

      osc1.connect(gain);
      osc2.connect(overtoneGain);
      overtoneGain.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + Math.max(0.48, dur + 0.2));
      osc2.stop(now + 0.16);
    }
  }
}

export const soundEngine = new ToySoundEngine();
