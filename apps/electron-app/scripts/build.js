/**
 * This script is used while building and packaging the electron app.
 */

const Path = require('path');
const Chalk = require('chalk');
const { rmSync } = require('fs');
const { build } = require('vite');
const compileTs = require('./private/tsc.js');

// Function to build the renderer process using Vite
function buildRenderer() {
    return build({
        configFile: Path.join(__dirname, '..', 'vite.config.js'), // Path to Vite config file
        base: './', // Base public path
        mode: 'production' // Production mode for optimized build
    });
}

// Function to build the main process using TypeScript compiler
function buildMain() {
    const mainPath = Path.join(__dirname, '..', 'src', 'main'); // Path to main process source files
    return compileTs(mainPath); // Compile TypeScript files
}

// Remove the existing build folder to ensure a clean build
rmSync(Path.join(__dirname, '..', 'build'), {
    recursive: true, // Remove directories and their contents recursively
    force: true, // Ignore errors if the folder does not exist
})

// Log the start of the transpilation process
console.log(Chalk.blueBright('Transpiling renderer & main...'));

// Wait for both the renderer and main processes to be transpiled
Promise.allSettled([
    buildRenderer(), // Transpile the renderer process
    buildMain(), // Transpile the main process
]).then((results) => {
    results.forEach((result) => {
        if (result.status === 'rejected') {
            console.error(Chalk.redBright('Error in build process:'), result.reason); // Log any errors
            process.exit(1);  // Exit the process with an error code if there is a failure
        }
    });
    console.log(Chalk.greenBright('Build process completed! (ready to be built with electron-builder)')); // Log successful completion
});
