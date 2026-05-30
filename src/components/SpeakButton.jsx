// src/components/SpeakButton.jsx
import { Volume2 } from 'lucide-react';
import { speak, germanVoiceAvailable } from '../lib/speech.js';

// Small inline button that reads German text aloud (de-DE TTS).
export default function SpeakButton({ text, label, className = '' }) {
    const available = germanVoiceAvailable();
    return (
        <button
            type="button"
            onClick={() => speak(text)}
            title={available ? 'Listen' : 'No German voice found in this browser'}
            aria-label={`Listen: ${text}`}
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition
                ${available ? 'text-indigo-300 hover:bg-indigo-500/15' : 'text-slate-600'} ${className}`}>
            <Volume2 size={14} /> {label}
        </button>
    );
}
