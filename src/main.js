#!/usr/bin/env node
'use strict';
const figlet = require('figlet');
const gitlabCloner = require('./gitlab-cloner/gitlab-cloner')
const inquirer = require('inquirer');

const options = [
    {
        type: "list",
        message: "What do you want to do?",
        name: "option",
        choices: [
            {
                name: "Clone Gitlab group",
                value: "clone"
            }
        ]
    }
];

function perfomCloneOption() {
    gitlabCloner.cloneGroup();
}

function main() {
    console.log(figlet.textSync('Gitlab   groups   tool'));
    if (options.length > 1) {
        inquirer.prompt(options).then((answers) => {
            if (answers.option === "clone") {
                return perfomCloneOption();
            }
        });
    } else {
        perfomCloneOption();
    }
}
main();
