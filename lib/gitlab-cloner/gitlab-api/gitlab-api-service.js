const axios = require('axios');
const config = require('../config/config');

function getGroupInfo() {
    const url = `/groups/${config.get("groupId")}`;
    return callToGitlabAPI(url);
}

function getProjectsInGroup() {
    const url = `/groups/${config.get("groupId")}/projects?include_subgroups=True&per_page=100`;
    return callToGitlabAPI(url);
}

function callToGitlabAPI(url) {
    const operationCompleteURL = config.get("gitlabUrlBase") + "/api/v4" + url;
    const headers = {
        "PRIVATE-TOKEN": config.get("token")
    }
    return axios.get(operationCompleteURL, {headers});
}

module.exports = {
    getProjectsInGroup: getProjectsInGroup,
    getGroupInfo: getGroupInfo
};
