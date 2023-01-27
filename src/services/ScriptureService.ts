/**
 * ScriptureService.ts - Handles getting Scripture text
 */

/** Verse contents and metadata from bible-api.com */
export type BibleApiVerseContent = {
    /** book short name index */
    book_id: string;
    /** book long name */
    book_name: string;
    /** chapter number */
    chapter: number;
    /** verse number */
    verse: number;
    /** Scripture text at this verse */
    text: string;
};

/** Scripture contents and metadata from bible-api.com */
export type BibleApiScriptureContent = {
    /** Scripture reference as a string */
    reference: string;
    /** verse contents */
    verses: BibleApiVerseContent[];
    /** Concatenated Scripture text at each verse in the range */
    text: string;
    /** Translation shortName */
    translation_id: string;
    /** Translation long name */
    translation_name: string;
    /** Translation license */
    translation_note: string;
};

/** Example query from https://bible-api.com/romans+12:1-2 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bibleApiScriptureContentExample: BibleApiScriptureContent = {
    reference: 'Romans 12:1-2',
    verses: [
        {
            book_id: 'ROM',
            book_name: 'Romans',
            chapter: 12,
            verse: 1,
            text: 'Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service.\n',
        },
        {
            book_id: 'ROM',
            book_name: 'Romans',
            chapter: 12,
            verse: 2,
            text: 'Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.\n',
        },
    ],
    text: 'Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service.\nDon’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.\n',
    translation_id: 'web',
    translation_name: 'World English Bible',
    translation_note: 'Public Domain',
};
