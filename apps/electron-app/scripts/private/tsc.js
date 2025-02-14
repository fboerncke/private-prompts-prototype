const ChildProcess = require('child_process');
const Chalk = require('chalk');

// This function compiles TypeScript files in a given directory
function compile(directory) {
  return new Promise((resolve, reject) => {
    // Create a new child process to run the TypeScript compiler (tsc)

    //const tscProcess = ChildProcess.exec('tsc -p tsconfig.json', {
    const tscProcess = ChildProcess.exec('tsc ', {
      cwd: directory,
    });

    // When data is available on the stdout stream, print it to the console with a custom formatting
    tscProcess.stdout.on('data', data =>
      process.stdout.write(Chalk.yellowBright(`[tsc] `) + Chalk.white(data.toString()))
    );

    // When the child process exits, determine if it was successful or if there were errors
    tscProcess.on('exit', exitCode => {
      if (exitCode > 0) {
        reject(exitCode);
      } else {
        resolve();
      }
    });
  });
}

// Export the compile function so it can be used elsewhere in the code
module.exports = compile;

