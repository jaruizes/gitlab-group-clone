const inquirer = require('inquirer');

const questions = [
    {
        type: "input",
        message: "What is the Gitlab's url base?",
        name: "gitlabUrlBase"
    },
    {
        type: "input",
        message: "What is the group id to cloner?",
        name: "groupId",
        validate: (groupId) => {
            if (!groupId || !Number.parseInt(groupId)) {
                return 'GroupId is required and it must be an integer'
            }
            return true;
        }
    },
    {
        type: "input",
        message: "Where do you want to clone group's projects?",
        name: "clonePath",
        default: "./"
    },
    {
        type: "password",
        message: "Please, introduce token with API grants",
        name: "token",
        validate: (token) => {
            if (!token) {
                return 'A token (personal / group) is required to call Gitlab API'
            }
            return true;
        }
    },
    {
        type: "list",
        message: "Choose method to clone repos",
        name: "method",
        choices: [
            {
                name: "SSH",
                value: "ssh"
            },
            {
                name: "HTTP",
                value: "http"
            }
        ]
    }
];

function performQuestions() {
    return inquirer.prompt(questions);

}

module.exports = {
    performQuestions: performQuestions
};
