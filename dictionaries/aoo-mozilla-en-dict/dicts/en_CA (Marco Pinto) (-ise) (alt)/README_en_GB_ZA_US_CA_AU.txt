README – English Hunspell Dictionaries  
Maintained by Marco A.G.Pinto  


FREE SOFTWARE  
=============  
These spellcheckers are free software — free to use, share, and modify.  

They are intended for a broad audience, including students, professionals,  
writers, and non-native speakers.  

Feedback is welcome to help keep these dictionaries accurate and reliable.  


DICTIONARY MAINTENANCE  
======================  
Marco maintains six main English variants:  
  • en_GB (British, “ise”), since 25.Aug.2013  
  • en_GB-oxendict (Oxford English Dictionary, “ize”), since 1.Mar.2025  
  • en_ZA (South African, “ise”), since 01.Jan.2025  
  • en_US (American, “ize”), since 01.Jan.2026 (alternative version)  
  • en_CA (Canadian, “ise”), since 01.Jan.2026 (alternative version)  
  • en_AU (Australian, “ise”), since 01.Jan.2026 (alternative version)  

Notes:  
  • Both “-ise” and “-ize” forms are provided; some variants may still have  
    missing or misplaced forms.  
  • en_ZA and en_GB are maintained in parallel, with the GB dictionary having  
    been merged into the ZA dictionary while retaining regional terms.  
  • en_US, en_CA, and en_AU are converted from en_GB using Proofing Tool GUI,  
    then refined for regional vocabulary.  

en_ZA uses the same base list as en_GB, originally from the Aspell English  
wordlists (LGPL).  

Marco began maintaining en_GB and en_ZA after previous maintainers became  
unavailable, and later began work on alternative en_US, en_CA, and en_AU  
dictionaries alongside existing upstream versions.  

The en_GB dictionary began as a subset of Kevin Atkinson's wordlist for  
Pspell/Aspell (LGPL) and has been expanded by David Bartlett, Brian Kelk,  
Andrew Brown, and Marco A.G.Pinto, including:  
  • Removal of Americanisms in en_GB  
  • Addition of missing words  
  • Correction of errors  
  • Addition of compound hyphenated forms  
  • Thousands of proper/place names  
  • Thousands of possessives and plurals  
  • Removal of duplicates  
  • Support for ordinals and affixes (e.g., 1st, 111th, 1990s)  


CONTRIBUTORS  
============  
Many people have provided valuable input over the years — too numerous to list  
individually. Special thanks to:  

  • Cyberknight – Submitted numerous scientific terms in the early days and  
    helped create a legacy British Dictionary for Mozilla when modern  
    WebExtensions were not yet widely supported.  
    Although no longer in contact, his contributions remain a valued part  
    of the project's history.  

  • Babelfish (Peter C.) – Regularly contributed words and offered practical  
    suggestions that significantly refined and updated the dictionary.  

  • Peter C. (not Babelfish) – Advocated consistently for an “-ise” British  
    Dictionary, resulting in the inclusion of many such entries and ensuring  
    alignment with modern linguistic standards.  

These wordlists aim to represent modern English for the Commonwealth and  
North America.  

The .AFF file was originally created by David Bartlett and Andrew Brown based  
on MySpell rules (LGPL), focusing on accurate morphology, not file compression.  
Marco has refined the rules since 2013.  


MARCO A.G.PINTO  
===============  
Marco forked the British dictionary in 2013 after years without updates,  
choosing Mozilla's unobfuscated version.  

Spelling is verified using:  
  • Oxford Dictionaries  
  • Collins Dictionary  
  • Cambridge Dictionary  
  • Merriam-Webster Dictionary  
  • Wiktionary (used with caution ⚠)  
  • Wikipedia (used with caution ⚠)  
  • Physical dictionaries  

Main challenges:  
  • Proper names  
  • Possessives  
  • Plurals  


HUNSPELL ENGINE  
===============  
The Hunspell engine was developed by Németh László, an open-source tool used for  
spellchecking and morphological analysis.  

It is capable of handling complex word forms, affixes, and spelling rules with  
efficiency.  

Hunspell has become the standard engine for many major software projects, and  
Németh László's work continues to support and enhance modern language tools.  


TABOO/OFFENSIVE WORDS  
=====================  
A NOSUGGEST flag is applied to certain taboo or offensive words to prevent them  
from being suggested in spellchecking results.  

While every effort has been made to mark the most offensive terms, it is not  
guaranteed that all possible taboo words are flagged.  

Some words have intentionally been left unflagged because, although considered  
taboo in some dictionaries, they are not generally regarded as swear words in  
modern usage.  


CONTACT  
=======  
Marco A.G.Pinto  
  • E-mail: marcoagpinto@sapo.pt  
  • Website: https://proofingtoolgui.org  
  • FAQ: https://proofingtoolgui.org/faq.html  
  • Changelog: https://proofingtoolgui.org/en_GB_CHANGES.txt  
  • GitHub: https://github.com/marcoagpinto/aoo-mozilla-en-dict  


CHANGELOG (2025+)  
=================  
2026-02-01 (Marco A.G.Pinto)
           - Flag enhancements, mainly for U.S. words.
           - Major fixes and improvements to the US, CA, and AU dictionaries.
           - Added an OED (Oxford English Dictionary) dictionary to the LibreOffice extension.

2026-01-01 (Marco A.G.Pinto)
           - Marco began maintaining alternative versions of the US, CA, and AU dictionaries.
           - Merged the GB dictionary into the ZA dictionary.
           - Aligned all six dictionaries to the GB versioning format for consistency.
           - Removed numerous Americanisms from the GB dictionary.
           - The hyph US and GB files now use UTF-8-BOM Unix (LF).
           - The thesaurus now uses UTF-8-BOM Unix (LF).
           - Improved images for extensions.

----------

2025-03-02 to 2025-12-31 (Marco A.G.Pinto)
           - Better -ise/-ize handling.
           - Fixed, improved, and added flags for U.S. compatibility on 1-JAN-2026.

2025-03-01 (Marco A.G.Pinto)
           - New extension icons for Mozilla (GB) in 96×96 and for LibreOffice/OpenOffice
             in 128×128 pixels.
           - The default GB and ZA spelling is now -ise.
           - Unified the GB and ZA .AFF file.
           - Merged hundreds of thousands of proper names from GB to ZA.
           - Fixed/improved: flag “O” and “W”.

2025-01-01 (Marco A.G.Pinto)
           - Official fork of ZA Dictionary.


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
