## List of English Medical Terms

### Overview

This is a simple list of English medical terms formatted as a UTF8-encoded text file. It is based on two prominent medical dictionary projects:

 - [OpenMedSpel](http://www.e-medtools.com/openmedspel.html) by e-MedTools
 - [Raj&Co-Med-Spel-Chek by Rajasekharan N. of Raj&Co](http://rajn.co/free-medical-spell-checker-for-microsoft-word-custom-dictionary/)
 
The two sources have been merged, deduplicated, corrected and formatted as a text file that should be compatible with Android dictionary managers, LibreOffice, and Word.

### Details

    Terms:              98119
    Contents:           drug names (up-to-date with FDA-approvals as of 2014-04-02, trade and generic names),
                        anatomical terms, dermatological terms, internal medicine terms, surgical terms,
                        DSM-IV terms, ICD-9 terms, and many more
    Author:             (c) 2014-2017 Aristotelis P. (https://github.com/Glutanimate)
    Original Authors:   (c) 2007-2014 R. Robinson <info@e-medtools.com>, 
                        (c) 2009-2014 Rajasekharan N. <https://plus.google.com/u/0/+Rajasekharan-N/>
    Original Sources:   - OpenMedSpel by R. Robinson of e-MedTools (Version 2.0.0, released 2014-01-21)
                          <http://www.e-medtools.com/openmedspel.html>
                        - MTH-Med-Spel-Chek by Rajasekharan N. of MT-Herald (released 2014-04-02)
                          <http://mtherald.com/free-medical-spell-checker-for-microsoft-word-custom-dictionary/>
    License:            GNU GPL v3 (see LICENSEs for more information)

### Usage

**Android**

Copy `wordlist.txt` to the root directory of your Android phone. Then install the excellent [User Dictionary Manager](https://play.google.com/store/apps/details?id=com.usr.dict.mgr) by Adrian Vintu and use it to import the terms to your user dictionary. More information may be found [here](http://udm.adrianvintu.com/). Note: Because of the size of the wordlist importing might take a (very long) while.

**LibreOffice**

*Easier method*

If you are on Linux check out [hunspell-en-med-glut](https://github.com/Glutanimate/hunspell-en-med-glut) for a ready-made Hunspell dictionary that can be installed system-wide.

*Manual installation*

Follow the instructions provided in [this Q&A](http://ask.libreoffice.org/en/question/11170/create-basic-english-dictionary/?answer=11187#post-id-11187) to create a new custom dictionary. Make sure to name it in a recongizable fashion (e.g. medicalterms-en) and activate it in the menu. 

[Find out where your LO user profile is located](https://wiki.documentfoundation.org/UserProfile#User_profile_location). Then proceed to navigate to `<LO user profile directory>\3\user\wordbook` and find your dictionary (e.g. medicalterms-en.dic). Open it in a text editor of your choice (e.g. Gedit on Ubuntu; Notepad++ on Windows, NOT Notepad!). Copy and paste the full contents of `wordlist.txt` below the dashed line (`---`). Save the file while making sure it remains UTF-8 encoded and restart LibreOffice.

**Word**

Rename `wordlist.txt` to `medicalterms-en.dic` and follow the instructions provided [here](http://support.microsoft.com/kb/322198).


### Warranty

This software comes with no warranty of any kind. Some misspelled words might be included. Please make sure to submit a bug report if you find any mistakes.
