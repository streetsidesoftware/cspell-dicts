def languageId: (.languageSettings? // [] | map(.languageId // "*") | join("<br>")) | gsub("[,]"; ", ") ;

def locale: (.languageSettings? // [] | map(.locale // .local // "*") | join("<br>")) | gsub("[,]"; ", ") ;

def dicts: (.dictionaryDefinitions? // [] | map(.name) | join("<br>")) | gsub("[,]"; ", ") ;

"| \(dicts) | \(.name) | \(.description)" | gsub("[*]"; "\\*")

# cspell:ignore gsub
