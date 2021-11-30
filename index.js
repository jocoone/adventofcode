require('dotenv').config();
const inquirer = require('inquirer');
const fs = require('fs');
const { logTime } = require('./utils/util');
const { readLines } = require('./utils/readandwrite');

const TODAY = new Date();
const DEFAULT_YEAR = process.env.YEAR || TODAY.getFullYear();
const DEFAULT_DAY = TODAY.getDate();
const RUN_FAST = process.env.FAST === 'true';

console.log('Hello Advent of Code conquerer! What would you like to run?');

inquirer
  .prompt([
    {
      name: 'year',
      message: 'Which year',
      default: DEFAULT_YEAR,
      when: () => !RUN_FAST,
      validate: (input) => {
        const year = parseInt(input);
        if (isNaN(year) || year < 2021 || year > DEFAULT_YEAR) {
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
        return (
          fs.existsSync(`./challenges/${year}/day${day}.js`) &&
          fs.existsSync(`./input/${year}/aoc${day}.txt`)
        );
      },
    },
  ])
  .then(({ year = DEFAULT_YEAR, day = DEFAULT_DAY }) => {
    const input = readLines(`input/${year}/aoc${day}.txt`);
    const { A, B, parse } = require(`./challenges/${year}/day${day}.js`);
    const parsedInput = logTime('Parse', () => parse(input));
    logTime('A', () => A(parsedInput));
    logTime('B', () => B(parsedInput));
  })
  .catch((reason) => console.log(reason));

/**/
