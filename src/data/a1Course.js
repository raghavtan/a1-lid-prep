// src/data/a1Course.js
//
// Structured A1 course content. See exam-prep.allium (entities CourseModule,
// Lesson, ReviewItem) for the behavioural model this data feeds.
//
// Schema
// ------
// a1Modules: ordered array. Each module:
//   { id, order, title, titleEn, canDo, lessons[], test[] }
//
// lesson:  { id, title, kind, blocks[] }
//   kind ∈ vocab | grammar | reading | listening | dialog | writing | speaking
//   block kinds (rendered by A1Lesson):
//     { kind:'prose',    text }
//     { kind:'vocab',    items:[{ de, en, ex? }] }        // ex = example sentence
//     { kind:'table',    caption, headers?, rows:[[...]] }
//     { kind:'examples', items:[{ de, en }] }
//     { kind:'dialog',   title?, lines:[{ who, de, en }] }// spoken aloud → listening
//     { kind:'tip',      text }
//     { kind:'model',    prompt, answer }                 // writing / speaking model answer
//
// test item types (auto-graded by A1ModuleTest):
//   { type:'mcq',    q, options[], answer }
//   { type:'cloze',  text(with ___), en?, options[], answer }
//   { type:'order',  tiles[], answer:[idx...], en? }      // arrange tiles into answer order
//   { type:'listen', say, q, options[], answer }          // `say` is read aloud (de-DE TTS)
//
// Review items (spaced repetition) are derived from every vocab block in the
// course — see a1ReviewItems / reviewItemsForModule at the bottom.

export const a1Modules = [
    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm02',
        order: 2,
        title: 'Begrüßung & sich vorstellen',
        titleEn: 'Greetings & Introductions',
        canDo: 'Greet people formally and informally, introduce yourself, and ask where someone is from.',
        lessons: [
            {
                id: 'm02-l1',
                title: 'Begrüßen & Verabschieden',
                kind: 'vocab',
                blocks: [
                    { kind: 'prose', text: 'German greetings depend on the time of day and on how well you know someone. Use 🔊 to hear each phrase.' },
                    {
                        kind: 'vocab', items: [
                            { de: 'Hallo', en: 'Hello', ex: 'Hallo! Wie geht es dir?' },
                            { de: 'Guten Morgen', en: 'Good morning', ex: 'Guten Morgen, Frau Klein!' },
                            { de: 'Guten Tag', en: 'Good day / Hello', ex: 'Guten Tag, mein Name ist Anna.' },
                            { de: 'Guten Abend', en: 'Good evening', ex: 'Guten Abend zusammen!' },
                            { de: 'Tschüss', en: 'Bye (informal)', ex: 'Tschüss, bis morgen!' },
                            { de: 'Auf Wiedersehen', en: 'Goodbye (formal)', ex: 'Auf Wiedersehen, Herr Meier.' },
                            { de: 'Bis bald', en: 'See you soon', ex: 'Bis bald!' },
                        ],
                    },
                    { kind: 'tip', text: 'In southern Germany and Austria you will also hear "Grüß Gott" for hello and "Servus" for both hello and bye.' },
                ],
            },
            {
                id: 'm02-l2',
                title: 'Das Verb „sein"',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: '„sein" (to be) is the most important verb in German. It is irregular — learn all six forms by heart.' },
                    {
                        kind: 'table', caption: 'sein — Präsens (to be, present)', headers: ['Pronoun', 'Form'],
                        rows: [
                            ['ich', 'bin'],
                            ['du', 'bist'],
                            ['er / sie / es', 'ist'],
                            ['wir', 'sind'],
                            ['ihr', 'seid'],
                            ['sie / Sie', 'sind'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich bin Anna.', en: 'I am Anna.' },
                            { de: 'Du bist sehr nett.', en: 'You are very nice.' },
                            { de: 'Er ist aus Spanien.', en: 'He is from Spain.' },
                            { de: 'Wir sind Studenten.', en: 'We are students.' },
                        ],
                    },
                    { kind: 'tip', text: 'Use formal "Sie" (always capitalised) with strangers and in professional settings; use "du" with friends, family, and children.' },
                ],
            },
            {
                id: 'm02-l3',
                title: 'Sich vorstellen — W-Fragen',
                kind: 'dialog',
                blocks: [
                    { kind: 'prose', text: 'Question words (W-Fragen) start with W and come first in the sentence; the verb comes second.' },
                    {
                        kind: 'vocab', items: [
                            { de: 'Wie heißt du?', en: 'What is your name? (informal)', ex: 'Wie heißt du? – Ich heiße Tom.' },
                            { de: 'Wie heißen Sie?', en: 'What is your name? (formal)', ex: 'Wie heißen Sie? – Mein Name ist Frau Klein.' },
                            { de: 'Woher kommst du?', en: 'Where are you from?', ex: 'Woher kommst du? – Ich komme aus Italien.' },
                            { de: 'Wo wohnst du?', en: 'Where do you live?', ex: 'Wo wohnst du? – Ich wohne in Berlin.' },
                            { de: 'Wie alt bist du?', en: 'How old are you?', ex: 'Wie alt bist du? – Ich bin 25 Jahre alt.' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Erstes Treffen', lines: [
                            { who: 'A', de: 'Hallo! Ich heiße Lena. Und du?', en: 'Hello! My name is Lena. And you?' },
                            { who: 'B', de: 'Hallo Lena, ich bin Marco.', en: 'Hello Lena, I am Marco.' },
                            { who: 'A', de: 'Woher kommst du, Marco?', en: 'Where are you from, Marco?' },
                            { who: 'B', de: 'Ich komme aus Italien, aus Rom. Und du?', en: 'I am from Italy, from Rome. And you?' },
                            { who: 'A', de: 'Ich komme aus Deutschland. Ich wohne in München.', en: 'I am from Germany. I live in Munich.' },
                        ],
                    },
                    { kind: 'tip', text: 'Press 🔊 on the dialog and try to answer the questions yourself before reading the English.' },
                ],
            },
            {
                id: 'm02-l4',
                title: 'Länder & Sprachen',
                kind: 'reading',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'Deutschland', en: 'Germany', ex: 'Ich komme aus Deutschland.' },
                            { de: 'Österreich', en: 'Austria', ex: 'Wien ist in Österreich.' },
                            { de: 'die Schweiz', en: 'Switzerland', ex: 'Er wohnt in der Schweiz.' },
                            { de: 'die Türkei', en: 'Turkey', ex: 'Sie kommt aus der Türkei.' },
                            { de: 'Deutsch sprechen', en: 'to speak German', ex: 'Ich spreche ein bisschen Deutsch.' },
                            { de: 'Englisch', en: 'English', ex: 'Sprichst du Englisch?' },
                        ],
                    },
                    { kind: 'prose', text: 'Read the short self-introduction, then answer the test questions for this module.' },
                    {
                        kind: 'examples', items: [
                            { de: 'Hallo! Ich heiße Yusuf und ich komme aus der Türkei.', en: 'Hello! My name is Yusuf and I am from Turkey.' },
                            { de: 'Ich wohne jetzt in Hamburg und lerne Deutsch.', en: 'I now live in Hamburg and am learning German.' },
                            { de: 'Ich spreche Türkisch, Englisch und ein bisschen Deutsch.', en: 'I speak Turkish, English and a little German.' },
                        ],
                    },
                ],
            },
            {
                id: 'm02-l5',
                title: 'Schreiben: Stell dich vor',
                kind: 'writing',
                blocks: [
                    { kind: 'prose', text: 'Writing practice is self-checked: write your answer, then compare it with the model. Mark the lesson done when you are happy with your version.' },
                    {
                        kind: 'model',
                        prompt: 'Write 3–4 sentences introducing yourself: your name, where you are from, where you live now, and which languages you speak.',
                        answer: 'Hallo! Ich heiße Maria. Ich komme aus Polen, aus Warschau. Jetzt wohne ich in Köln und lerne Deutsch. Ich spreche Polnisch, Englisch und ein bisschen Deutsch.',
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'It is 8 a.m. How do you greet someone?', options: ['Guten Abend', 'Guten Morgen', 'Gute Nacht'], answer: 1 },
            { type: 'cloze', text: 'Ich ___ Anna.', en: '(I am Anna.)', options: ['bin', 'bist', 'ist'], answer: 0 },
            { type: 'cloze', text: 'Woher ___ du?', en: '(Where are you from?)', options: ['komme', 'kommst', 'kommt'], answer: 1 },
            { type: 'mcq', q: 'Which question asks about your origin?', options: ['Wie heißt du?', 'Woher kommst du?', 'Wie alt bist du?'], answer: 1 },
            { type: 'order', tiles: ['Ich', 'wohne', 'in', 'Berlin'], answer: [0, 1, 2, 3], en: 'I live in Berlin.' },
            { type: 'order', tiles: ['Wie', 'heißen', 'Sie'], answer: [0, 1, 2], en: 'What is your name? (formal)' },
            { type: 'listen', say: 'Ich komme aus Italien.', q: 'Where is the speaker from?', options: ['Germany', 'Italy', 'Austria'], answer: 1 },
            { type: 'listen', say: 'Ich wohne in München.', q: 'Where does the speaker live?', options: ['Hamburg', 'Munich', 'Vienna'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm05',
        order: 5,
        title: 'Essen, Trinken & Einkaufen',
        titleEn: 'Food, Drink & Shopping',
        canDo: 'Name common foods and drinks, order in a café, and say what you do and don\'t want using the accusative.',
        lessons: [
            {
                id: 'm05-l1',
                title: 'Essen & Trinken',
                kind: 'vocab',
                blocks: [
                    { kind: 'prose', text: 'Core food and drink vocabulary. Note the article (der/die/das) for every noun — you will need it for the accusative.' },
                    {
                        kind: 'vocab', items: [
                            { de: 'das Brot', en: 'the bread', ex: 'Ich esse Brot zum Frühstück.' },
                            { de: 'das Brötchen', en: 'the bread roll', ex: 'Ich möchte ein Brötchen.' },
                            { de: 'der Apfel', en: 'the apple', ex: 'Der Apfel ist rot.' },
                            { de: 'der Kaffee', en: 'the coffee', ex: 'Ich trinke gern Kaffee.' },
                            { de: 'der Tee', en: 'the tea', ex: 'Möchtest du einen Tee?' },
                            { de: 'das Wasser', en: 'the water', ex: 'Ein Wasser, bitte.' },
                            { de: 'die Milch', en: 'the milk', ex: 'Die Milch ist kalt.' },
                            { de: 'der Käse', en: 'the cheese', ex: 'Ich kaufe Käse.' },
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich esse einen Apfel.', en: 'I am eating an apple.' },
                            { de: 'Ich trinke einen Kaffee.', en: 'I am drinking a coffee.' },
                        ],
                    },
                ],
            },
            {
                id: 'm05-l2',
                title: 'Der Akkusativ — ein / eine / einen',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'The direct object of a verb like essen, trinken, möchten or kaufen goes in the accusative case. Only the masculine article changes: ein → einen.' },
                    {
                        kind: 'table', caption: 'Indefinite article: Nominative → Accusative', headers: ['Gender', 'Nominative', 'Accusative'],
                        rows: [
                            ['masculine (der)', 'ein Apfel', 'einen Apfel'],
                            ['feminine (die)', 'eine Milch', 'eine Milch'],
                            ['neuter (das)', 'ein Brot', 'ein Brot'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich möchte einen Kaffee.', en: 'I would like a coffee. (der Kaffee → einen)' },
                            { de: 'Ich möchte eine Cola.', en: 'I would like a cola. (die Cola → eine)' },
                            { de: 'Ich möchte ein Brötchen.', en: 'I would like a roll. (das Brötchen → ein)' },
                        ],
                    },
                    { kind: 'tip', text: 'Memory hook: only the masculine "der" group adds the extra -en in the accusative (einen, den, keinen, meinen…).' },
                ],
            },
            {
                id: 'm05-l3',
                title: 'Verneinung — kein / keine / keinen',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: '„kein" negates a noun with an indefinite or no article — it means "no / not a / not any". It takes the same endings as "ein".' },
                    {
                        kind: 'table', caption: 'kein in the accusative', headers: ['Gender', 'Example'],
                        rows: [
                            ['masculine', 'Ich habe keinen Hunger.'],
                            ['feminine', 'Ich trinke keine Milch.'],
                            ['neuter', 'Ich esse kein Fleisch.'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich möchte keinen Kaffee, danke.', en: 'I don\'t want a coffee, thanks.' },
                            { de: 'Wir haben keine Zeit.', en: 'We have no time.' },
                        ],
                    },
                    { kind: 'tip', text: 'Use "nicht" to negate verbs/adjectives, but "kein" to negate a noun: „Ich esse nicht." vs. „Ich esse kein Brot."' },
                ],
            },
            {
                id: 'm05-l4',
                title: 'Im Supermarkt',
                kind: 'dialog',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'kaufen', en: 'to buy', ex: 'Ich kaufe Brot und Käse.' },
                            { de: 'der Euro', en: 'the euro', ex: 'Das kostet drei Euro.' },
                            { de: 'kosten', en: 'to cost', ex: 'Was kostet der Apfel?' },
                            { de: 'die Tüte', en: 'the bag', ex: 'Brauchen Sie eine Tüte?' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'An der Kasse', lines: [
                            { who: 'Verkäufer', de: 'Guten Tag! Was möchten Sie?', en: 'Good day! What would you like?' },
                            { who: 'Kunde', de: 'Guten Tag. Ich möchte ein Brot und einen Apfel, bitte.', en: 'Good day. I would like a bread and an apple, please.' },
                            { who: 'Verkäufer', de: 'Gern. Möchten Sie auch Milch?', en: 'Gladly. Would you also like milk?' },
                            { who: 'Kunde', de: 'Nein danke, keine Milch. Was kostet das?', en: 'No thanks, no milk. How much is that?' },
                            { who: 'Verkäufer', de: 'Das macht zwei Euro fünfzig.', en: 'That comes to two euros fifty.' },
                        ],
                    },
                ],
            },
            {
                id: 'm05-l5',
                title: 'Mengen & Preise',
                kind: 'reading',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'ein Kilo', en: 'a kilo', ex: 'ein Kilo Äpfel' },
                            { de: 'ein Liter', en: 'a litre', ex: 'ein Liter Milch' },
                            { de: 'eine Flasche', en: 'a bottle', ex: 'eine Flasche Wasser' },
                            { de: 'billig', en: 'cheap', ex: 'Das Brot ist billig.' },
                            { de: 'teuer', en: 'expensive', ex: 'Der Käse ist teuer.' },
                        ],
                    },
                    { kind: 'prose', text: 'Read the shopping note, then take the module test.' },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich kaufe ein Kilo Äpfel und einen Liter Milch.', en: 'I buy a kilo of apples and a litre of milk.' },
                            { de: 'Die Äpfel sind billig, aber der Käse ist teuer.', en: 'The apples are cheap, but the cheese is expensive.' },
                            { de: 'Zusammen kostet das acht Euro.', en: 'Together that costs eight euros.' },
                        ],
                    },
                ],
            },
            {
                id: 'm05-l6',
                title: 'Sprechen: Im Café bestellen',
                kind: 'speaking',
                blocks: [
                    { kind: 'prose', text: 'Speaking practice is self-checked. Read the model aloud (use 🔊 to compare), then say your own order. Mark done when you can say it fluently.' },
                    {
                        kind: 'model',
                        prompt: 'Order a drink and something to eat in a café. Greet the waiter, order, and ask the price.',
                        answer: 'Guten Tag! Ich möchte einen Kaffee und ein Brötchen, bitte. Was kostet das zusammen?',
                    },
                ],
            },
        ],
        test: [
            { type: 'cloze', text: 'Ich möchte ___ Kaffee.', en: '(a coffee — der Kaffee)', options: ['ein', 'eine', 'einen'], answer: 2 },
            { type: 'cloze', text: 'Ich möchte ___ Cola.', en: '(a cola — die Cola)', options: ['ein', 'eine', 'einen'], answer: 1 },
            { type: 'mcq', q: 'Negate: "Ich esse Fleisch." → "Ich esse ___ Fleisch."', options: ['nicht', 'kein', 'keine'], answer: 1 },
            { type: 'mcq', q: 'What does "Was kostet das?" mean?', options: ['What is that?', 'How much is that?', 'Where is that?'], answer: 1 },
            { type: 'order', tiles: ['Ich', 'möchte', 'einen', 'Apfel'], answer: [0, 1, 2, 3], en: 'I would like an apple.' },
            { type: 'order', tiles: ['Ich', 'trinke', 'keine', 'Milch'], answer: [0, 1, 2, 3], en: 'I don\'t drink milk.' },
            { type: 'listen', say: 'Das macht zwei Euro fünfzig.', q: 'What is the price?', options: ['2.15 €', '2.50 €', '5.20 €'], answer: 1 },
            { type: 'listen', say: 'Ich möchte ein Brot und einen Apfel.', q: 'What does the speaker order?', options: ['bread and an apple', 'milk and cheese', 'coffee and a roll'], answer: 0 },
        ],
    },
];

// ── Derived helpers ──────────────────────────────────────────────────────────

// Lessons carry their module id for routing/lookup.
export const a1Lessons = a1Modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
);

export const findModule = (moduleId) => a1Modules.find((m) => m.id === moduleId);

export const findLesson = (moduleId, lessonId) => {
    const m = findModule(moduleId);
    return m ? m.lessons.find((l) => l.id === lessonId) : undefined;
};

export const totalLessons = (m) => m.lessons.length;

// Review items: every vocab pair in the course becomes a spaced-repetition unit
// with a deterministic id "<moduleId>-r<index>".
function buildReviewItems() {
    return a1Modules.flatMap((m) => {
        const items = m.lessons
            .flatMap((l) => l.blocks)
            .filter((b) => b.kind === 'vocab')
            .flatMap((b) => b.items);
        return items.map((it, i) => ({
            id: `${m.id}-r${i}`,
            moduleId: m.id,
            de: it.de,
            en: it.en,
            ex: it.ex ?? null,
        }));
    });
}

export const a1ReviewItems = buildReviewItems();

export const reviewItemsForModule = (moduleId) =>
    a1ReviewItems.filter((it) => it.moduleId === moduleId);
