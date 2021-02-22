const shell = require('shelljs');
const fs = require("fs");
const path = require("path");

function getProjectPhysicalPath(groupRootPath, projectFullPath) {
    return projectFullPath.substr(projectFullPath.indexOf(groupRootPath));
}

function createProjectFolder(clonePath, projectPath) {
    const projectFolderPath = path.resolve(clonePath, projectPath);
    if (!fs.existsSync(projectFolderPath)){
        shell.mkdir('-p', projectFolderPath);
    }
}

function gitclone(projectData, projectPhysicalPath, method) {
    const projectURL = projectData[method];
    const gitDirectory = path.resolve(projectPhysicalPath, ".git");
    if (!fs.existsSync(gitDirectory)) {
        shell.exec(`git clone ${projectURL} ${projectPhysicalPath}`);
    } else {
        console.log(projectData["name"] + " already exists and it's a git folder. Executing pull instead of clone....");
        shell.exec(`cd ${projectPhysicalPath} && git pull`);
    }


}

function cloneProject(project, groupRootPath, options) {
    const projectPhysicalPath = getProjectPhysicalPath(groupRootPath, project["fullPath"]);
    createProjectFolder(options.clonePath, projectPhysicalPath);
    gitclone(project, projectPhysicalPath, options.method);
}

module.exports = {
    cloneProject: cloneProject
};
