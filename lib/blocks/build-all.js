// build-all.js
const { readdirSync, existsSync } = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');

const filter = process.argv[2]; // optional: block name or prefix

const blocks = readdirSync(__dirname, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(__dirname, d.name, 'src')))
    .map((d) => d.name)
    .filter((name) => !filter || name.startsWith(filter));

if (blocks.length === 0) {
    console.error(filter ? `No blocks match "${filter}"` : 'No blocks found');
    process.exit(1);
}

for (const block of blocks) {
    console.log(`\n→ Building ${block}`);
    execSync(
        `npx wp-scripts build --webpack-src-dir=${block}/src --output-path=${block}/build`,
        { stdio: 'inherit', cwd: __dirname }
    );
}