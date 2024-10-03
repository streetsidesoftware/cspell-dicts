{  version: (.version), dir:  (input_filename | sub("/package.json"; "") | sub("[.][/]"; "") ) } | { (.dir): (.version) }
