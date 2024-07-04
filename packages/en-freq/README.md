# English Word Frequency Library

This is a dictionary / library of English word frequency compiled from Google N-Gram data.

The Raw data can be found at `./dict/en-freq.tsv`.

This Library contains a few things:

1.  The Raw TSV Data in the form `word freq`:
    | Word | Freq |
    | ---- | ----- |
    | the | 24190 |
    | of | 13420 |
    | and | 11110 |
    | to | 9598 |
    | in | 7920 |
    | a | 7714 |

    Frequency is the probable occurrence per 1 million words. For example, for every 1,000,000 words, it is expected for the word `and` to occur around 11,110 times.

1.  A Library to read and query the Frequency.
1.  The tool to download and build the frequency data.

At this moment, this package is internal only. It would need more cleaning up before it can be published.
