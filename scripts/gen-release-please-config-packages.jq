{  version: (.version), dir:  (input_filename | sub("/package.json"; "") | sub("[.][/]"; "")), component: (.name) } |
{

    (.dir): {
        component: (.component),
        releaseType: "node"
    }
}
