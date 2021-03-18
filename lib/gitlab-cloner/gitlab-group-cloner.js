'use strict';
const config = require('./config/config')
const gitlabAPIService = require('./gitlab-api/gitlab-api-service')
const prompter = require('./prompter/cloner-prompter')
const cloner = require('./cloner/gitclone')
const shell = require('shelljs');

/**
 * Gets the list of the projects within the root groups and its subgroups
 * @returns {Promise<>}
 */
function getProjectsInGroup() {
    return new Promise((resolve) => {
        gitlabAPIService.getProjectsInGroup().then((res) => {
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

/**
 * Clones (or pulls) project from Gitlab group
 * @param projectsInGroup
 * @returns {Promise<unknown>}
 */
function cloneProjects(projectsInGroup) {
    return new Promise((resolve, reject) => {
        projectsInGroup.forEach((project) => {
            cloner.cloneProject(project);
        })
    });
}

/**
 * Gets input data from user
 * @returns {Promise<>}
 */
function getInputData() {
    return new Promise((resolve) => {
        prompter.performQuestions().then((answers) => {
            resolve(answers);
        }).catch((userDataReaderError) => {
            console.log("Error getting inputs from user");
            console.log(userDataReaderError);
            shell.exit(1);
        })
    });
}

/**
 * Initializes config object
 * @param inpuData
 * @returns {Promise<>}
 */
function initConfig(inpuData) {

    /**
     * Gets information about the root group
     * @returns {Promise<>}
     */
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

    return new Promise((resolve, reject) => {
        config.set("groupId", inpuData.groupId);
        config.set("token", inpuData.token);
        config.set("method", inpuData.method);
        config.set("workingDir", inpuData.workingDir);
        config.set("gitlabUrlBase", inpuData.gitlabUrlBase);

        getRootGroupInfo().then((rootGroupInfo) => {
            config.set("groupInfo", rootGroupInfo);
            resolve();
        }).catch((error) => {
            reject(error);
        });
    })

}

/**
 * Main function
 */
function main() {
    getInputData()
        .then(initConfig)
        .then(getProjectsInGroup)
        .then(cloneProjects);
}

module.exports = {
    clone: main
};
