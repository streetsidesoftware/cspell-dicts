out_file <- file("../src/r.txt", "wt")
defaultPackages <- getOption("defaultPackages")

for (package in defaultPackages) {
    writeLines(
        ls(as.environment(paste("package", package, sep = ":"))),
        out_file
    )
}
writeLines(ls(baseenv()), out_file)
close(out_file)
