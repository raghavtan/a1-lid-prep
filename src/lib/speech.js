// src/lib/speech.js
//
// Thin wrapper over the browser Web Speech API (speechSynthesis) so the course
// can read German aloud (Hören / listening practice) with no audio files.
// Everything degrades to a no-op when the API or a German voice is missing.

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export const speechSupported = () => !!synth;

// Voice lists load asynchronously in some browsers; cache and refresh.
let voices = [];
function refreshVoices() {
    if (!synth) return;
    voices = synth.getVoices() || [];
}
if (synth) {
    refreshVoices();
    // voiceschanged fires once the list is populated.
    synth.addEventListener?.('voiceschanged', refreshVoices);
}

function germanVoice() {
    if (!voices.length) refreshVoices();
    return (
        voices.find((v) => v.lang === 'de-DE') ||
        voices.find((v) => v.lang?.toLowerCase().startsWith('de')) ||
        null
    );
}

// True when a German voice is available (so the UI can hint if not).
export const germanVoiceAvailable = () => speechSupported() && !!germanVoice();

/**
 * Speak German text aloud. No-op if unsupported.
 * @param {string} text
 * @param {{ rate?: number }} [opts] rate defaults to a learner-friendly 0.9
 */
export function speak(text, opts = {}) {
    if (!synth || !text) return;
    synth.cancel(); // stop anything already playing
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = opts.rate ?? 0.9;
    const v = germanVoice();
    if (v) u.voice = v;
    synth.speak(u);
}

export function stopSpeaking() {
    synth?.cancel();
}
