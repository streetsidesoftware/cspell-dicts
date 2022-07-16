{  version: (.version), dir:  (input_filename | sub("/package.json"; "") ) } | { (.dir): (.version) }
