#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories to ignore
const IGNORE_DIRS = new Set(['node_modules', 'assets', 'build', 'documents', 'test', 'dist']);

// Files to ignore
const IGNORE_FILES = new Set(['package-lock.json', '.env']);

// File extensions to include
const FILE_EXTENSIONS = new Set(['.js', '.ts', '.vue', '.html', '.css', '.json']);

/**
 * Recursively gather all files matching desired extensions,
 * ignoring specified directories and skipping specific files.
 */
function gatherFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        // 1) Check if it's a directory we should ignore
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.has(entry)) {
                gatherFiles(fullPath, fileList);
            }
        } else {
            // 2) Skip files you don't want
            if (IGNORE_FILES.has(entry)) {
                continue;
            }
            // 3) Only push if the extension matches
            if (FILE_EXTENSIONS.has(path.extname(entry))) {
                fileList.push(fullPath);
            }
        }
    }

    return fileList;
}

function main() {
    // Gather files
    const files = gatherFiles('.');

    // Sort them so macOS and Linux have the same order
    files.sort();

    // Overwrite or remove the old flat-vue-app.md if it exists
    fs.writeFileSync('flat-app.md', '', 'utf8');

    // Append each file’s content, stripping leading whitespace
    for (const file of files) {
        const content = fs
            .readFileSync(file, 'utf8')
            .replace(/^[ \t]+/gm, '');
        fs.appendFileSync('flat-app.md', `\n## ${file}\n\n${content}`, 'utf8');
    }

    console.log('All files have been flattened into flat-app.md, ignoring specified directories and files.');
}

main();