'use strict';
const gitlabAPIService = require('./gitlab-api/gitlab-api-service')
const prompter = require('./prompter/cloner-prompter')
const cloner = require('./cloner/gitclone')
const shell = require('shelljs');

let config = {
    "gitlabUrlBase": "https://gitlab.com/",
    "method": "ssh",
    "clonePath": "./"
};

function getProjectsInGroup() {
    return new Promise((resolve) => {
        gitlabAPIService.getProjectsInGroup(config).then((res) => {
            const projectsInGroup = [];
            res.data.forEach((gitlabProject) => {
                projectsInGroup.push({
                    name: gitlabProject["name"],
                    fullPath: gitlabProject["path_with_namespace"],
                    ssh: gitlabProject["ssh_url_to_repo"],
                    http: gitlabProject["http_url_to_repo"]
                })
            });

            resolve(projectsInGroup);
        }).catch((error) => {
            console.log("An error occurred when trying to get group information:");
            console.log(error);
            if (error.response && error.response.statusText) {
                console.log(error.response.statusText);
            }
            shell.exit(1);
        })
    })
}
function getRootGroupInfo() {
    return new Promise((resolve) => {
        gitlabAPIService.getGroupInfo(config).then((res) => {
            const rootGroupInfo = {
                name: res.data["name"],
                path: res.data["path"],
                fullPath: res.data["full_path"]
            };

            resolve(rootGroupInfo);
        }).catch((gitlabResponseError) => {
            console.log("An error occurred when trying to get group information:");
            console.log(gitlabResponseError.response.statusText);
            shell.exit(1);
        })
    })
}


function cloneProjects(projectsInGroup) {
    getRootGroupInfo().then((rootGroupInfo) => {
        projectsInGroup.forEach((project) => {
            cloner.cloneProject(project, rootGroupInfo.path, config);
        })
    })
}

function getInputData() {
    return new Promise((resolve) => {
        prompter.performQuestions().then((answers) => {
            config["groupId"] = answers.groupId;
            config["token"] = answers.token;
            config["method"] = answers.method;
            config["clonePath"] = answers.clonePath;
            config["gitlabUrlBase"] = answers.gitlabUrlBase;

            resolve(answers);
        }).catch((userDataReaderError) => {
            console.log("Error getting inputs from user");
            console.log(userDataReaderError);
            shell.exit(1);
        })
    });
}

function main() {
    getInputData().then(getProjectsInGroup).then(cloneProjects);
}

module.exports = {
    cloneGroup: main
};
