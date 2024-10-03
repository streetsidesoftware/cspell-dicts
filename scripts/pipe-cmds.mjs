import shell from 'shelljs';

const usage = `\
Usage: pipe-cmds <commands>

Example:
    pipe-cmds "ls -l" "grep \\"mjs\\"" "wc -l"

    pipe-cmds "ls -l"  "cat"
`;

if (process.argv.length < 3 || process.argv[2] === '--help' || process.argv[2] === '-h') {
    console.log(usage);
    process.exit(0);
}

const commands = process.argv.slice(2);

let current = shell.exec(commands.shift(), { silent: true });
let exitCode = current.code;

for (let i = 0; i < commands.length && !exitCode; i++) {
    const cmd = commands[i];
    current = current.exec(cmd, { silent: true });
    if (current.code !== 0) {
        exitCode = current.code;
        break;
    }
}

const stdout = `${current.stdout}`.trim();
const stderr = `${current.stderr}`.trim();

stdout && console.log('%s', stdout);
stderr && console.error('%s', stderr);
process.exit(exitCode);
