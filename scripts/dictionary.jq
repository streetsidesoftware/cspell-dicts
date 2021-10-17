def languageId: (.languageSettings? // [] | map(.languageId // "*") | join("; ")) | gsub("[,]"; ", ") ;

def locale: (.languageSettings? // [] | map(.locale // .local // "*") | join("; ")) | gsub("[,]"; ", ") ;

"| \(.name) | \(languageId) | \(locale) | \(.description)" | gsub("[*]"; "\\*")

# cspell:ignore gsub
