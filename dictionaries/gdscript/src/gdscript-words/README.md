# gdscript-words

Generate GDScript words for use in CSpell dictionary.

## Setup

Run `pip install -r requirements.txt`.

## Usage

Run `./main.py`. This will:

1. clone the `master` branch at the latest commit from Godot repo on GitHub to
   `./godot/`; and
2. parse docs and generate `./gdscript.txt`.
