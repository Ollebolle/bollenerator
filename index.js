#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');

const choices = fs.readdirSync(`${__dirname}/templates`);

const questions = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'Which template would you like to generate?',
    choices: choices
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];

const current_directory = process.cwd();

inquirer.prompt(questions)
  .then(answers => {
    const projectChoice = answers['project-choice'];
    const projectName = answers['project-name'];
    const templatePath = `${__dirname}/templates/${projectChoice}`;

    fs.mkdirSync(`${current_directory}/${projectName}`);

    createDirectoryContents(templatePath, projectName);
  });

const createDirectoryContents = (templatePath, newProjectPath) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');

      const writePath = `${current_directory}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${current_directory}/${newProjectPath}/${file}`);

      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}
