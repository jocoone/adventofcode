require('dotenv').config();
const inquirer = require('inquirer');
const argv = require('yargs')(process.argv).argv;
const fs = require('fs');
const { logTime } = require('./utils/util');
const { readLines } = require('./utils/readandwrite');

const TODAY = new Date();
const DEFAULT_YEAR = argv.year || process.env.YEAR || TODAY.getFullYear();
const DEFAULT_DAY = argv.day || TODAY.getDate();
const RUN_FAST = process.env.FAST === 'true' || (argv.year && argv.day);

if (!RUN_FAST) {
  console.log('Hello Advent of Code conquerer! What would you like to run?');
}

inquirer
  .prompt([
    {
      name: 'year',
      message: 'Which year',
      default: DEFAULT_YEAR,
      when: () => !RUN_FAST,
      validate: (input) => {
        const year = parseInt(input);
        if (isNaN(year) || year > TODAY.getFullYear()) {
          return false;
        }
        return true;
      },
    },
    {
      name: 'day',
      message: 'Which day',
      default: DEFAULT_DAY,
      when: () => !RUN_FAST,
      validate: (input, { year }) => {
        const day = parseInt(input);
        if (isNaN(day) || day > 25 || day < 1) {
          return false;
        }
        return fs.existsSync(`./challenges/${year}/day${day}.js`);
      },
    },
  ])
  .then(({ year = DEFAULT_YEAR, day = DEFAULT_DAY }) => {
    const input = fs.existsSync(`./input/${year}/aoc${day}.txt`)
      ? readLines(`input/${year}/aoc${day}.txt`)
      : [];
    const { A, B, parse } = require(`./challenges/${year}/day${day}.js`);
    const parsedInput = logTime('Parse', () => parse(input));
    const answerA = logTime('A', () => A(parsedInput));
    logTime('B', () => B(parsedInput, answerA));
  })
  .catch((reason) => console.log(reason));

/**/
