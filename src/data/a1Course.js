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
        id: 'm01',
        order: 1,
        title: 'Aussprache & Alphabet',
        titleEn: 'Pronunciation & Alphabet',
        canDo: 'Pronounce every German letter, read special characters (ä/ö/ü/ß), and spell your name aloud.',
        lessons: [
            {
                id: 'm01-l1',
                title: 'Das Alphabet',
                kind: 'vocab',
                blocks: [
                    { kind: 'prose', text: 'German uses the same 26 letters as English plus four special characters: ä, ö, ü, and ß. Press 🔊 to hear any letter or word.' },
                    {
                        kind: 'table', caption: 'Alphabet & pronunciation hints', headers: ['Letter', 'German name', 'Sounds like…'],
                        rows: [
                            ['A a', 'Ah', '"a" in "father"'],
                            ['E e', 'Eh', '"e" in "bed"'],
                            ['I i', 'Ih', '"ee" in "see"'],
                            ['O o', 'Oh', '"o" in "open"'],
                            ['U u', 'Uh', '"oo" in "moon"'],
                            ['Ä ä', 'Äh', '"e" in "bed" (longer)'],
                            ['Ö ö', 'Öh', '"eu" in French "peur"'],
                            ['Ü ü', 'Üh', '"u" in French "tu"'],
                            ['ß', 'Eszett', 'sharp "ss"'],
                        ],
                    },
                    { kind: 'tip', text: 'Every letter in German is always pronounced — there are no truly silent letters like English "k" in "know".' },
                ],
            },
            {
                id: 'm01-l2',
                title: 'Besondere Laute',
                kind: 'vocab',
                blocks: [
                    { kind: 'prose', text: 'Several two-letter combinations (Digraphen) have a single fixed sound. Learn these by heart — they appear everywhere.' },
                    {
                        kind: 'table', caption: 'Key digraphs and their sounds', headers: ['Spelling', 'Sound', 'Example'],
                        rows: [
                            ['ch (after a/o/u)', 'guttural (like Scottish "loch")', 'ach, doch, Buch'],
                            ['ch (after e/i)', 'soft (like "h" in "huge")', 'ich, nicht, möchte'],
                            ['sch', '"sh"', 'Schule, schön'],
                            ['ei', '"eye"', 'mein, drei, Arbeit'],
                            ['ie', '"ee"', 'Sie, nie, wie'],
                            ['eu / äu', '"oy"', 'neu, heute, Häuser'],
                            ['sp / st (word-start)', '"shp" / "sht"', 'sprechen, Student'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich spreche Deutsch.', en: 'I speak German. (ich = soft ch; sp = shp)' },
                            { de: 'Das ist nicht schwierig.', en: 'That is not difficult. (sch = sh; ie = ee)' },
                        ],
                    },
                ],
            },
            {
                id: 'm01-l3',
                title: 'Namen buchstabieren',
                kind: 'speaking',
                blocks: [
                    { kind: 'prose', text: 'Spelling your name is tested in the A1 exam. Practice with the model below, then try your own name.' },
                    {
                        kind: 'vocab', items: [
                            { de: 'Wie schreibt man das?', en: 'How do you spell that?', ex: 'Wie schreibt man das? — T-A-N-D-O-N.' },
                            { de: 'Buchstabieren Sie bitte.', en: 'Please spell it.', ex: 'Buchstabieren Sie bitte Ihren Namen.' },
                        ],
                    },
                    {
                        kind: 'model',
                        prompt: 'A clerk asks: "Wie schreibt man Ihren Namen?" — spell your name aloud in German.',
                        answer: 'Mein Name ist Raghav. R-A-G-H-A-V.',
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'How is "sch" pronounced in German?', options: ['"sk"', '"sh"', '"ch"'], answer: 1 },
            { type: 'mcq', q: 'Which digraph sounds like "eye"?', options: ['ie', 'ei', 'eu'], answer: 1 },
            { type: 'mcq', q: 'Which digraph sounds like "ee"?', options: ['ei', 'eu', 'ie'], answer: 2 },
            { type: 'listen', say: 'Ich spreche ein bisschen Deutsch.', q: 'Which word contains a soft "ch" sound?', options: ['spreche', 'Deutsch', 'both'], answer: 2 },
            { type: 'listen', say: 'Schule, schön, schwierig', q: 'What sound starts each word?', options: ['"sk"', '"sh" (written sch)', '"tz"'], answer: 1 },
            { type: 'mcq', q: 'The letter "ß" sounds like…', options: ['a hard "b"', 'a sharp "ss"', 'the letter "z"'], answer: 1 },
        ],
    },

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
        id: 'm03',
        order: 3,
        title: 'Zahlen, Uhrzeit & Datum',
        titleEn: 'Numbers, Time & Dates',
        canDo: 'Count to 1000, give a phone number, tell the time, and say today\'s date.',
        lessons: [
            {
                id: 'm03-l1',
                title: 'Zahlen 0–100',
                kind: 'vocab',
                blocks: [
                    { kind: 'prose', text: 'German numbers 0–19 are individual words; 20–99 follow a pattern: units + "und" + tens (e.g. einundzwanzig = one-and-twenty).' },
                    {
                        kind: 'vocab', items: [
                            { de: 'null', en: '0' },
                            { de: 'eins / ein', en: '1 (standalone / in compound)' },
                            { de: 'zwei', en: '2' },
                            { de: 'drei', en: '3' },
                            { de: 'vier', en: '4' },
                            { de: 'fünf', en: '5' },
                            { de: 'sechs', en: '6' },
                            { de: 'sieben', en: '7' },
                            { de: 'acht', en: '8' },
                            { de: 'neun', en: '9' },
                            { de: 'zehn', en: '10' },
                            { de: 'elf', en: '11' },
                            { de: 'zwölf', en: '12' },
                            { de: 'dreizehn', en: '13' },
                            { de: 'zwanzig', en: '20' },
                            { de: 'einundzwanzig', en: '21', ex: 'Ich bin einundzwanzig Jahre alt.' },
                            { de: 'dreißig', en: '30' },
                            { de: 'vierzig', en: '40' },
                            { de: 'fünfzig', en: '50' },
                            { de: 'hundert', en: '100' },
                        ],
                    },
                    { kind: 'tip', text: '"Zwei" is sometimes replaced by "zwo" on the phone to avoid confusion with "drei".' },
                ],
            },
            {
                id: 'm03-l2',
                title: 'Uhrzeit',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'To ask the time: "Wie spät ist es?" or "Wie viel Uhr ist es?"' },
                    {
                        kind: 'table', caption: 'Telling the time', headers: ['Time', 'Official', 'Informal'],
                        rows: [
                            ['9:00', 'neun Uhr', 'neun'],
                            ['9:15', 'neun Uhr fünfzehn', 'Viertel nach neun'],
                            ['9:30', 'neun Uhr dreißig', 'halb zehn (half to ten!)'],
                            ['9:45', 'neun Uhr fünfundvierzig', 'Viertel vor zehn'],
                            ['12:00', 'zwölf Uhr', 'Mittag'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Es ist halb zehn.', en: 'It is half past nine. (lit. half [to] ten)' },
                            { de: 'Um wie viel Uhr beginnt der Kurs?', en: 'At what time does the course start?' },
                            { de: 'Der Kurs beginnt um acht Uhr.', en: 'The course starts at eight o\'clock.' },
                        ],
                    },
                    { kind: 'tip', text: '"Halb" looks ahead to the next hour: "halb zehn" = 30 min before 10 = 9:30.' },
                ],
            },
            {
                id: 'm03-l3',
                title: 'Wochentage & Monate',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'Montag', en: 'Monday' },
                            { de: 'Dienstag', en: 'Tuesday' },
                            { de: 'Mittwoch', en: 'Wednesday' },
                            { de: 'Donnerstag', en: 'Thursday' },
                            { de: 'Freitag', en: 'Friday' },
                            { de: 'Samstag', en: 'Saturday' },
                            { de: 'Sonntag', en: 'Sunday' },
                            { de: 'Januar', en: 'January' },
                            { de: 'Februar', en: 'February' },
                            { de: 'März', en: 'March' },
                            { de: 'April', en: 'April' },
                            { de: 'Mai', en: 'May' },
                            { de: 'Juni', en: 'June' },
                            { de: 'Juli', en: 'July' },
                            { de: 'August', en: 'August' },
                            { de: 'September', en: 'September' },
                            { de: 'Oktober', en: 'October' },
                            { de: 'November', en: 'November' },
                            { de: 'Dezember', en: 'December' },
                        ],
                    },
                    { kind: 'tip', text: 'Days and months are masculine (der Montag, der Januar) but rarely used with an article in speech.' },
                ],
            },
            {
                id: 'm03-l4',
                title: 'Datum',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Dates use ordinal numbers. Written: "1." = erste, "2." = zweite, "3." = dritte, then mostly add -te (4. = vierte) or -ste (20. = zwanzigste).' },
                    {
                        kind: 'table', caption: 'Key ordinals for dates', headers: ['Number', 'Ordinal', 'Date phrase'],
                        rows: [
                            ['1.', 'erste', 'am ersten Januar'],
                            ['2.', 'zweite', 'am zweiten März'],
                            ['3.', 'dritte', 'am dritten Mai'],
                            ['7.', 'siebte', 'am siebten August'],
                            ['20.', 'zwanzigste', 'am zwanzigsten Oktober'],
                            ['31.', 'einunddreißigste', 'am einunddreißigsten Dezember'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Heute ist der erste Juni.', en: 'Today is the first of June.' },
                            { de: 'Mein Geburtstag ist am dritten März.', en: 'My birthday is on the third of March.' },
                            { de: 'Wann ist die Prüfung? — Am zwanzigsten Juni.', en: 'When is the exam? — On the 20th of June.' },
                        ],
                    },
                ],
            },
            {
                id: 'm03-l5',
                title: 'Schreiben: Persönliche Daten',
                kind: 'writing',
                blocks: [
                    {
                        kind: 'model',
                        prompt: 'A form asks for your phone number, date of birth, and today\'s date. Write three sentences giving this information.',
                        answer: 'Meine Telefonnummer ist null-eins-sieben-drei-vier-fünf-sechs-sieben-acht-neun. Ich bin am fünfzehnten April neunzehnhundertneunzig geboren. Heute ist der einunddreißigste Mai zweitausendundzwanzig.',
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'What is "einundzwanzig"?', options: ['12', '21', '20'], answer: 1 },
            { type: 'listen', say: 'Es ist halb zehn.', q: 'What time is it?', options: ['10:00', '9:30', '10:30'], answer: 1 },
            { type: 'listen', say: 'Heute ist Mittwoch, der dritte März.', q: 'What day is it?', options: ['Monday', 'Wednesday', 'Thursday'], answer: 1 },
            { type: 'mcq', q: '"Viertel nach neun" means…', options: ['8:45', '9:15', '9:45'], answer: 1 },
            { type: 'cloze', text: 'Mein Geburtstag ist ___ dritten April.', en: '(My birthday is on the 3rd of April.)', options: ['an', 'am', 'im'], answer: 1 },
            { type: 'order', tiles: ['Um', 'wie', 'viel', 'Uhr', 'beginnt', 'der', 'Kurs'], answer: [0, 1, 2, 3, 4, 5, 6], en: 'At what time does the course start?' },
            { type: 'mcq', q: 'How do you say "half past nine" in German?', options: ['halb neun', 'halb zehn', 'neun und halb'], answer: 1 },
            { type: 'listen', say: 'Meine Telefonnummer ist null-drei-null, vier-fünf-sechs.', q: 'What is the number?', options: ['030 456', '040 456', '030 654'], answer: 0 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm04',
        order: 4,
        title: 'Familie & Personen',
        titleEn: 'Family & People',
        canDo: 'Name family members, describe your family, use possessives, and conjugate "haben".',
        lessons: [
            {
                id: 'm04-l1',
                title: 'Familienmitglieder',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'die Mutter', en: 'the mother', ex: 'Meine Mutter heißt Petra.' },
                            { de: 'der Vater', en: 'the father', ex: 'Mein Vater ist 55 Jahre alt.' },
                            { de: 'die Eltern (pl.)', en: 'the parents', ex: 'Meine Eltern wohnen in Berlin.' },
                            { de: 'die Schwester', en: 'the sister', ex: 'Ich habe eine Schwester.' },
                            { de: 'der Bruder', en: 'the brother', ex: 'Mein Bruder ist jung.' },
                            { de: 'die Geschwister (pl.)', en: 'the siblings', ex: 'Hast du Geschwister?' },
                            { de: 'das Kind', en: 'the child', ex: 'Ich habe zwei Kinder.' },
                            { de: 'die Großmutter', en: 'the grandmother', ex: 'Meine Großmutter kocht sehr gut.' },
                            { de: 'der Großvater', en: 'the grandfather', ex: 'Mein Großvater liest viel.' },
                            { de: 'der Mann / die Frau', en: 'the husband / the wife', ex: 'Mein Mann arbeitet in Hamburg.' },
                        ],
                    },
                ],
            },
            {
                id: 'm04-l2',
                title: 'Das Verb „haben"',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: '„haben" (to have) is the second most important verb. Like "sein" it is irregular — learn all six forms.' },
                    {
                        kind: 'table', caption: 'haben — Präsens', headers: ['Pronoun', 'Form'],
                        rows: [
                            ['ich', 'habe'],
                            ['du', 'hast'],
                            ['er / sie / es', 'hat'],
                            ['wir', 'haben'],
                            ['ihr', 'habt'],
                            ['sie / Sie', 'haben'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich habe einen Bruder und zwei Schwestern.', en: 'I have one brother and two sisters.' },
                            { de: 'Hast du Kinder?', en: 'Do you have children?' },
                            { de: 'Sie hat keine Geschwister.', en: 'She has no siblings.' },
                        ],
                    },
                ],
            },
            {
                id: 'm04-l3',
                title: 'Possessivpronomen',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Possessives take the same endings as "ein". In the nominative singular they look exactly like "ein/eine".' },
                    {
                        kind: 'table', caption: 'Possessives — Nominative', headers: ['Person', 'masc.', 'fem.', 'neut.'],
                        rows: [
                            ['my', 'mein', 'meine', 'mein'],
                            ['your (du)', 'dein', 'deine', 'dein'],
                            ['his', 'sein', 'seine', 'sein'],
                            ['her', 'ihr', 'ihre', 'ihr'],
                            ['our', 'unser', 'unsere', 'unser'],
                            ['your (Sie)', 'Ihr', 'Ihre', 'Ihr'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Mein Vater ist Arzt.', en: 'My father is a doctor.' },
                            { de: 'Deine Schwester ist sehr nett.', en: 'Your sister is very nice.' },
                            { de: 'Unser Haus ist klein.', en: 'Our house is small.' },
                        ],
                    },
                    { kind: 'tip', text: 'Accusative: only masculine gets -en (meinen Bruder, seinen Vater).' },
                ],
            },
            {
                id: 'm04-l4',
                title: 'Pluralformen',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'German plurals have no single rule — each noun has its own plural. The definite article in the plural is always "die".' },
                    {
                        kind: 'table', caption: 'Common plural patterns', headers: ['Singular', 'Plural', 'Pattern'],
                        rows: [
                            ['die Mutter', 'die Mütter', 'umlaut'],
                            ['der Bruder', 'die Brüder', 'umlaut'],
                            ['das Kind', 'die Kinder', '+er'],
                            ['der Mann', 'die Männer', 'umlaut +er'],
                            ['die Frau', 'die Frauen', '+en'],
                            ['das Buch', 'die Bücher', 'umlaut +er'],
                        ],
                    },
                    { kind: 'tip', text: 'Always learn der/die/das AND the plural when you learn a noun (e.g. "der Mann, die Männer").' },
                ],
            },
            {
                id: 'm04-l5',
                title: 'Dialog: Meine Familie',
                kind: 'dialog',
                blocks: [
                    {
                        kind: 'dialog', title: 'Familie vorstellen', lines: [
                            { who: 'A', de: 'Hast du Geschwister?', en: 'Do you have siblings?' },
                            { who: 'B', de: 'Ja, ich habe einen Bruder und eine Schwester. Und du?', en: 'Yes, I have a brother and a sister. And you?' },
                            { who: 'A', de: 'Ich habe keine Geschwister. Ich bin Einzelkind.', en: 'I have no siblings. I am an only child.' },
                            { who: 'B', de: 'Bist du verheiratet?', en: 'Are you married?' },
                            { who: 'A', de: 'Nein, noch nicht. Und du?', en: 'No, not yet. And you?' },
                            { who: 'B', de: 'Ja, ich bin verheiratet und habe zwei Kinder.', en: 'Yes, I am married and have two children.' },
                        ],
                    },
                    {
                        kind: 'vocab', items: [
                            { de: 'verheiratet', en: 'married', ex: 'Ich bin verheiratet.' },
                            { de: 'ledig', en: 'single (unmarried)', ex: 'Sie ist ledig.' },
                            { de: 'das Einzelkind', en: 'the only child', ex: 'Er ist Einzelkind.' },
                        ],
                    },
                ],
            },
            {
                id: 'm04-l6',
                title: 'Schreiben: Meine Familie',
                kind: 'writing',
                blocks: [
                    {
                        kind: 'model',
                        prompt: 'Write 4–5 sentences describing your family: who is in it, names, ages, where they live.',
                        answer: 'Meine Familie ist nicht sehr groß. Ich habe einen Bruder. Er heißt Ravi und ist dreißig Jahre alt. Er wohnt in Köln. Meine Eltern wohnen in Indien.',
                    },
                ],
            },
        ],
        test: [
            { type: 'cloze', text: 'Ich ___ zwei Kinder.', en: '(I have two children.)', options: ['bin', 'habe', 'hat'], answer: 1 },
            { type: 'cloze', text: '___ Vater ist Arzt.', en: '(My father is a doctor.)', options: ['Meine', 'Mein', 'Meinen'], answer: 1 },
            { type: 'mcq', q: 'What is the plural of "das Kind"?', options: ['die Kinden', 'die Kinder', 'die Kinds'], answer: 1 },
            { type: 'mcq', q: 'What does "Geschwister" mean?', options: ['children', 'grandparents', 'siblings'], answer: 2 },
            { type: 'order', tiles: ['Hast', 'du', 'Geschwister'], answer: [0, 1, 2], en: 'Do you have siblings?' },
            { type: 'order', tiles: ['Meine', 'Eltern', 'wohnen', 'in', 'Berlin'], answer: [0, 1, 2, 3, 4], en: 'My parents live in Berlin.' },
            { type: 'listen', say: 'Ich habe einen Bruder und eine Schwester.', q: 'How many siblings?', options: ['1 brother, 2 sisters', '1 brother, 1 sister', '2 brothers, 1 sister'], answer: 1 },
            { type: 'listen', say: 'Sie ist verheiratet und hat drei Kinder.', q: 'How many children?', options: ['2', '3', '4'], answer: 1 },
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

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm06',
        order: 6,
        title: 'Tagesablauf',
        titleEn: 'Daily Routine',
        canDo: 'Describe your daily routine using regular present-tense verbs, separable verbs, and time expressions.',
        lessons: [
            {
                id: 'm06-l1',
                title: 'Regelmäßige Verben: Präsens',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Regular (weak) verbs follow a predictable pattern: drop the -en infinitive ending and add the personal endings.' },
                    {
                        kind: 'table', caption: 'machen (to do/make) — Präsens', headers: ['Pronoun', 'Ending', 'Form'],
                        rows: [
                            ['ich', '-e', 'mache'],
                            ['du', '-st', 'machst'],
                            ['er / sie / es', '-t', 'macht'],
                            ['wir', '-en', 'machen'],
                            ['ihr', '-t', 'macht'],
                            ['sie / Sie', '-en', 'machen'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich lerne jeden Tag Deutsch.', en: 'I learn German every day.' },
                            { de: 'Er arbeitet von neun bis fünf.', en: 'He works from nine to five.' },
                            { de: 'Wir spielen am Wochenende Fußball.', en: 'We play football at the weekend.' },
                        ],
                    },
                    { kind: 'tip', text: 'Stems ending in -d/-t add an extra -e- before some endings: du arbeitest (not arbeitst).' },
                ],
            },
            {
                id: 'm06-l2',
                title: 'Trennbare Verben',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Separable verbs have a prefix that splits off and goes to the end of the sentence in a main clause.' },
                    {
                        kind: 'vocab', items: [
                            { de: 'aufstehen', en: 'to get up', ex: 'Ich stehe um sieben Uhr auf.' },
                            { de: 'aufmachen', en: 'to open', ex: 'Sie macht das Fenster auf.' },
                            { de: 'anziehen', en: 'to put on (clothes)', ex: 'Er zieht sich an.' },
                            { de: 'einkaufen', en: 'to go shopping', ex: 'Wir kaufen am Samstag ein.' },
                            { de: 'anfangen', en: 'to start / begin', ex: 'Der Film fängt um 20 Uhr an.' },
                            { de: 'fernsehen', en: 'to watch TV', ex: 'Ich sehe abends fern.' },
                        ],
                    },
                    { kind: 'tip', text: 'In a conjugated main clause the prefix goes to the very end: "Ich stehe um sieben auf." not "Ich aufstehe um sieben."' },
                ],
            },
            {
                id: 'm06-l3',
                title: 'Tagesroutine & Zeitausdrücke',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'aufwachen', en: 'to wake up', ex: 'Ich wache um sechs Uhr auf.' },
                            { de: 'frühstücken', en: 'to have breakfast', ex: 'Wir frühstücken zusammen.' },
                            { de: 'zur Arbeit fahren', en: 'to commute to work', ex: 'Er fährt um acht zur Arbeit.' },
                            { de: 'zu Mittag essen', en: 'to have lunch', ex: 'Ich esse um zwölf zu Mittag.' },
                            { de: 'nach Hause kommen', en: 'to come home', ex: 'Sie kommt um 18 Uhr nach Hause.' },
                            { de: 'schlafen gehen', en: 'to go to sleep', ex: 'Ich gehe um 23 Uhr schlafen.' },
                            { de: 'morgens', en: 'in the morning(s)', ex: 'Morgens trinke ich Kaffee.' },
                            { de: 'abends', en: 'in the evening(s)', ex: 'Abends lerne ich Deutsch.' },
                            { de: 'jeden Tag', en: 'every day', ex: 'Ich lerne jeden Tag.' },
                            { de: 'am Wochenende', en: 'at the weekend', ex: 'Am Wochenende schlafe ich lange.' },
                            { de: 'manchmal', en: 'sometimes', ex: 'Manchmal laufe ich morgens.' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Wie sieht dein Tag aus?', lines: [
                            { who: 'A', de: 'Wann stehst du auf?', en: 'When do you get up?' },
                            { who: 'B', de: 'Ich stehe um halb sieben auf. Dann frühstücke ich und fahre zur Arbeit.', en: 'I get up at half past six. Then I have breakfast and go to work.' },
                            { who: 'A', de: 'Wann kommst du nach Hause?', en: 'When do you come home?' },
                            { who: 'B', de: 'Meistens um achtzehn Uhr. Abends sehe ich fern oder lese.', en: 'Usually at six in the evening. In the evenings I watch TV or read.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'cloze', text: 'Ich ___ um sieben Uhr auf.', en: '(I get up at 7.)', options: ['aufstehe', 'stehe auf', 'stehe'], answer: 1 },
            { type: 'cloze', text: 'Er ___ jeden Tag Deutsch.', en: '(He learns German every day.)', options: ['lernt', 'lernst', 'lerne'], answer: 0 },
            { type: 'mcq', q: 'Where does the separable prefix go in a main clause?', options: ['stays attached', 'goes to the end', 'goes to the beginning'], answer: 1 },
            { type: 'order', tiles: ['Ich', 'stehe', 'um', 'sieben', 'Uhr', 'auf'], answer: [0, 1, 2, 3, 4, 5], en: 'I get up at seven.' },
            { type: 'order', tiles: ['Abends', 'sehe', 'ich', 'fern'], answer: [0, 1, 2, 3], en: 'In the evenings I watch TV.' },
            { type: 'listen', say: 'Ich stehe um halb sieben auf und frühstücke.', q: 'What time does the speaker get up?', options: ['6:00', '6:30', '7:00'], answer: 1 },
            { type: 'listen', say: 'Wir kaufen am Samstag ein.', q: 'When do they go shopping?', options: ['Sunday', 'Friday', 'Saturday'], answer: 2 },
            { type: 'mcq', q: 'What does "manchmal" mean?', options: ['always', 'never', 'sometimes'], answer: 2 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm07',
        order: 7,
        title: 'Wohnen',
        titleEn: 'Home & Living',
        canDo: 'Name rooms and furniture, describe where things are, and say what a flat is like using "es gibt".',
        lessons: [
            {
                id: 'm07-l1',
                title: 'Zimmer & Möbel',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'das Zimmer', en: 'the room', ex: 'Meine Wohnung hat drei Zimmer.' },
                            { de: 'das Wohnzimmer', en: 'the living room', ex: 'Das Sofa steht im Wohnzimmer.' },
                            { de: 'das Schlafzimmer', en: 'the bedroom', ex: 'Ich schlafe im Schlafzimmer.' },
                            { de: 'die Küche', en: 'the kitchen', ex: 'Wir kochen in der Küche.' },
                            { de: 'das Badezimmer', en: 'the bathroom', ex: 'Das Badezimmer ist klein.' },
                            { de: 'der Balkon', en: 'the balcony', ex: 'Ich sitze gern auf dem Balkon.' },
                            { de: 'das Sofa', en: 'the sofa', ex: 'Das Sofa ist bequem.' },
                            { de: 'der Stuhl', en: 'the chair', ex: 'Bitte nimm einen Stuhl.' },
                            { de: 'das Bett', en: 'the bed', ex: 'Das Bett ist sehr groß.' },
                            { de: 'der Schrank', en: 'the wardrobe / cupboard', ex: 'Meine Kleider sind im Schrank.' },
                        ],
                    },
                ],
            },
            {
                id: 'm07-l2',
                title: 'Präpositionen des Ortes',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Two-way prepositions take the dative to describe a static location (wo? — where?) and accusative for movement (wohin?). At A1, focus on location (dative).' },
                    {
                        kind: 'table', caption: 'Location prepositions + dative', headers: ['Preposition', 'Meaning', 'Example'],
                        rows: [
                            ['in + dem → im', 'in', 'Das Buch liegt im Regal.'],
                            ['an + dem → am', 'on (vertical) / at', 'Das Bild hängt an der Wand.'],
                            ['auf + dem', 'on (horizontal)', 'Die Tasse steht auf dem Tisch.'],
                            ['unter + dem', 'under', 'Der Hund liegt unter dem Tisch.'],
                            ['neben + dem', 'next to', 'Das Sofa steht neben dem Fenster.'],
                            ['vor + dem', 'in front of', 'Der Stuhl steht vor dem Schreibtisch.'],
                            ['hinter + dem', 'behind', 'Die Katze sitzt hinter dem Sofa.'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Das Buch liegt auf dem Tisch.', en: 'The book is lying on the table.' },
                            { de: 'Die Lampe hängt an der Decke.', en: 'The lamp is hanging from the ceiling.' },
                        ],
                    },
                ],
            },
            {
                id: 'm07-l3',
                title: '„es gibt"',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: '„Es gibt" (there is / there are) takes the accusative case. Use it to say what exists in a place.' },
                    {
                        kind: 'examples', items: [
                            { de: 'Es gibt einen Supermarkt in der Nähe.', en: 'There is a supermarket nearby.' },
                            { de: 'In meiner Wohnung gibt es keine Garage.', en: 'In my flat there is no garage.' },
                            { de: 'Gibt es hier einen Aufzug?', en: 'Is there a lift here?' },
                        ],
                    },
                    { kind: 'tip', text: '"Es gibt" is always 3rd-person singular — even for plural objects: "Es gibt viele Restaurants hier."' },
                ],
            },
            {
                id: 'm07-l4',
                title: 'Dialog: Wohnungssuche',
                kind: 'dialog',
                blocks: [
                    {
                        kind: 'dialog', title: 'Am Telefon: Wohnung mieten', lines: [
                            { who: 'Vermieter', de: 'Guten Tag! Sie rufen wegen der Wohnung an?', en: 'Good day! You are calling about the flat?' },
                            { who: 'Mieter', de: 'Ja, genau. Wie viele Zimmer hat die Wohnung?', en: 'Yes, exactly. How many rooms does the flat have?' },
                            { who: 'Vermieter', de: 'Drei Zimmer: Wohnzimmer, Schlafzimmer und Küche. Und ein Badezimmer natürlich.', en: 'Three rooms: living room, bedroom and kitchen. And a bathroom of course.' },
                            { who: 'Mieter', de: 'Gibt es auch einen Balkon?', en: 'Is there also a balcony?' },
                            { who: 'Vermieter', de: 'Ja, einen kleinen Balkon. Die Miete ist 800 Euro warm.', en: 'Yes, a small balcony. The rent is 800 euros all-in.' },
                        ],
                    },
                    {
                        kind: 'vocab', items: [
                            { de: 'die Miete', en: 'the rent', ex: 'Die Miete beträgt 750 Euro.' },
                            { de: 'die Wohnung', en: 'the flat / apartment', ex: 'Ich suche eine Wohnung.' },
                            { de: 'der Vermieter', en: 'the landlord', ex: 'Der Vermieter ist freundlich.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'cloze', text: 'Das Buch liegt ___ dem Tisch.', en: '(The book is on the table.)', options: ['auf', 'an', 'in'], answer: 0 },
            { type: 'cloze', text: 'Es ___ keinen Balkon.', en: '(There is no balcony.)', options: ['hat', 'gibt', 'ist'], answer: 1 },
            { type: 'mcq', q: 'Which room do you cook in?', options: ['das Schlafzimmer', 'das Badezimmer', 'die Küche'], answer: 2 },
            { type: 'order', tiles: ['Das', 'Sofa', 'steht', 'neben', 'dem', 'Fenster'], answer: [0, 1, 2, 3, 4, 5], en: 'The sofa stands next to the window.' },
            { type: 'listen', say: 'Meine Wohnung hat drei Zimmer und einen Balkon.', q: 'How many rooms?', options: ['2', '3', '4'], answer: 1 },
            { type: 'listen', say: 'Die Katze sitzt unter dem Tisch.', q: 'Where is the cat?', options: ['on the table', 'next to the table', 'under the table'], answer: 2 },
            { type: 'mcq', q: '"im" is a contraction of…', options: ['in das', 'in dem', 'an dem'], answer: 1 },
            { type: 'cloze', text: 'Gibt es ___ Supermarkt in der Nähe?', en: '(Is there a supermarket nearby?)', options: ['ein', 'einen', 'eine'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm08',
        order: 8,
        title: 'Arbeit & Beruf',
        titleEn: 'Work & Professions',
        canDo: 'Name professions, describe your workplace, and use modal verbs to say what you can, must, or want to do.',
        lessons: [
            {
                id: 'm08-l1',
                title: 'Berufe',
                kind: 'vocab',
                blocks: [
                    { kind: 'prose', text: 'German professions have masculine and feminine forms. State your job without an article: "Ich bin Arzt." (never "Ich bin ein Arzt.")' },
                    {
                        kind: 'vocab', items: [
                            { de: 'der Arzt / die Ärztin', en: 'the doctor (m/f)', ex: 'Meine Mutter ist Ärztin.' },
                            { de: 'der Lehrer / die Lehrerin', en: 'the teacher (m/f)', ex: 'Ich bin Lehrer.' },
                            { de: 'der Ingenieur / die Ingenieurin', en: 'the engineer (m/f)', ex: 'Er ist Ingenieur.' },
                            { de: 'der Verkäufer / die Verkäuferin', en: 'the sales assistant (m/f)', ex: 'Sie arbeitet als Verkäuferin.' },
                            { de: 'der Kellner / die Kellnerin', en: 'the waiter / waitress', ex: 'Der Kellner bringt die Rechnung.' },
                            { de: 'der Student / die Studentin', en: 'the student (m/f)', ex: 'Ich bin noch Student.' },
                        ],
                    },
                    { kind: 'tip', text: 'Most feminine forms add -in to the masculine. Some add an umlaut: Arzt → Ärztin, Koch → Köchin.' },
                ],
            },
            {
                id: 'm08-l2',
                title: 'Modalverben',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Modal verbs express ability, obligation, or desire. They conjugate irregularly and send the main verb to the end as an infinitive.' },
                    {
                        kind: 'table', caption: 'Modal verbs — key forms', headers: ['Infinitive', 'ich', 'du', 'er/sie/es', 'wir/sie/Sie'],
                        rows: [
                            ['können (can)', 'kann', 'kannst', 'kann', 'können'],
                            ['müssen (must)', 'muss', 'musst', 'muss', 'müssen'],
                            ['wollen (want to)', 'will', 'willst', 'will', 'wollen'],
                            ['möchten (would like)', 'möchte', 'möchtest', 'möchte', 'möchten'],
                            ['dürfen (may)', 'darf', 'darfst', 'darf', 'dürfen'],
                            ['sollen (should)', 'soll', 'sollst', 'soll', 'sollen'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich kann gut Deutsch sprechen.', en: 'I can speak German well.' },
                            { de: 'Du musst jeden Tag üben.', en: 'You must practise every day.' },
                            { de: 'Er möchte Arzt werden.', en: 'He would like to become a doctor.' },
                            { de: 'Wir wollen eine Wohnung mieten.', en: 'We want to rent a flat.' },
                        ],
                    },
                    { kind: 'tip', text: 'Structure: Modal (pos. 2) + … + Infinitive (last). "Ich muss heute arbeiten." — never "Ich muss arbeiten heute."' },
                ],
            },
            {
                id: 'm08-l3',
                title: 'Arbeitsplatz Vokabular',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'das Büro', en: 'the office', ex: 'Ich arbeite im Büro.' },
                            { de: 'die Arbeit', en: 'the work / job', ex: 'Meine Arbeit beginnt um neun.' },
                            { de: 'der Kollege / die Kollegin', en: 'the colleague (m/f)', ex: 'Meine Kollegin ist sehr hilfsbereit.' },
                            { de: 'der Chef / die Chefin', en: 'the boss (m/f)', ex: 'Der Chef ist im Meeting.' },
                            { de: 'in Vollzeit / Teilzeit', en: 'full-time / part-time', ex: 'Ich arbeite in Teilzeit.' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Kurzes Vorstellungsgespräch', lines: [
                            { who: 'Chef', de: 'Was sind Sie von Beruf?', en: 'What is your profession?' },
                            { who: 'Bewerber', de: 'Ich bin Ingenieur. Ich habe fünf Jahre Erfahrung.', en: 'I am an engineer. I have five years of experience.' },
                            { who: 'Chef', de: 'Können Sie gut mit Computern arbeiten?', en: 'Can you work well with computers?' },
                            { who: 'Bewerber', de: 'Ja, natürlich. Ich muss täglich am Computer arbeiten.', en: 'Yes, of course. I must work on the computer daily.' },
                            { who: 'Chef', de: 'Wann können Sie anfangen?', en: 'When can you start?' },
                            { who: 'Bewerber', de: 'Ich kann am ersten Juli anfangen.', en: 'I can start on the first of July.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'cloze', text: 'Ich ___ gut Deutsch sprechen.', en: '(I can speak German well.)', options: ['kann', 'muss', 'will'], answer: 0 },
            { type: 'cloze', text: 'Er ___ jeden Tag arbeiten.', en: '(He must work every day.)', options: ['kann', 'muss', 'darf'], answer: 1 },
            { type: 'mcq', q: 'In a modal sentence, where does the infinitive go?', options: ['position 2', 'after the modal', 'at the end'], answer: 2 },
            { type: 'mcq', q: '"Ich bin Lehrerin." — What gender is the speaker?', options: ['male', 'female', 'unknown'], answer: 1 },
            { type: 'order', tiles: ['Ich', 'muss', 'heute', 'arbeiten'], answer: [0, 1, 2, 3], en: 'I must work today.' },
            { type: 'order', tiles: ['Wann', 'kannst', 'du', 'anfangen'], answer: [0, 1, 2, 3], en: 'When can you start?' },
            { type: 'listen', say: 'Ich möchte Ärztin werden.', q: 'What does the speaker want to become?', options: ['a teacher', 'a doctor', 'an engineer'], answer: 1 },
            { type: 'listen', say: 'Sie arbeitet in Teilzeit, von neun bis dreizehn Uhr.', q: 'What kind of work schedule?', options: ['full-time', 'part-time', 'overtime'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm09',
        order: 9,
        title: 'Freizeit & Hobbys',
        titleEn: 'Leisure & Hobbies',
        canDo: 'Talk about hobbies, say how often you do things, express likes and dislikes, and use basic connectors.',
        lessons: [
            {
                id: 'm09-l1',
                title: 'Hobbys & Freizeitaktivitäten',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'lesen', en: 'to read', ex: 'Ich lese gern Romane.' },
                            { de: 'Sport treiben', en: 'to do sport', ex: 'Sie treibt gern Sport.' },
                            { de: 'schwimmen', en: 'to swim', ex: 'Er schwimmt jeden Morgen.' },
                            { de: 'Rad fahren', en: 'to cycle', ex: 'Wir fahren am Wochenende Rad.' },
                            { de: 'kochen', en: 'to cook', ex: 'Ich koche gern.' },
                            { de: 'Musik hören', en: 'to listen to music', ex: 'Abends höre ich Musik.' },
                            { de: 'ins Kino gehen', en: 'to go to the cinema', ex: 'Wir gehen am Freitag ins Kino.' },
                            { de: 'reisen', en: 'to travel', ex: 'Ich reise sehr gern.' },
                        ],
                    },
                ],
            },
            {
                id: 'm09-l2',
                title: '„gern" und „mögen"',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'Use "gern" after a verb to mean "like doing something". Use "mögen" to say you like a noun.' },
                    {
                        kind: 'table', caption: 'mögen — Präsens', headers: ['Pronoun', 'Form'],
                        rows: [
                            ['ich', 'mag'],
                            ['du', 'magst'],
                            ['er / sie / es', 'mag'],
                            ['wir', 'mögen'],
                            ['ihr', 'mögt'],
                            ['sie / Sie', 'mögen'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich lese gern.', en: 'I like reading. (gern after verb)' },
                            { de: 'Ich mag Musik.', en: 'I like music. (mögen + noun)' },
                            { de: 'Er kocht nicht gern.', en: 'He does not like cooking. (nicht gern = dislike)' },
                        ],
                    },
                ],
            },
            {
                id: 'm09-l3',
                title: 'Häufigkeit & Konjunktionen',
                kind: 'grammar',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'immer', en: 'always', ex: 'Ich lese immer abends.' },
                            { de: 'oft / häufig', en: 'often / frequently', ex: 'Ich gehe oft schwimmen.' },
                            { de: 'manchmal', en: 'sometimes', ex: 'Manchmal koche ich für Freunde.' },
                            { de: 'selten', en: 'rarely', ex: 'Wir gehen selten ins Kino.' },
                            { de: 'nie', en: 'never', ex: 'Ich fahre nie Rad.' },
                            { de: 'einmal pro Woche', en: 'once a week', ex: 'Ich schwimme einmal pro Woche.' },
                        ],
                    },
                    { kind: 'prose', text: 'Coordinating conjunctions (und/aber/oder/denn) link two main clauses without changing word order.' },
                    {
                        kind: 'table', caption: 'Coordinating conjunctions', headers: ['Word', 'Meaning', 'Example'],
                        rows: [
                            ['und', 'and', 'Ich lese und er kocht.'],
                            ['aber', 'but', 'Ich mag Musik, aber ich tanze nicht gern.'],
                            ['oder', 'or', 'Spielst du Tennis oder schwimmst du?'],
                            ['denn', 'because', 'Ich lerne Deutsch, denn ich wohne in Deutschland.'],
                        ],
                    },
                ],
            },
            {
                id: 'm09-l4',
                title: 'Dialog: Freizeit',
                kind: 'dialog',
                blocks: [
                    {
                        kind: 'dialog', title: 'Was machst du in deiner Freizeit?', lines: [
                            { who: 'A', de: 'Was machst du gern in deiner Freizeit?', en: 'What do you like to do in your free time?' },
                            { who: 'B', de: 'Ich lese sehr gern und höre Musik. Und du?', en: 'I really like reading and listening to music. And you?' },
                            { who: 'A', de: 'Ich treibe gern Sport. Ich schwimme zweimal pro Woche.', en: 'I like doing sport. I swim twice a week.' },
                            { who: 'B', de: 'Super! Ich mag Sport nicht so gern, aber ich koche gern.', en: 'Great! I don\'t like sport much, but I like cooking.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'cloze', text: 'Ich lese ___ Romane.', en: '(I like reading novels.)', options: ['gern', 'möchte', 'mag'], answer: 0 },
            { type: 'cloze', text: 'Ich ___ Musik.', en: '(I like music.)', options: ['gern', 'mag', 'häufig'], answer: 1 },
            { type: 'mcq', q: 'Which conjunction means "because"?', options: ['aber', 'oder', 'denn'], answer: 2 },
            { type: 'mcq', q: '"selten" means…', options: ['often', 'rarely', 'never'], answer: 1 },
            { type: 'order', tiles: ['Ich', 'gehe', 'oft', 'schwimmen'], answer: [0, 1, 2, 3], en: 'I often go swimming.' },
            { type: 'order', tiles: ['Ich', 'mag', 'Sport', ',', 'aber', 'ich', 'tanze', 'nicht', 'gern'], answer: [0, 1, 2, 3, 4, 5, 6, 7, 8], en: 'I like sport, but I don\'t like dancing.' },
            { type: 'listen', say: 'Ich lese selten, aber ich höre immer Musik.', q: 'What does the speaker always do?', options: ['reads', 'cooks', 'listens to music'], answer: 2 },
            { type: 'listen', say: 'Wir gehen einmal pro Woche ins Kino.', q: 'How often do they go to the cinema?', options: ['every day', 'once a week', 'twice a month'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm10',
        order: 10,
        title: 'Körper & Gesundheit',
        titleEn: 'Body & Health',
        canDo: 'Name body parts, describe symptoms, understand basic medical advice, and use the imperative.',
        lessons: [
            {
                id: 'm10-l1',
                title: 'Körperteile & Symptome',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'der Kopf', en: 'the head', ex: 'Mein Kopf tut weh.' },
                            { de: 'das Ohr', en: 'the ear', ex: 'Meine Ohren tun weh.' },
                            { de: 'der Hals', en: 'the throat / neck', ex: 'Ich habe Halsschmerzen.' },
                            { de: 'der Bauch', en: 'the stomach / belly', ex: 'Mein Bauch tut weh.' },
                            { de: 'der Rücken', en: 'the back', ex: 'Er hat Rückenschmerzen.' },
                            { de: 'der Arm', en: 'the arm', ex: 'Mein Arm ist gebrochen.' },
                            { de: 'das Bein', en: 'the leg', ex: 'Sie hat ein verletztes Bein.' },
                            { de: 'die Hand', en: 'the hand', ex: 'Wasch deine Hände!' },
                            { de: 'krank', en: 'ill / sick', ex: 'Ich bin krank.' },
                            { de: 'wehtun', en: 'to hurt / ache', ex: 'Mein Kopf tut weh.' },
                            { de: 'das Fieber', en: 'the fever', ex: 'Er hat hohes Fieber.' },
                            { de: 'der Husten', en: 'the cough', ex: 'Ich habe Husten.' },
                            { de: 'die Erkältung', en: 'the cold (illness)', ex: 'Ich habe eine Erkältung.' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Beim Arzt', lines: [
                            { who: 'Arzt', de: 'Was fehlt Ihnen?', en: 'What is the matter with you?' },
                            { who: 'Patient', de: 'Ich habe Halsschmerzen und Fieber seit zwei Tagen.', en: 'I have had a sore throat and fever for two days.' },
                            { who: 'Arzt', de: 'Öffnen Sie bitte den Mund. — Sie haben eine Erkältung.', en: 'Please open your mouth. — You have a cold.' },
                            { who: 'Patient', de: 'Was soll ich tun?', en: 'What should I do?' },
                            { who: 'Arzt', de: 'Trinken Sie viel Wasser und schlafen Sie viel. Nehmen Sie diese Tabletten.', en: 'Drink a lot of water and sleep a lot. Take these tablets.' },
                        ],
                    },
                ],
            },
            {
                id: 'm10-l2',
                title: 'Der Imperativ',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'The imperative gives commands. German has three forms: du (informal sg.), ihr (informal pl.), and Sie (formal).' },
                    {
                        kind: 'table', caption: 'Imperativ forms', headers: ['Pronoun', 'Pattern', 'Example (trinken)'],
                        rows: [
                            ['du', 'verb stem only', 'Trink viel Wasser!'],
                            ['ihr', 'stem + -t', 'Trinkt viel Wasser!'],
                            ['Sie', 'infinitive + Sie', 'Trinken Sie viel Wasser!'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Komm her!', en: 'Come here! (du)' },
                            { de: 'Schreiben Sie Ihren Namen.', en: 'Write your name. (Sie)' },
                            { de: 'Nehmt bitte Platz.', en: 'Please take a seat. (ihr)' },
                        ],
                    },
                    { kind: 'tip', text: 'Irregular verbs with e→i stem change keep it: lesen → Lies!, sprechen → Sprich!' },
                ],
            },
            {
                id: 'm10-l3',
                title: '„sollen" — Ratschläge',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: '„sollen" (should / supposed to) conveys instructions from someone else — doctor, authority, or a third party.' },
                    {
                        kind: 'examples', items: [
                            { de: 'Sie sollen viel trinken.', en: 'You should drink a lot. (doctor\'s advice)' },
                            { de: 'Der Arzt sagt, ich soll drei Tage zu Hause bleiben.', en: 'The doctor says I should stay home for three days.' },
                            { de: 'Er soll mehr schlafen.', en: 'He is supposed to sleep more.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'What does "wehtun" mean?', options: ['to be tired', 'to hurt', 'to cough'], answer: 1 },
            { type: 'cloze', text: 'Ich ___ Halsschmerzen.', en: '(I have a sore throat.)', options: ['bin', 'habe', 'mache'], answer: 1 },
            { type: 'cloze', text: '___ bitte den Mund! (Sie-form)', en: '(Please open your mouth.)', options: ['Öffnet', 'Öffne', 'Öffnen Sie'], answer: 2 },
            { type: 'mcq', q: '"Der Arzt sagt, ich soll…" — sollen expresses…', options: ['ability', 'desire', 'instruction from someone else'], answer: 2 },
            { type: 'order', tiles: ['Was', 'fehlt', 'Ihnen'], answer: [0, 1, 2], en: 'What is the matter with you?' },
            { type: 'listen', say: 'Ich habe Fieber und Husten seit drei Tagen.', q: 'How long has the speaker been ill?', options: ['one day', 'two days', 'three days'], answer: 2 },
            { type: 'listen', say: 'Trinken Sie viel Wasser und schlafen Sie viel.', q: 'What are the two pieces of advice?', options: ['eat and sleep', 'drink and sleep', 'drink and walk'], answer: 1 },
            { type: 'mcq', q: 'du-imperative of "schlafen"?', options: ['Schlafst!', 'Schlaf!', 'Schlafe!'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm11',
        order: 11,
        title: 'Reisen & Verkehr',
        titleEn: 'Travel & Transport',
        canDo: 'Name means of transport, ask for directions, buy a ticket, and form simple sentences in the Perfekt (past).',
        lessons: [
            {
                id: 'm11-l1',
                title: 'Verkehrsmittel & Weg',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'der Zug', en: 'the train', ex: 'Ich fahre mit dem Zug.' },
                            { de: 'das Auto', en: 'the car', ex: 'Er fährt mit dem Auto.' },
                            { de: 'der Bus', en: 'the bus', ex: 'Wir nehmen den Bus.' },
                            { de: 'die U-Bahn', en: 'the underground / metro', ex: 'Die U-Bahn kommt in zwei Minuten.' },
                            { de: 'das Fahrrad', en: 'the bicycle', ex: 'Sie fährt mit dem Fahrrad.' },
                            { de: 'zu Fuß gehen', en: 'to go on foot / walk', ex: 'Ich gehe zu Fuß zur Arbeit.' },
                            { de: 'der Bahnhof', en: 'the train station', ex: 'Der Bahnhof ist in der Nähe.' },
                            { de: 'geradeaus', en: 'straight ahead', ex: 'Gehen Sie geradeaus.' },
                            { de: 'links', en: 'left', ex: 'Biegen Sie links ab.' },
                            { de: 'rechts', en: 'right', ex: 'Die Post ist rechts.' },
                            { de: 'die Kreuzung', en: 'the crossroads', ex: 'An der Kreuzung rechts.' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Nach dem Weg fragen', lines: [
                            { who: 'A', de: 'Entschuldigung, wie komme ich zum Bahnhof?', en: 'Excuse me, how do I get to the station?' },
                            { who: 'B', de: 'Gehen Sie geradeaus bis zur Kreuzung, dann links.', en: 'Go straight ahead to the crossroads, then left.' },
                            { who: 'A', de: 'Ist es weit?', en: 'Is it far?' },
                            { who: 'B', de: 'Nein, circa fünf Minuten zu Fuß.', en: 'No, about five minutes on foot.' },
                        ],
                    },
                ],
            },
            {
                id: 'm11-l2',
                title: 'Das Perfekt — Einführung',
                kind: 'grammar',
                blocks: [
                    { kind: 'prose', text: 'The Perfekt is the most common past tense in spoken German: auxiliary (haben/sein) + Partizip II at the end.' },
                    {
                        kind: 'table', caption: 'Partizip II patterns', headers: ['Type', 'Pattern', 'Example'],
                        rows: [
                            ['regular (weak)', 'ge- + stem + -t', 'machen → gemacht'],
                            ['irregular (strong)', 'ge- + changed stem + -en', 'fahren → gefahren'],
                            ['verbs in -ieren', 'stem + -t (no ge-)', 'studieren → studiert'],
                        ],
                    },
                    {
                        kind: 'examples', items: [
                            { de: 'Ich habe gestern gearbeitet.', en: 'I worked yesterday.' },
                            { de: 'Sie ist nach Berlin gefahren.', en: 'She went / has gone to Berlin.' },
                            { de: 'Er hat Deutsch studiert.', en: 'He studied German.' },
                        ],
                    },
                    { kind: 'tip', text: 'Motion/change-of-state verbs take "sein": fahren, gehen, kommen, fliegen. All others typically take "haben".' },
                ],
            },
            {
                id: 'm11-l3',
                title: 'Fahrkarte kaufen',
                kind: 'dialog',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'die Fahrkarte', en: 'the ticket', ex: 'Eine Fahrkarte nach München, bitte.' },
                            { de: 'einfach / hin und zurück', en: 'one-way / return', ex: 'Einfach oder hin und zurück?' },
                            { de: 'das Gleis', en: 'the platform (track)', ex: 'Der Zug fährt von Gleis 5 ab.' },
                            { de: 'Verspätung haben', en: 'to be delayed', ex: 'Der Zug hat 10 Minuten Verspätung.' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Am Schalter', lines: [
                            { who: 'Reisender', de: 'Eine Fahrkarte nach Frankfurt, bitte.', en: 'A ticket to Frankfurt, please.' },
                            { who: 'Mitarbeiter', de: 'Einfach oder hin und zurück?', en: 'One-way or return?' },
                            { who: 'Reisender', de: 'Einfach. Wann fährt der nächste Zug ab?', en: 'One-way. When does the next train leave?' },
                            { who: 'Mitarbeiter', de: 'Um 14 Uhr 30, von Gleis 3.', en: 'At 14:30, from platform 3.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'What is the Partizip II of "machen"?', options: ['macht', 'gemacht', 'gemacht haben'], answer: 1 },
            { type: 'cloze', text: 'Sie ___ nach Berlin gefahren.', en: '(She went to Berlin.)', options: ['hat', 'ist', 'war'], answer: 1 },
            { type: 'cloze', text: 'Ich ___ gestern gearbeitet.', en: '(I worked yesterday.)', options: ['bin', 'habe', 'hatte'], answer: 1 },
            { type: 'mcq', q: 'Which verb uses "sein" in the Perfekt?', options: ['machen', 'essen', 'fahren'], answer: 2 },
            { type: 'order', tiles: ['Wie', 'komme', 'ich', 'zum', 'Bahnhof'], answer: [0, 1, 2, 3, 4], en: 'How do I get to the station?' },
            { type: 'listen', say: 'Gehen Sie geradeaus und dann links.', q: 'Which direction first?', options: ['right then left', 'straight ahead then left', 'left then right'], answer: 1 },
            { type: 'listen', say: 'Der Zug hat zwanzig Minuten Verspätung.', q: 'How late is the train?', options: ['10 minutes', '20 minutes', '30 minutes'], answer: 1 },
            { type: 'mcq', q: '"studieren" → Partizip II is…', options: ['gestudiert', 'studiert', 'studieren'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm12',
        order: 12,
        title: 'Wetter, Kleidung & Farben',
        titleEn: 'Weather, Clothing & Colours',
        canDo: 'Describe the weather and seasons, name clothing items with colours, and use predicate adjectives.',
        lessons: [
            {
                id: 'm12-l1',
                title: 'Wetter & Jahreszeiten',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'die Sonne scheint', en: 'the sun is shining', ex: 'Heute scheint die Sonne.' },
                            { de: 'es regnet', en: 'it is raining', ex: 'Es regnet den ganzen Tag.' },
                            { de: 'es schneit', en: 'it is snowing', ex: 'Im Januar schneit es oft.' },
                            { de: 'es ist windig', en: 'it is windy', ex: 'Es ist sehr windig heute.' },
                            { de: 'es ist warm / kalt', en: 'it is warm / cold', ex: 'Im Sommer ist es warm.' },
                            { de: 'der Frühling', en: 'spring', ex: 'Im Frühling blühen die Blumen.' },
                            { de: 'der Sommer', en: 'summer', ex: 'Im Sommer fahre ich in den Urlaub.' },
                            { de: 'der Herbst', en: 'autumn', ex: 'Im Herbst fallen die Blätter.' },
                            { de: 'der Winter', en: 'winter', ex: 'Im Winter ist es kalt.' },
                        ],
                    },
                ],
            },
            {
                id: 'm12-l2',
                title: 'Kleidung & Farben',
                kind: 'vocab',
                blocks: [
                    {
                        kind: 'vocab', items: [
                            { de: 'das Hemd', en: 'the shirt', ex: 'Er trägt ein weißes Hemd.' },
                            { de: 'die Hose', en: 'the trousers', ex: 'Ich kaufe eine neue Hose.' },
                            { de: 'das Kleid', en: 'the dress', ex: 'Sie trägt ein rotes Kleid.' },
                            { de: 'die Jacke', en: 'the jacket', ex: 'Zieh die Jacke an! Es ist kalt.' },
                            { de: 'der Mantel', en: 'the coat', ex: 'Im Winter brauche ich einen Mantel.' },
                            { de: 'die Schuhe (pl.)', en: 'the shoes', ex: 'Diese Schuhe sind bequem.' },
                            { de: 'tragen', en: 'to wear / carry', ex: 'Was trägst du heute?' },
                            { de: 'rot', en: 'red', ex: 'Das Auto ist rot.' },
                            { de: 'blau', en: 'blue', ex: 'Der Himmel ist blau.' },
                            { de: 'grün', en: 'green', ex: 'Das Gras ist grün.' },
                            { de: 'gelb', en: 'yellow', ex: 'Die Banane ist gelb.' },
                            { de: 'schwarz', en: 'black', ex: 'Ich trage schwarz.' },
                            { de: 'weiß', en: 'white', ex: 'Der Schnee ist weiß.' },
                        ],
                    },
                    { kind: 'tip', text: 'Predicate adjectives (after sein) have no ending: "Das Kleid ist rot." Attributive adjectives (before noun) inflect: "ein rotes Kleid." A1 only requires predicate.' },
                ],
            },
            {
                id: 'm12-l3',
                title: 'Dialog: Wetter & Kleidung',
                kind: 'dialog',
                blocks: [
                    {
                        kind: 'dialog', title: 'Was ziehst du an?', lines: [
                            { who: 'A', de: 'Wie ist das Wetter heute?', en: 'What is the weather like today?' },
                            { who: 'B', de: 'Es ist kalt und windig. Nur fünf Grad.', en: 'It is cold and windy. Only five degrees.' },
                            { who: 'A', de: 'Dann ziehe ich meinen Mantel an.', en: 'Then I will put on my coat.' },
                            { who: 'B', de: 'Gute Idee. Ich trage auch eine warme Jacke.', en: 'Good idea. I will also wear a warm jacket.' },
                        ],
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'Which season is "der Herbst"?', options: ['spring', 'autumn', 'winter'], answer: 1 },
            { type: 'cloze', text: 'Im Winter ___ es oft.', en: '(In winter it often snows.)', options: ['regnet', 'schneit', 'scheint'], answer: 1 },
            { type: 'mcq', q: 'What colour is "gelb"?', options: ['blue', 'yellow', 'green'], answer: 1 },
            { type: 'cloze', text: 'Das Kleid ___ rot.', en: '(The dress is red.)', options: ['hat', 'ist', 'macht'], answer: 1 },
            { type: 'order', tiles: ['Es', 'ist', 'kalt', 'und', 'windig'], answer: [0, 1, 2, 3, 4], en: 'It is cold and windy.' },
            { type: 'listen', say: 'Heute scheint die Sonne, aber es ist windig.', q: 'What is the weather like?', options: ['rainy and cold', 'sunny but windy', 'snowing'], answer: 1 },
            { type: 'listen', say: 'Sie trägt ein rotes Kleid und schwarze Schuhe.', q: 'What colour is her dress?', options: ['blue', 'black', 'red'], answer: 2 },
            { type: 'mcq', q: '"Die Jacke ist weiß." — The adjective here is used…', options: ['attributively', 'predicatively', 'as a superlative'], answer: 1 },
        ],
    },

    // ───────────────────────────────────────────────────────────────────────
    {
        id: 'm13',
        order: 13,
        title: 'Prüfungstraining A1',
        titleEn: 'A1 Exam Practice',
        canDo: 'Work through all four exam sections (Hören, Lesen, Schreiben, Sprechen) in Start Deutsch 1 format.',
        lessons: [
            {
                id: 'm13-l1',
                title: 'Prüfungsüberblick',
                kind: 'reading',
                blocks: [
                    { kind: 'prose', text: 'The Start Deutsch 1 / Goethe A1 exam has four parts. Understanding the format removes surprises on exam day.' },
                    {
                        kind: 'table', caption: 'Start Deutsch 1 — Exam structure', headers: ['Part', 'Section', 'Time', 'Points'],
                        rows: [
                            ['1', 'Hören (Listening)', '~20 min', '25'],
                            ['2', 'Lesen (Reading)', '~25 min', '25'],
                            ['3', 'Schreiben (Writing)', '~20 min', '25'],
                            ['4', 'Sprechen (Speaking)', '~15 min', '25'],
                        ],
                    },
                    { kind: 'prose', text: 'Pass mark: 60 out of 100. You must score at least 20 per section. All four sections must be passed.' },
                    { kind: 'tip', text: 'In Hören and Lesen, always read the question BEFORE listening or reading the text.' },
                ],
            },
            {
                id: 'm13-l2',
                title: 'Hören — Übung',
                kind: 'listening',
                blocks: [
                    { kind: 'prose', text: 'Listening tasks: short announcements, conversations, phone messages. Listen for key words. Use 🔊 to hear each item.' },
                    {
                        kind: 'dialog', title: 'Hörtext 1: Ansage am Bahnhof', lines: [
                            { who: 'Ansage', de: 'Achtung! Der ICE 593 nach Frankfurt fährt heute mit zwanzig Minuten Verspätung ab. Abfahrt jetzt um 15 Uhr 12, Gleis 7.', en: '(Attention! The ICE 593 to Frankfurt departs today with a 20-minute delay. Departure now at 15:12, platform 7.)' },
                        ],
                    },
                    {
                        kind: 'dialog', title: 'Hörtext 2: Telefonnachricht', lines: [
                            { who: 'Nachricht', de: 'Hallo, hier ist Klaus. Ich rufe wegen unseres Treffens an. Können wir uns statt um 18 Uhr um 19 Uhr treffen? Ruf mich bitte zurück. Tschüss!', en: '(Hello, this is Klaus. I\'m calling about our meeting. Can we meet at 7 pm instead of 6 pm? Please call me back. Bye!)' },
                        ],
                    },
                    { kind: 'tip', text: 'Key strategy: note numbers, times, and names as you listen — these are almost always tested.' },
                ],
            },
            {
                id: 'm13-l3',
                title: 'Lesen — Übung',
                kind: 'reading',
                blocks: [
                    { kind: 'prose', text: 'Reading tasks: short signs, notices, ads, text messages. You do not need to understand every word — focus on the main information.' },
                    {
                        kind: 'examples', items: [
                            { de: 'Anzeige: 2-Zimmer-Wohnung, 60 m², Küche, Bad, Balkon. Miete: 750 € warm. Tel: 0123-456789.', en: '(Ad: 2-room flat, 60 m², kitchen, bathroom, balcony. Rent: €750 all-in.)' },
                            { de: 'SMS: Hallo! Ich komme heute leider eine Stunde später. Der Zug hat Verspätung. — Sara', en: '(Text: Hello! Unfortunately I\'m coming one hour later today. The train is delayed. — Sara)' },
                            { de: 'Schild: Geöffnet: Mo–Fr 09–18 Uhr, Sa 10–14 Uhr. Sonntag geschlossen.', en: '(Sign: Open: Mon–Fri 9am–6pm, Sat 10am–2pm. Sunday closed.)' },
                        ],
                    },
                    { kind: 'tip', text: 'In Lesen part 3 you answer true/false about a short text. Read the statements first, then find the answer in the text.' },
                ],
            },
            {
                id: 'm13-l4',
                title: 'Schreiben — Übung',
                kind: 'writing',
                blocks: [
                    { kind: 'prose', text: 'Writing tasks: fill in a form, or write a short message (30–40 words). Cover all required points — accuracy matters less than coverage.' },
                    {
                        kind: 'model',
                        prompt: 'Write a short message (30–40 words) to a friend. Include: (1) greeting, (2) you are ill today, (3) you cannot come to the meeting, (4) suggest a new time, (5) farewell.',
                        answer: 'Hallo Lisa! Leider bin ich heute krank und kann nicht zu unserem Treffen kommen. Können wir uns am Donnerstag um 18 Uhr treffen? Das wäre toll. Viele Grüße, Raghav.',
                    },
                ],
            },
            {
                id: 'm13-l5',
                title: 'Sprechen — Übung',
                kind: 'speaking',
                blocks: [
                    { kind: 'prose', text: 'Speaking has two parts: (1) introduce yourself using five questions; (2) paired task with topic-card prompts.' },
                    {
                        kind: 'vocab', items: [
                            { de: 'Wie heißen Sie?', en: 'What is your name?', ex: 'Mein Name ist … / Ich heiße …' },
                            { de: 'Woher kommen Sie?', en: 'Where are you from?', ex: 'Ich komme aus …' },
                            { de: 'Wo wohnen Sie?', en: 'Where do you live?', ex: 'Ich wohne in …' },
                            { de: 'Was sind Sie von Beruf?', en: 'What is your profession?', ex: 'Ich bin … / Ich arbeite als …' },
                            { de: 'Welche Sprachen sprechen Sie?', en: 'What languages do you speak?', ex: 'Ich spreche … und ein bisschen Deutsch.' },
                        ],
                    },
                    {
                        kind: 'model',
                        prompt: 'Part 1: Introduce yourself using all 5 questions above. Speak for 2–3 minutes without stopping.',
                        answer: 'Guten Tag! Ich heiße Raghav Tandon. Ich komme aus Indien, aus Delhi. Ich wohne jetzt in Deutschland, in Köln. Ich bin Softwareentwickler und arbeite in einem Technologieunternehmen. Ich spreche Hindi, Englisch und jetzt auch ein bisschen Deutsch.',
                    },
                ],
            },
        ],
        test: [
            { type: 'mcq', q: 'How many points is the Hören section worth?', options: ['20', '25', '30'], answer: 1 },
            { type: 'mcq', q: 'What is the pass mark for the whole exam?', options: ['50/100', '60/100', '70/100'], answer: 1 },
            { type: 'listen', say: 'Der ICE 593 nach Frankfurt fährt von Gleis 7 ab.', q: 'Which platform?', options: ['5', '6', '7'], answer: 2 },
            { type: 'listen', say: 'Können wir uns statt um 18 Uhr um 19 Uhr treffen?', q: 'What new time is suggested?', options: ['17:00', '18:00', '19:00'], answer: 2 },
            { type: 'mcq', q: 'In the Schreiben task, what matters most?', options: ['perfect grammar', 'covering all required points', 'writing more than 50 words'], answer: 1 },
            { type: 'order', tiles: ['Ich', 'bin', 'leider', 'heute', 'krank'], answer: [0, 1, 2, 3, 4], en: 'Unfortunately I am ill today.' },
            { type: 'cloze', text: 'Ich ___ nicht zu unserem Treffen kommen.', en: '(I cannot come to our meeting.)', options: ['kann', 'muss', 'will'], answer: 0 },
            { type: 'mcq', q: 'The sign says "Sonntag geschlossen." What does this mean?', options: ['open all day Sunday', 'closed on Sundays', 'open Sunday mornings only'], answer: 1 },
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
