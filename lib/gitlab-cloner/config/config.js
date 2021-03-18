let config = {
    "gitlabUrlBase": "https://gitlab.com/",
    "method": "ssh",
    "clonePath": "./"
};

function get(field) {
    if (!field) {
        return config;
    }

    return config[field];
}

function set(field, value) {
    config[field] = value;
}

module.exports = {
    get: get,
    set: set
};

