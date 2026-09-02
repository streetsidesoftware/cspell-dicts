README – English Hunspell Dictionaries  
Maintained by Marco A.G.Pinto  
Licence information is provided at the end of this file.  


FREE SOFTWARE  
=============  
These spellcheckers are free software — free to use, share, modify, and  
redistribute under the terms of their respective licences.  

They are intended for a broad audience, including students, professionals,  
writers, developers, educators, and non-native speakers.  

The dictionaries cover several major English varieties and are maintained to  
provide accurate, reliable, and accessible spelling support across different  
countries and communities.  

Feedback, corrections, and contributions are welcome and help keep these  
dictionaries accurate, comprehensive, and up to date.  


ETHICS AND PRINCIPLES  
=====================  
Language is a shared human good. It should remain open and accessible to  
everyone, regardless of race, religion, gender, age, country, income,  
profession, or academic background.  

Marco's goal is to make these English dictionaries accurate, inclusive, and  
freely available to all users. Everyone should have equal access to words and  
spelling tools, whether they are the owner of a multinational company or the  
person sweeping the street.  

The project is maintained in the belief that language belongs to humankind as  
a whole and serves learning, communication, dignity, and opportunity. For this  
reason, the dictionaries are regularly updated and made available across  
several English variants so that anyone can use English with confidence.  

Marco lives a simple and modest life and has chosen not to monetise this work,  
allowing everyone to benefit from it freely. However, anyone who forks these  
dictionaries or uses them in another project is asked to credit this project  
in a visible place.  

The dictionaries are the result of many years of maintenance, correction,  
expansion, and careful review. They should not be presented as someone else's  
work after only a small number of words have been added or removed.  


DICTIONARY MAINTENANCE  
======================  
Marco maintains six main English dictionary variants:  
  • en_GB (British, “-ise”), since 25 Aug 2013  
  • en_GB-oxendict (British, Oxford “-ize” spelling), since 1 Mar 2025  
  • en_ZA (South African, “-ise”), since 1 Jan 2025  
  • en_US (American, “-ize”), since 1 Jan 2026 (alternative version)  
  • en_CA (Canadian, mixed “-ise”/“-ize”), since 1 Jan 2026 (alternative version)  
  • en_AU (Australian, “-ise”), since 1 Jan 2026 (alternative version)  

Notes:  
  • The project supports both “-ise” and “-ize” spelling conventions across  
    its different dictionary variants. Coverage is continually reviewed and  
    refined to ensure that words are assigned to the appropriate regional  
    dictionaries.  
  • en_GB and en_ZA are maintained in parallel. The South African dictionary  
    uses the British dictionary as its base while retaining and expanding  
    vocabulary specific to South African English.  
  • Before each release, en_US, en_CA, and en_AU are automatically converted  
    from en_GB using Proofing Tool GUI. The tool applies hundreds of conversion  
    rules and variant-specific wordlists to adapt spelling, vocabulary, and  
    morphology for each regional dictionary.  

    Whenever possible, inflected and derived forms are replaced with their  
    corresponding lemmas and Hunspell affix flags. Using lemmas makes it easier  
    to convert words accurately between English variants, reduces the number of  
    entries in the .DIC files, and makes the dictionaries simpler to inspect,  
    analyse, and maintain.  

    The converted files are then reviewed and refined where necessary.  

The en_ZA dictionary uses the same base wordlist as en_GB, which originated  
from the Aspell English wordlists distributed under the LGPL.  

Marco began maintaining en_GB after its previous maintenance had ceased. He  
later took over the maintenance of en_ZA and began developing alternative  
en_US, en_CA, and en_AU dictionaries alongside the existing upstream  
versions.  

The en_GB dictionary began as a subset of Kevin Atkinson's Pspell/Aspell  
wordlist, distributed under the LGPL. It was subsequently expanded and  
improved by David Bartlett, Brian Kelk, Andrew Brown, and Marco A.G.Pinto.  

The work has included:  
  • Removal of Americanisms from en_GB and en_ZA  
  • Removal of Britishisms from en_US  
  • Addition of missing words  
  • Correction of spelling and morphological errors  
  • Addition of hyphenated compounds  
  • Addition of thousands of proper names and place names  
  • Addition of thousands of plural and possessive forms  
  • Removal of duplicate entries  
  • Replacement of inflected and derived entries with lemmas and affix flags  
  • Support for ordinals and other affixed forms, such as 1st, 111th, and 1990s  


CANADIAN ENGLISH AND THE -ISE/-IZE QUESTION  
===========================================  
Canadian English is one of the most difficult varieties of English to support  
because it combines features of both British and American English.  

To better reflect contemporary Canadian usage and respond to user feedback,  
the Canadian dictionary adopts a mixed approach, combining selected British  
and American forms where appropriate.  

The dictionary accepts both “-ise” and “-ize” verb forms, includes commonly  
used American medical and scientific terms, and reflects the mixed  
British/American character of contemporary Canadian English.  

The goal is to reduce unnecessary spelling warnings while supporting the  
widest possible range of Canadian users.  


CONTRIBUTORS  
============  
Many people have provided valuable feedback, word submissions, corrections,  
and practical suggestions over the years — too many to list individually.  

Special thanks are due to:  
  • Cyberknight – Submitted numerous scientific terms during the project's  
    early years and helped create a legacy British dictionary extension for  
    older versions of Mozilla applications. Although Marco is no longer in  
    contact with him, his contributions remain a valued part of the project's  
    history.  

  • Babelfish (Peter C.) – Regularly contributed words and provided practical  
    suggestions that helped refine, correct, and expand the dictionary.  

  • Peter C. (not Babelfish) – Consistently advocated for a British dictionary  
    using “-ise” spelling. His feedback contributed to the adoption and  
    expansion of “-ise” forms in the default British dictionary.  

These wordlists aim to provide broad and reliable coverage of contemporary  
English across the Commonwealth and North America while preserving appropriate  
regional spelling and vocabulary.  

The original .AFF file was created by David Bartlett and Andrew Brown using  
MySpell rules and was distributed under the LGPL. Its purpose was to provide  
accurate morphological and affix handling rather than to minimise file size.  
Marco has continued to revise and expand the affix rules since 2013.  


MARCO A.G.PINTO  
===============  
Marco began maintaining the British dictionary in 2013 after it had gone for  
several years without an active release. He based his work on Mozilla's  
unobfuscated dictionary files, which made the wordlist and affix rules easier  
to inspect, maintain, and improve.  

Since then, he has corrected and expanded the dictionaries, refined their  
affix rules, added regional vocabulary, and developed tools to help maintain  
and convert the different English variants.  

Spelling and usage are checked against a range of reference sources,  
including:  
  • Oxford Dictionaries  
  • Collins Dictionary  
  • Cambridge Dictionary  
  • Merriam-Webster Dictionary  
  • Wiktionary, used with caution  
  • Wikipedia, used with caution  
  • Printed dictionaries and other physical reference works  

Some of the most demanding areas of dictionary maintenance include:  
  • Proper names and place names  
  • Possessive forms  
  • Plural forms  
  • Regional vocabulary and spelling differences  
  • Derived and inflected forms  
  • Hyphenated compounds  


HUNSPELL ENGINE  
===============  
Hunspell is an open-source spellchecking and morphological analysis engine  
developed by Németh László.  

It is designed to handle complex word forms, affixes, compound words, and  
language-specific spelling rules efficiently.  

Hunspell is widely used by major software projects and applications. Németh  
László's work has made a significant and lasting contribution to modern  
spellchecking and language-processing tools.  


TABOO AND OFFENSIVE WORDS  
=========================  
A NOSUGGEST flag is applied to certain taboo or offensive words to prevent them  
from appearing in spelling suggestions.  

Every effort has been made to identify and flag the most offensive terms.  
However, the list may not include every potentially offensive or taboo word.  

Some words have intentionally been left unflagged because, although classified  
as taboo by certain dictionaries, they are not generally regarded as swear  
words or inherently offensive in contemporary usage. Their acceptability may  
also depend on context, region, and intended meaning.  


CONTACT AND PROJECT LINKS  
=========================  
Marco A.G.Pinto  
  • E-mail: marcoagpinto@sapo.pt  
  • Project website: https://proofingtoolgui.org  
  • FAQ: https://proofingtoolgui.org/faq.html  
  • Changelog: https://proofingtoolgui.org/en_GB_CHANGES.txt  
  • GitHub repository: https://github.com/marcoagpinto/aoo-mozilla-en-dict  
  • Personal article: https://marcoagpinto.com  


CHANGELOG (2025+)  
=================  
2026-09-01 (Marco A.G.Pinto)  
           - Removed additional Britishisms from the US dictionary.  
           - Corrected the handling of “improvise” and “improvize”;  
             “improvize” is not a valid spelling.  
           - Enhanced flags, mainly for US English words.  
           - Added flag “á” for adjectival forms ending in “-like”.  
           - Added flag “é” for irregular plural forms.  
           - Improved the hyphenation dictionaries.  
           - Rewrote and expanded most of the README file.  

2026-07-01 (Marco A.G.Pinto)  
           - Made major updates to the Canadian and US dictionaries.  
           - Removed numerous Americanisms from the GB dictionary.  
           - Removed numerous Britishisms from the US dictionary.  
           - Added MAXNGRAMSUGS 7 to keep spelling suggestions more  
             focused and reduce noise.  
           - Switched to FLAG UTF-8 after running out of available flags.  
           - Added flag “í” for US English “-ist”, “-ist's”, and  
             “-ists” forms derived from single-L words.  
           - Added the apostrophe to WORDCHARS to recognise words such  
             as “'gainst”.  
           - Added the REP entry “teh” → “the”.  
           - Added possessive forms for most nouns ending in “-ness”.  
           - Added numerous derived forms, including plurals and  
             possessives.  

2026-05-01 (Marco A.G.Pinto)  
           - Enhanced flags, mainly for US English words.  

2026-03-07 (Marco A.G.Pinto)  
           - Released a critical update to correct an issue in the US  
             dictionary caused by Proofing Tool GUI automatically  
             removing prefixes from lemmas included in the removal list.  

2026-03-01 (Marco A.G.Pinto)  
           - Enhanced flags, mainly for US English words.  
           - Made major fixes and improvements to the US dictionary.  

2026-02-01 (Marco A.G.Pinto)  
           - Enhanced flags, mainly for US English words.  
           - Made major fixes and improvements to the US, CA, and AU  
             dictionaries.  
           - Added a British Oxford spelling dictionary to the  
             LibreOffice extension.  

2026-01-01 (Marco A.G.Pinto)  
           - Began maintaining alternative versions of the US, CA, and  
             AU dictionaries.  
           - Merged the GB dictionary into the ZA dictionary.  
           - Aligned all six dictionaries with the GB versioning format  
             for consistency.  
           - Removed numerous Americanisms from the GB dictionary.  
           - Converted the US and GB hyphenation files to UTF-8 with a  
             byte order mark and Unix line endings.  
           - Converted the thesaurus files to UTF-8 with a byte order  
             mark and Unix line endings.  
           - Improved the extension artwork.  

----------------

2025-03-02 to 2025-12-31 (Marco A.G.Pinto)  
           - Improved the handling of “-ise” and “-ize” forms.  
           - Corrected, improved, and added flags in preparation for  
             US English compatibility on 1 January 2026.  

2025-03-01 (Marco A.G.Pinto)  
           - Added new 96×96 extension icons for Mozilla GB and new  
             128×128 icons for LibreOffice and OpenOffice.  
-            Changed the default GB and ZA spelling convention to “-ise”.  
           - Unified the GB and ZA .AFF files.  
           - Merged hundreds of thousands of proper names from GB into ZA.  
           - Corrected and improved flags “O” and “W”.  

2025-01-01 (Marco A.G.Pinto)  
           - Created the official fork of the ZA dictionary.  


LGPL3 LICENSE  
=============  

                   GNU LESSER GENERAL PUBLIC LICENSE  
                       Version 3, 29 June 2007  

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>  
 Everyone is permitted to copy and distribute verbatim copies  
 of this license document, but changing it is not allowed.  


  This version of the GNU Lesser General Public License incorporates  
the terms and conditions of version 3 of the GNU General Public  
License, supplemented by the additional permissions listed below.  

  0. Additional Definitions.  

  As used herein, "this License" refers to version 3 of the GNU Lesser  
General Public License, and the "GNU GPL" refers to version 3 of the GNU  
General Public License.  

  "The Library" refers to a covered work governed by this License,  
other than an Application or a Combined Work as defined below.  

  An "Application" is any work that makes use of an interface provided  
by the Library, but which is not otherwise based on the Library.  
Defining a subclass of a class defined by the Library is deemed a mode  
of using an interface provided by the Library.  

  A "Combined Work" is a work produced by combining or linking an  
Application with the Library.  The particular version of the Library  
with which the Combined Work was made is also called the "Linked  
Version".  

  The "Minimal Corresponding Source" for a Combined Work means the  
Corresponding Source for the Combined Work, excluding any source code  
for portions of the Combined Work that, considered in isolation, are  
based on the Application, and not on the Linked Version.  

  The "Corresponding Application Code" for a Combined Work means the  
object code and/or source code for the Application, including any data  
and utility programs needed for reproducing the Combined Work from the  
Application, but excluding the System Libraries of the Combined Work.  

  1. Exception to Section 3 of the GNU GPL.  

  You may convey a covered work under sections 3 and 4 of this License  
without being bound by section 3 of the GNU GPL.  

  2. Conveying Modified Versions.  

  If you modify a copy of the Library, and, in your modifications, a  
facility refers to a function or data to be supplied by an Application  
that uses the facility (other than as an argument passed when the  
facility is invoked), then you may convey a copy of the modified  
version:  

   a) under this License, provided that you make a good faith effort to  
   ensure that, in the event an Application does not supply the  
   function or data, the facility still operates, and performs  
   whatever part of its purpose remains meaningful, or  

   b) under the GNU GPL, with none of the additional permissions of  
   this License applicable to that copy.  

  3. Object Code Incorporating Material from Library Header Files.  

  The object code form of an Application may incorporate material from  
a header file that is part of the Library.  You may convey such object  
code under terms of your choice, provided that, if the incorporated  
material is not limited to numerical parameters, data structure  
layouts and accessors, or small macros, inline functions and templates  
(ten or fewer lines in length), you do both of the following:  

   a) Give prominent notice with each copy of the object code that the  
   Library is used in it and that the Library and its use are  
   covered by this License.  

   b) Accompany the object code with a copy of the GNU GPL and this license  
   document.  

  4. Combined Works.  

  You may convey a Combined Work under terms of your choice that,  
taken together, effectively do not restrict modification of the  
portions of the Library contained in the Combined Work and reverse  
engineering for debugging such modifications, if you also do each of  
the following:  

   a) Give prominent notice with each copy of the Combined Work that  
   the Library is used in it and that the Library and its use are  
   covered by this License.  

   b) Accompany the Combined Work with a copy of the GNU GPL and this license  
   document.  

   c) For a Combined Work that displays copyright notices during  
   execution, include the copyright notice for the Library among  
   these notices, as well as a reference directing the user to the  
   copies of the GNU GPL and this license document.  

   d) Do one of the following:  

       0) Convey the Minimal Corresponding Source under the terms of this  
       License, and the Corresponding Application Code in a form  
       suitable for, and under terms that permit, the user to  
       recombine or relink the Application with a modified version of  
       the Linked Version to produce a modified Combined Work, in the  
       manner specified by section 6 of the GNU GPL for conveying  
       Corresponding Source.  

       1) Use a suitable shared library mechanism for linking with the  
       Library.  A suitable mechanism is one that (a) uses at run time  
       a copy of the Library already present on the user's computer  
       system, and (b) will operate properly with a modified version  
       of the Library that is interface-compatible with the Linked  
       Version.  

   e) Provide Installation Information, but only if you would otherwise  
   be required to provide such information under section 6 of the  
   GNU GPL, and only to the extent that such information is  
   necessary to install and execute a modified version of the  
   Combined Work produced by recombining or relinking the  
   Application with a modified version of the Linked Version. (If  
   you use option 4d0, the Installation Information must accompany  
   the Minimal Corresponding Source and Corresponding Application  
   Code. If you use option 4d1, you must provide the Installation  
   Information in the manner specified by section 6 of the GNU GPL  
   for conveying Corresponding Source.)  

  5. Combined Libraries.  

  You may place library facilities that are a work based on the  
Library side by side in a single library together with other library  
facilities that are not Applications and are not covered by this  
License, and convey such a combined library under terms of your  
choice, if you do both of the following:  

   a) Accompany the combined library with a copy of the same work based  
   on the Library, uncombined with any other library facilities,  
   conveyed under the terms of this License.  

   b) Give prominent notice with the combined library that part of it  
   is a work based on the Library, and explaining where to find the  
   accompanying uncombined form of the same work.  

  6. Revised Versions of the GNU Lesser General Public License.  

  The Free Software Foundation may publish revised and/or new versions  
of the GNU Lesser General Public License from time to time. Such new  
versions will be similar in spirit to the present version, but may  
differ in detail to address new problems or concerns.  

  Each version is given a distinguishing version number. If the  
Library as you received it specifies that a certain numbered version  
of the GNU Lesser General Public License "or any later version"  
applies to it, you have the option of following the terms and  
conditions either of that published version or of any later version  
published by the Free Software Foundation. If the Library as you  
received it does not specify a version number of the GNU Lesser  
General Public License, you may choose any version of the GNU Lesser  
General Public License ever published by the Free Software Foundation.  

  If the Library as you received it specifies that a proxy can decide  
whether future versions of the GNU Lesser General Public License shall  
apply, that proxy's public statement of acceptance of any version is  
permanent authorization for you to choose that version for the  
Library.  


WORDNET LICENSE (THESAURUS FOR OPENOFFICE/LIBREOFFICE)  
======================================================  
WordNet Release 2.1

This software and database is being provided to you, the LICENSEE, by  
Princeton University under the following license.  By obtaining, using  
and/or copying this software and database, you agree that you have  
read, understood, and will comply with these terms and conditions.:  
  
Permission to use, copy, modify and distribute this software and  
database and its documentation for any purpose and without fee or  
royalty is hereby granted, provided that you agree to comply with  
the following copyright notice and statements, including the disclaimer,  
and that the same appear on ALL copies of the software, database and  
documentation, including modifications that you make for internal  
use or for distribution.  
  
WordNet 2.1 Copyright 2005 by Princeton University.  All rights reserved.  
  
THIS SOFTWARE AND DATABASE IS PROVIDED "AS IS" AND PRINCETON  
UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR  
IMPLIED.  BY WAY OF EXAMPLE, BUT NOT LIMITATION, PRINCETON  
UNIVERSITY MAKES NO REPRESENTATIONS OR WARRANTIES OF MERCHANT-  
ABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE  
OF THE LICENSED SOFTWARE, DATABASE OR DOCUMENTATION WILL NOT  
INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS, TRADEMARKS OR  
OTHER RIGHTS.  
  
The name of Princeton University or Princeton may not be used in  
advertising or publicity pertaining to distribution of the software  
and/or database.  Title to copyright in this software, database and  
any associated documentation shall at all times remain with  
Princeton University and LICENSEE agrees to preserve same.  
