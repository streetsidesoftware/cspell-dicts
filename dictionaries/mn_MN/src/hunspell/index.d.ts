export default dictionary;
/**
 * Hunspell dictionary.
 */
export type Dictionary = {
    /**
     *   Data for the affix file (defines the language, keyboard, flags, and more).
     */
    aff: Uint8Array;
    /**
     *   Data for the dictionary file (contains words and flags applying to those words).
     */
    dic: Uint8Array;
};
/** @type {Dictionary} */
declare const dictionary: Dictionary;
//# sourceMappingURL=index.d.ts.map