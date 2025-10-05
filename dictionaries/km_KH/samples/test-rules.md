# Test Samples for km.aff Rules

This file contains test samples for all the rules defined in km.aff to verify they work correctly.

## REP Rules (Replacements)

### REP 1: "្ត" to "្ដ"
- ស្តេច → ស្ដេច (alternative spelling)
- ម្តេច → ម្ដេច (alternative spelling)
<!---
cspell:ignore ស្តេច ម្តេច
-->

### REP 2: Double invisible space to single invisible space
- Test​​word → Test​word (removing double zero-width space U+200B)

## PFX T - Prefix rule for "ទី" (place/location marker)

Base words with /T flag will accept the "ទី" prefix:

- កន្លែង → ទីកន្លែង (place)
- ប្រឹក្សា → ទីប្រឹក្សា (advisory office)
- បញ្ជាការ → ទីបញ្ជាការ (headquarters)
- រហោស្ថាន → ទីរហោស្ថាន (location)
- វាល → ទីវាល (field/location)
- ផ្សារ → ទីផ្សារ (market place)
- ក្រុង → ទីក្រុង (city)

## PFX G - Prefix rule for "ការ" (action/nominalization prefix)
<!---
cspell:ignore nominalization
-->

Base words with /G flag will accept the "ការ" prefix to nominalize verbs:
<!---
cspell:ignore nominalize
-->

- ស្លាប់ → ការស្លាប់ (death, the act of dying)
- ធ្វើ → ការធ្វើ (doing, the act of doing)
- រៀន → ការរៀន (studying, the act of studying)
- សរសេរ → ការសរសេរ (writing, the act of writing)
- អាន → ការអាន (reading, the act of reading)
- និយាយ → ការនិយាយ (speaking, the act of speaking)
- ដើរ → ការដើរ (walking, the act of walking)
- រត់ → ការរត់ (running, the act of running)

## SFX K - Suffix rule for "ការណ៍" (report/statement suffix)

Base words with /K flag will accept the "ការណ៍" suffix:

- ផ្លូវ → ផ្លូវការណ៍ (official report)
- របាយ → របាយការណ៍ (report)
- ថ្លែង → ថ្លែងការណ៍ (statement/declaration)

## Combined Rules Test

Words with multiple flags can use multiple affixes:

Example: If a verb has both /G and /T flags:
- Base word → ការ+word (using G)
- Base word → ទី+word (using T)

Note: Test these combinations with actual flagged words in km.dic
