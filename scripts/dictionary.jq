def languageId: (.languageSettings? // [] | map(.languageId // "*") | join("; ")) | gsub("[,]"; ", ") ;

def locale: (.languageSettings? // [] | map(.locale // .local // "*") | join("; ")) | gsub("[,]"; ", ") ;

def dicts: (.dictionaryDefinitions? // [] | map(.name) | join("; ")) | gsub("[,]"; ", ") ;

"| \(dicts) | \(.name) | \(.description)" | gsub("[*]"; "\\*")

# cspell:ignore gsub
