const shell = require('shelljs');
const fs = require("fs");
const path = require("path");
const config = require('../config/config')

function getProjectFolderPath(projectFullPath) {
    const groupRootPath = config.get("groupInfo")["path"];
    const relativeProjectFolder = projectFullPath.substr(projectFullPath.indexOf(groupRootPath));
    const projectAbsolutePath = path.resolve(config.get("workingDir"), relativeProjectFolder);

    return projectAbsolutePath;
}

function createProjectFolder(projectAbsolutePath) {
    if (!fs.existsSync(projectAbsolutePath)){
        shell.mkdir('-p', projectAbsolutePath);
    }
}

function gitclone(projectData, projectAbsolutePath) {
    const projectURL = projectData[config.get("method")];
    const gitDirectory = path.resolve(projectAbsolutePath, ".git");

    if (!fs.existsSync(gitDirectory)) {
        shell.exec(`git clone ${projectURL} ${projectAbsolutePath}`);
    } else {
        shell.exec(`cd ${projectAbsolutePath} && git pull`);
    }
}

function cloneProject(project) {
    return new Promise((resolve) => {
        const projectFolder = getProjectFolderPath(project["fullPath"]);
        createProjectFolder(projectFolder);
        gitclone(project, projectFolder);

        resolve();
    });
}

module.exports = {
    cloneProject: cloneProject
};
