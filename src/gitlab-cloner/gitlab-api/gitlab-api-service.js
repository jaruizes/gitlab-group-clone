const axios = require('axios');

function getGroupInfo(options) {
    const url = `/groups/${options.groupId}`;
    return callToGitlabAPI(url, options);
}

function getProjectsInGroup(options) {
    const url = `/groups/${options.groupId}/projects?include_subgroups=True&per_page=100`;
    return callToGitlabAPI(url, options);
}

function callToGitlabAPI(url, options) {
    const operationCompleteURL = options.gitlabUrlBase + "/api/v4" + url;
    const headers = {
        "PRIVATE-TOKEN": options.token
    }
    return axios.get(operationCompleteURL, {headers});
}

module.exports = {
    getProjectsInGroup: getProjectsInGroup,
    getGroupInfo: getGroupInfo
};
