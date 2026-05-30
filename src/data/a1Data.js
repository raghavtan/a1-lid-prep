// src/data/a1Data.js

// --- Flashcards by category. Stable ids are generated below. ---
export const a1Categories = {
    Nouns: [
        { de: 'das Haus', en: 'the house' }, { de: 'der Tisch', en: 'the table' },
        { de: 'die Frau', en: 'the woman' }, { de: 'der Mann', en: 'the man' },
        { de: 'das Kind', en: 'the child' }, { de: 'die Katze', en: 'the cat' },
        { de: 'der Hund', en: 'the dog' }, { de: 'das Wasser', en: 'the water' },
        { de: 'die Stadt', en: 'the city' }, { de: 'das Buch', en: 'the book' },
    ],
    Verbs: [
        { de: 'sein', en: 'to be' }, { de: 'haben', en: 'to have' },
        { de: 'gehen', en: 'to go' }, { de: 'kommen', en: 'to come' },
        { de: 'machen', en: 'to do / make' }, { de: 'sprechen', en: 'to speak' },
        { de: 'essen', en: 'to eat' }, { de: 'trinken', en: 'to drink' },
        { de: 'wohnen', en: 'to live / reside' }, { de: 'arbeiten', en: 'to work' },
    ],
    Greetings: [
        { de: 'Hallo', en: 'Hello' }, { de: 'Guten Morgen', en: 'Good morning' },
        { de: 'Guten Tag', en: 'Good day' }, { de: 'Guten Abend', en: 'Good evening' },
        { de: 'Tschüss', en: 'Bye' }, { de: 'Auf Wiedersehen', en: 'Goodbye' },
        { de: "Wie geht's?", en: 'How are you?' }, { de: 'Danke', en: 'Thank you' },
        { de: 'Bitte', en: 'Please / You\'re welcome' }, { de: 'Entschuldigung', en: 'Excuse me / Sorry' },
    ],
    Numbers: [
        { de: 'eins', en: 'one' }, { de: 'zwei', en: 'two' }, { de: 'drei', en: 'three' },
        { de: 'vier', en: 'four' }, { de: 'fünf', en: 'five' }, { de: 'sechs', en: 'six' },
        { de: 'sieben', en: 'seven' }, { de: 'acht', en: 'eight' },
        { de: 'neun', en: 'nine' }, { de: 'zehn', en: 'ten' },
    ],
};

// Flat list with deterministic ids: "<Category>-<index>"
export const a1Cards = Object.entries(a1Categories).flatMap(([cat, cards]) =>
    cards.map((c, i) => ({ ...c, id: `${cat}-${i}`, category: cat }))
);

// --- Grammar sandbox: definite article drill (der/die/das) ---
export const articleDrill = [
    { word: 'Haus', article: 'das' }, { word: 'Tisch', article: 'der' },
    { word: 'Frau', article: 'die' }, { word: 'Mann', article: 'der' },
    { word: 'Kind', article: 'das' }, { word: 'Katze', article: 'die' },
    { word: 'Buch', article: 'das' }, { word: 'Stadt', article: 'die' },
];

// --- Grammar sandbox: sentence-structure MCQs (verb in 2nd position) ---
export const sentenceDrill = [
    { prompt: 'Correct word order?',
        options: ['Ich heiße Anna.', 'Heiße ich Anna.', 'Anna ich heiße.'], answer: 0 },
    { prompt: 'Choose the correct sentence:',
        options: ['Morgen ich gehe zur Arbeit.', 'Morgen gehe ich zur Arbeit.', 'Gehe morgen ich zur Arbeit.'], answer: 1 },
    { prompt: 'Pick the grammatical sentence:',
        options: ['Er wohnt in Berlin.', 'Er in Berlin wohnt.', 'In Berlin er wohnt.'], answer: 0 },
    { prompt: 'Which is correct?',
        options: ['Trinkst du Kaffee?', 'Du Kaffee trinkst?', 'Kaffee du trinkst?'], answer: 0 },
];

// --- A1 self-evaluation quiz (vocab + grammar) ---
export const a1Quiz = [
    { question: 'What does "danke" mean?', options: ['please', 'thank you', 'sorry', 'hello'], answer: 1 },
    { question: 'Which article fits: ___ Haus', options: ['der', 'die', 'das'], answer: 2 },
    { question: '"Ich ___ Anna." (My name is Anna)', options: ['bin', 'heiße', 'habe'], answer: 1 },
    { question: 'Translate: "I have a dog."', options: ['Ich bin ein Hund.', 'Ich habe einen Hund.', 'Ich gehe ein Hund.'], answer: 1 },
    { question: 'What is "fünf"?', options: ['four', 'five', 'six'], answer: 1 },
    { question: 'Which article fits: ___ Frau', options: ['der', 'die', 'das'], answer: 1 },
    { question: '"Woher kommst du?" asks about your …', options: ['name', 'origin', 'age'], answer: 1 },
    { question: 'Indefinite article: "Das ist ___ Tisch." (masc.)', options: ['ein', 'eine', 'einen'], answer: 0 },
    { question: 'Translate: "Good morning"', options: ['Guten Abend', 'Guten Morgen', 'Gute Nacht'], answer: 1 },
    { question: 'Verb in correct position: "Heute ___ ich Deutsch."', options: ['lerne', 'lernen', 'gelernt'], answer: 0 },
];