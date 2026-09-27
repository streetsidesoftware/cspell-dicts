{
    "bootstrap-sha": "57747d12b18819775592694ea936eb9e4ce875b6",
    "include-v-in-tag": false,
    "tag-separator": "@",
    "plugins": [
        {
            "type": "node-workspace",
            "always-link-local": true,
            "updatePeerDependencies": true
        }
    ],
    "changelog-sections": [
        { type: "feat", "section": "Features", "hidden": false },
        { type: "feature", "section": "Features" },
        { type: "fix", "section": "Updates and Bug Fixes", "hidden": false },
        { type: "perf", "section": "Performance Improvements", "hidden": true },
        { type: "ci", "section": "Continuous Integration", "hidden": true },
        { type: "chore", "section": "Miscellaneous", "hidden": true },
        { type: "revert", "section": "Reverts" },
        { type: "docs", "section": "Documentation", "hidden": true },
        { type: "style", "section": "Styles", "hidden": true },
        { type: "refactor", "section": "Code Refactoring", "hidden": true },
        { type: "test", "section": "Tests", "hidden": true },
        { type: "build", "section": "Build System", "hidden": true },
        { type: "", "section": "Changes", "hidden": false }
    ],
    packages: .,
}
