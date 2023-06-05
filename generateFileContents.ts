import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
program.version('0.0.1');

program
  .option('-d, --directory <path>', 'Directory path')
  .option('-o, --output <file>', 'Output file', 'output.txt')
  .option('-i, --ignore <extensions>', 'File extensions to ignore', '');

program.parse(process.argv);

const options = program.opts();

if (!options.directory) {
  console.log('No directory given!');
  process.exit(1);
}

// Resolve directory and output paths relative to the script's location
const directoryPath = path.join(__dirname, options.directory);
const outputPath = path.join(__dirname, options.output);

const walkDirectory = (dir: string, callback: (err: NodeJS.ErrnoException | null, results?: string[]) => void) => {
  let results: string[] = [];

  fs.readdir(dir, (err, list) => {
    if (err) return callback(err);

    let pending = list.length;
    if (!pending) return callback(null, results);

    list.forEach(file => {
      file = path.resolve(dir, file);

      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walkDirectory(file, (err, res) => {
            results = results.concat(res || []);
            if (!--pending) callback(null, results);
          });
        } else {
          if (shouldIgnoreFile(file)) {
            if (!--pending) callback(null, results);
            return;
          }

          results.push(file);
          if (!--pending) callback(null, results);
        }
      });
    });
  });
};

const shouldIgnoreFile = (file: string): boolean => {
  const extensions = options.ignore.split(',');
  const fileExtension = path.extname(file).toLowerCase();
  return extensions.includes(fileExtension);
};

walkDirectory(directoryPath, (err, results) => {
  if (err) throw err;

  // Ensure the directory for the output file exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const writeStream = fs.createWriteStream(outputPath);

  results?.forEach((file) => {
    const data = fs.readFileSync(file);
    writeStream.write(`\nFile: ${file}\n\n`);
    writeStream.write(data);
    writeStream.write('\n\n====================\n\n');
  });

  writeStream.end();
});
