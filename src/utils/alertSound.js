let sharedAudioContext;
let speechVoices = [];

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioContextClass();
  }
  return sharedAudioContext;
}

function loadEnglishVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  speechVoices = window.speechSynthesis.getVoices();
  return speechVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadEnglishVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadEnglishVoices);
}

export function getAvailableEnglishVoices() {
  return loadEnglishVoices()
    .filter((voice) => /^en([_-]|$)/i.test(voice.lang))
    .map((voice) => ({ name: voice.name, lang: voice.lang, voiceURI: voice.voiceURI }));
}

export function enableAlertAudio() {
  const context = getAudioContext();
  if (context?.state === 'suspended') context.resume().catch(() => {});
  return Boolean(context);
}

export function playAlertBeep() {
  const context = getAudioContext();
  if (!context) return false;

  const playTone = () => {
    const startAt = context.currentTime + 0.025;
    // Three short alternating notes make a clear warning tone.
    [980, 720, 980].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const noteStart = startAt + index * 0.2;
      const noteEnd = noteStart + 0.15;
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.13, noteStart + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.025);
    });
  };

  if (context.state === 'suspended') {
    context.resume().then(playTone).catch((error) => console.warn('RailGuard beep could not play:', error));
  } else {
    try { playTone(); } catch (error) {
      console.warn('RailGuard beep could not play:', error);
      return false;
    }
  }
  return true;
}

export function speakRobotAlert(message = 'Warning. Safety risk detected. Check the railway track.') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  const text = String(message || '').trim();
  if (!text) return false;

  // Browser speech voices differ by device. A lower pitch and steady pace give
  // the default English voice a more synthetic, announcement-like sound.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.92;
  utterance.pitch = 0.58;
  utterance.volume = 1;

  const voices = loadEnglishVoices();
  let selectedName = '';
  try { selectedName = localStorage.getItem('railguard_voice_name') || ''; } catch {}
  const selectedVoice = voices.find((voice) => voice.voiceURI === selectedName || voice.name === selectedName);
  const preferredVoice = selectedVoice || voices.find((voice) => /english.*(india|united states|uk)|en[-_](in|us|gb)/i.test(`${voice.name} ${voice.lang}`)) || voices[0];
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang || 'en-IN';
  }
  window.speechSynthesis.speak(utterance);
  return true;
}

export function playAlertSound(message = 'Warning. Safety risk detected. Check the railway track.') {
  let soundEnabled = true;
  let voiceEnabled = true;
  try {
    const savedSound = localStorage.getItem('railguard_sound');
    soundEnabled = savedSound === null ? true : JSON.parse(savedSound) === true;
    const savedVoice = localStorage.getItem('railguard_voice_enabled');
    voiceEnabled = savedVoice === null ? true : JSON.parse(savedVoice) === true;
  } catch {}

  if (soundEnabled) playAlertBeep();
  if (voiceEnabled) {
    // A short delay lets the warning beep get the operator's attention first.
    window.setTimeout(() => speakRobotAlert(message), soundEnabled ? 360 : 0);
  }
  return soundEnabled || voiceEnabled;
}

export function isAlertSoundEnabled() {
  try {
    const saved = localStorage.getItem('railguard_sound');
    const sound = saved === null ? true : JSON.parse(saved) === true;
    const voiceSaved = localStorage.getItem('railguard_voice_enabled');
    const voice = voiceSaved === null ? true : JSON.parse(voiceSaved) === true;
    return sound || voice;
  } catch {
    return true;
  }
}
