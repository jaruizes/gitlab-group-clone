const shell = require('shelljs');
const fs = require("fs");
const path = require("path");
const config = require('../config/config')

function getProjectFolderPath(projectFullPath) {
    const groupRootPath = config.get("groupInfo")["path"];
    const relativeProjectFolder = projectFullPath.substr(projectFullPath.indexOf(groupRootPath));
    const projectAbsolutePath = path.resolve(config.get("workingDir"), relativeProjectFolder);

    console.log(`\t - Project folder: ${projectAbsolutePath}`);
    return projectAbsolutePath;
}

function createProjectFolder(projectAbsolutePath) {
    if (!fs.existsSync(projectAbsolutePath)){
        console.log(`\t - Project folder doesn't exist. Creating.....`)
        shell.mkdir('-p', projectAbsolutePath);
    }
}

function gitclone(projectData, projectAbsolutePath) {
    const projectURL = projectData[config.get("method")];
    const gitDirectory = path.resolve(projectAbsolutePath, ".git");

    if (!fs.existsSync(gitDirectory)) {
        console.log(`\t - Clonning project from ${projectURL}.....`);
        shell.exec(`git clone ${projectURL} ${projectAbsolutePath}`);
    } else {
        console.log(`\t - .git folder found in [${projectAbsolutePath}]. Pulling instead of cloning.....`);
        shell.exec(`cd ${projectAbsolutePath} && git pull`);
    }
}

function cloneProject(project) {
    console.log(`[${project.name}] Clonning project.....`);
    const projectFolder = getProjectFolderPath(project["fullPath"]);
    createProjectFolder(projectFolder);
    gitclone(project, projectFolder);
    console.log(`[${project.name}] Project cloned.....\n\n`);
}

module.exports = {
    cloneProject: cloneProject
};
