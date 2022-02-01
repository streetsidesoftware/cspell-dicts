# cspell:ignore globalenv
writeLines(ls(parent.env(globalenv())), file("../src/r.txt", "wt"))
