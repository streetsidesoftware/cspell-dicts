# Računalna provjera pravopisa hrvatskoga jezika Hunspellom

Rječnik za računalnu provjeru pravopisa hrvatskoga jezika skup je riječi i pravila koja se koriste za računalnu provjeru pravopisa programom Husnpell. Za uspješnu su provjeru pravopisa iz cijeloga ovoga repozitorija potrebne samo datoteke `hr_HR.dic` i `hr_HR.aff`, sve ostalo su usputni sadržaji.

Pravila se primjenjuju na svaku riječ zasebno, odnosno Hunspell ne može koristiti ova pravila za provjeru ispravnoga korištenja riječi u kontekstu ili provjeru gramatike. Rječnik i pravila razvijaju se neovisno Hunspellu te ovo nije službeni ili središnji rječnik. Tako nešto ne postoji ni za koji jezik. Ovaj se rječnik koristi za računalnu provjeru pravopisa u projektima kao što su Mozilla (Firefox, Thunderbird) te LibreOffice.

---

Sadržaj repozitorija

- `hr_HR.dic` sadrži popis riječi
- `hr_HR.aff` sadrži pravila za razradu svih oblika riječi iz datoteke `hr_HR.dic`
- `README_hr_HR.txt` sadrži informacije o licenciji
- u `izmjene-u-rječniku.md` se prate o izmjenama u svakoj novoj inačici
- `README.md` je opis ovoga projekta
- mapa `tools/dpl` sadrži skriptu kojom sam pokušao automatski napraviti izraditi pravila prema ručno sastavljenome popisu riječi. Daleko je to od upotrebljivoga, a ako se nešto po tome pitanju i bude događalo, događat će se unutar [`hunspell-hr/tools/`](https://github.com/krunose/hunspell-hr/tree/master/tools) isključujući mapu `dpl`
- datoteka `wordlist` sadrži popis riječi koje rječnik može generirati datotekama `hr_HR.dic` i `hr_HR.aff`. Popis je generiran skriptom [`dictman.php`](https://github.com/krunose/hunspell-hr/tree/master/tools) i ograničenja skripte v. u skripti u uvodnome komentaru.

---

Dokumentacija o Hunspellu

- [Pisanje pravila](https://sourceforge.net/projects/hunspell/files/Hunspell/Documentation/hunspell4.pdf/download) (izravna poveznica, engl., PDF)
- [hunspell.github.io](http://hunspell.github.io/)

---

Repozitorij i kontakt: [https://github.com/krunose/hunspell-hr](https://github.com/krunose/hunspell-hr)

---

Zadnja izmjena: 2.1-20191020
