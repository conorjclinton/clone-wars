(function () {
  let audio = null;
  function getAudio() {
    if (!audio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audio = new AudioCtx();
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }

  function laughBurst(context, start, frequency, length) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, start + length);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.16, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + length);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + length + 0.01);
  }

  function bubble(context, start, frequency) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 2.4, start + 0.075);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.14, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.085);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.095);
  }

  window.SOUNDS = {
    flap: function () {
      try {
        const context = getAudio();
        if (!context) return;
        const start = context.currentTime;
        laughBurst(context, start, 210, 0.09);
        laughBurst(context, start + 0.105, 180, 0.09);
        laughBurst(context, start + 0.21, 145, 0.12);
      } catch (error) {}
    },
    score: function () {
      try {
        const context = getAudio();
        if (!context) return;
        const start = context.currentTime;
        bubble(context, start, 260);
        bubble(context, start + 0.095, 330);
      } catch (error) {}
    },
    crash: function () {
      try {
        const context = getAudio();
        if (!context) return;
        const start = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(130, start);
        oscillator.frequency.exponentialRampToValueAtTime(42, start + 0.32);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.34);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.35);
        bubble(context, start + 0.02, 180);
      } catch (error) {}
    }
  };
})();
