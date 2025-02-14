process.env.NODE_ENV = 'development';

const { createServer } = require('vite');

const ChildProcess = require('child_process');
const Path = require('path');
const Chalk = require('chalk');
const Chokidar = require('chokidar');
const Electron = require('electron');
const compileTs = require('./private/tsc.js');
const FileSystem = require('fs');
const { EOL } = require('os');

let viteServer = null;
let electronProcess = null;
let electronProcessLocker = false;
let rendererPort = 0;

async function startRenderer() {
    const viteServer = await createServer({
        configFile: Path.join(__dirname, '..', 'vite.config.js'), // Ensure your config file is also renamed to .mjs
        mode: 'development',
    });

    return viteServer.listen();
}

// Function to start the Electron main process
async function startElectron() {
    // Ensure only one instance of Electron is running
    if (electronProcess) {
        return;
    }

    try {
        // Compile TypeScript files before starting Electron
        await compileTs(Path.join(__dirname, '..', 'src', 'main'));
    } catch {
        console.log(Chalk.redBright('Could not start Electron because of the above typescript error(s).'));
        electronProcessLocker = false;
        return;
    }

    const args = [
        Path.join(__dirname, '..', 'build', 'main', 'main.js'),
        rendererPort,
    ];
    electronProcess = ChildProcess.spawn(Electron, args);
    electronProcessLocker = false;

    // Handle stdout data from Electron process
    electronProcess.stdout.on('data', data => {
        if (data == EOL) {
            return;
        }

        process.stdout.write(Chalk.blueBright(`[electron] `) + Chalk.white(data.toString()))
    });

    // Handle stderr data from Electron process and filter out specific error messages
    electronProcess.stderr.on('data', data => {
        const message = data.toString();
        // Suppress specific libva error message
        if (!message.includes('libva error: /usr/lib/x86_64-linux-gnu/dri/iHD_drv_video.so init failed')) {
            process.stderr.write(Chalk.blueBright(`[electron] `) + Chalk.white(message));
        }
    });

    // Handle Electron process exit event
    electronProcess.on('exit', () => stop());
}

// Function to restart the Electron process
function restartElectron() {
    if (electronProcess) {
        electronProcess.removeAllListeners('exit');
        electronProcess.kill();
        electronProcess = null;
    }

    if (!electronProcessLocker) {
        electronProcessLocker = true;
        startElectron();
    }
}

// Function to copy static files needed for the dev server
function copyStaticFiles() {
    copy('static');
}

/*
The working dir of Electron is build/main instead of src/main because of TS.
tsc does not copy static files, so copy them over manually for dev server.
*/
function copy(path) {
    FileSystem.cpSync(
        Path.join(__dirname, '..', 'src', 'main', path),
        Path.join(__dirname, '..', 'build', 'main', path),
        { recursive: true }
    );
}

// Function to stop the Vite server and exit the process
function stop() {
    if (viteServer) {
        viteServer.close();
    }
    process.exit();
}
// Main function to start the development environment
async function start() {
    console.log(`${Chalk.greenBright('=======================================')}`);
    console.log(`${Chalk.greenBright('Starting Electron + Vite Dev Server...')}`);
    console.log(`${Chalk.greenBright('=======================================')}`);

    const devServer = await startRenderer();
    rendererPort = devServer.config.server.port;

    copyStaticFiles();
    startElectron();

    // Watch for changes in the src/main directory to restart Electron
    const path = Path.join(__dirname, '..', 'src', 'main');
    Chokidar.watch(path, {
        cwd: path,
    }).on('change', (path) => {
        console.log(Chalk.blueBright(`[electron] `) + `Change in ${path}. reloading... 🚀`);

        if (path.startsWith(Path.join('static', '/'))) {
            copy(path);
        }

        restartElectron();
    });
}

// Start the development environment
start();
