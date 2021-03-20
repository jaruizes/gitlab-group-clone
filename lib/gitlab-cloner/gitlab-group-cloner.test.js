import gitlabcloner from './gitlab-group-cloner';
import inquirer from 'inquirer';
import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';

jest.mock('inquirer');
const tmpFolder = path.join(__dirname, '..', '..', 'tmp');
let gitlabApiToken;
const goodGroup = 11074786;
const wrongGroup = 1;

beforeAll(() => {
    if (!process.env.GITLAB_API_TOKEN) {
        console.log('Gitlab Token not initialized');
        process.exit(1);
    }

    gitlabApiToken = process.env.GITLAB_API_TOKEN
});


test('Given a correct data and HTTP method, when requests to clone a group, then the group is cloned', () => {
    createTmpFolder();

    inquirer.prompt = jest.fn().mockResolvedValue({
        gitlabUrlBase: 'https://gitlab.com',
        groupId: goodGroup,
        workingDir: './tmp/',
        token: gitlabApiToken,
        method: 'http'
    });

    return gitlabcloner.clone().then(() => {
        checksEverythingIsOK();
    });
},30000);

test('Given a correct data and SSH method, when requests to clone a group, then the group is cloned', () => {
    createTmpFolder();

    inquirer.prompt = jest.fn().mockResolvedValue({
        gitlabUrlBase: 'https://gitlab.com',
        groupId: goodGroup,
        workingDir: './tmp/',
        token: gitlabApiToken,
        method: 'ssh'
    });

    return gitlabcloner.clone().then(() => {
        checksEverythingIsOK();
    });
},30000);


test('Given an incorrect group, when requests to clone a group, then an error is thrown', () => {
    createTmpFolder();

    inquirer.prompt = jest.fn().mockResolvedValue({
        gitlabUrlBase: 'https://gitlab.com',
        groupId: wrongGroup,
        workingDir: './tmp/',
        token: gitlabApiToken,
        method: 'ssh'
    });

    return gitlabcloner.clone().then(() => {
        fail('An error should be thrown');
    }).catch((error) => {
        expect(error).not.toBeNull();
    });
},30000);

test('Given an incorrect urlBase, when requests to clone a group, then an error is thrown', () => {
    createTmpFolder();

    inquirer.prompt = jest.fn().mockResolvedValue({
        gitlabUrlBase: 'https://kkk.com',
        groupId: wrongGroup,
        workingDir: './tmp/',
        token: gitlabApiToken,
        method: 'ssh'
    });

    return gitlabcloner.clone().then(() => {
        fail('An error should be thrown');
    }).catch((error) => {
        expect(error).not.toBeNull();
    });
},30000);

function createTmpFolder() {

    try {
        if (fs.existsSync(tmpFolder)) {
            rimraf.sync(tmpFolder);
        }
        fs.mkdirSync(tmpFolder)
    } catch (err) {
        console.error(err)
    }
}

function checksEverythingIsOK() {
    const groupFolder = path.join(tmpFolder, 'gitlab-clone-test');

    expect(fs.existsSync(groupFolder)).toBe(true);
    checkProject(path.join(groupFolder, 'project-1'));
    checkProject(path.join(groupFolder, 'project-2'));
    checkProject(path.join(groupFolder, 'subgroup1', 'project-3'));
    checkProject(path.join(groupFolder, 'subgroup1', 'subgroup1-1', 'project-4'));

    function checkProject(projectFolder) {
        expect(fs.existsSync(path.join(projectFolder, 'src'))).toBe(true);
        expect(fs.existsSync(path.join(projectFolder, 'README.md'))).toBe(true);
    }
}
