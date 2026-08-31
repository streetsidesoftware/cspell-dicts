
# Hunspell-TH: Thai Dictionary for Hunspell

[![CI](https://github.com/SyafiqHadzir/Hunspell-TH/actions/workflows/ci.yml/badge.svg)](https://github.com/SyafiqHadzir/Hunspell-TH/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/hunspell-th?logo=npm)](https://www.npmjs.com/package/hunspell-th)
[![GitHub Release](https://img.shields.io/github/v/release/SyafiqHadzir/Hunspell-TH?logo=github)](https://github.com/SyafiqHadzir/Hunspell-TH/releases)
[![License](https://img.shields.io/github/license/SyafiqHadzir/Hunspell-TH)](LICENSE)

A high-quality Thai (`th_TH`) dictionary extension for Hunspell, optimized for accuracy and performance. This project aims to provide a unified and expertly maintained wordlist for Thai spell-checking applications.

<p align="center">
  <img src="assets/royinthai.jpg" alt="Hunspell-TH Logo" height="200" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</p>

## 🚀 Features

*   **Unified Wordlist**: Combines data from multiple reliable sources into a single, comprehensive `th_TH.dic`.
*   **Expert Optimization**: Implements best-practice `TRY` (frequency-based) and `KEY` (layout-based) directives in `th_TH.aff` for superior suggestion quality.
*   **Standardized**: Fully compatible with Hunspell-based applications (LibreOffice, Firefox, macOS, etc.) and follows strict UTF-8 encoding.
*   **Data-Driven**: sorting and frequency analysis based on actual usage patterns.

## 📦 Installation

You can use the `.dic` and `.aff` files directly in any Hunspell-compatible application.

### Manual Installation
1.  Download `th_TH.dic` and `th_TH.aff` from this repository.
2.  Place them in your system's spelling directory:
    *   **macOS**: `~/Library/Spelling/` or `/Library/Spelling/`
    *   **Linux**: `/usr/share/hunspell/`
    *   **Windows**: varies by application (e.g., `%APPDATA%\OpenOffice\4\user\wordbook`)

### NPM (Node.js)
If you are developing a Node.js application, you can install this package directly (future support):
```bash
npm install hunspell-th
```

## 🛠 Usage

### Command Line (Hunspell)
```bash
hunspell -d ./th_TH -i utf-8 file_to_check.txt
```

### Node.js (with nspell)
```javascript
import nspell from 'nspell';
import fs from 'fs';

const affix = fs.readFileSync('th_TH.aff');
const dictionary = fs.readFileSync('th_TH.dic');

const spell = nspell(affix, dictionary);

console.log(spell.correct('สวัสดี')); // true
console.log(spell.suggest('สวัดดี')); // ['สวัสดี', ...]
```

## 📚 Data Sources & Acknowledgements

This dictionary is curated from the following respected sources:
*   **The Royal Institute of Thailand (ORST)**: [dictionary.orst.go.th](http://dictionary.orst.go.th/)
*   **NECTEC LEXiTRON**: [lexitron.nectec.or.th](http://lexitron.nectec.or.th)
*   **Phra Brahmagunabhorn**: [payutto.org](http://www.payutto.org)

## 🤝 Contributing

Contributions are welcome! If you find missing words or incorrect spellings, please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AddWords`).
3.  Commit your changes (`git commit -m 'Add new words'`).
4.  Push to the branch (`git push origin feature/AddWords`).
5.  Open a Pull Request.

## 📄 License

Distributed under the **General Public License v3.0 (GPLv3)**. See `LICENSE` for more information.

## 📞 Contact

**Syafiq Hadzir**
*   Website: [syafiqhadzir.dev](https://syafiqhadzir.dev)
*   GitHub: [SyafiqHadzir](https://github.com/SyafiqHadzir)
