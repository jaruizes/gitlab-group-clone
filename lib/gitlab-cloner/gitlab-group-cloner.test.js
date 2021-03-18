import gitlabcloner from './gitlab-group-cloner';
import inquirer from 'inquirer';
import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';

jest.mock('inquirer');
const tmpFolder = path.join(__dirname, '..', '..', 'tmp');

test('User input', () => {
        createTmpFolder();

        inquirer.prompt = jest.fn().mockResolvedValue({
            gitlabUrlBase: 'https://gitlab.com',
            groupId: 11074786,
            workingDir: './tmp/',
            token: 'fDNB-iBpDh1zb7uLfueZ',
            method: 'http'
        });

        return gitlabcloner.clone().then(() => {
            console.log('Finish!');
            checksEverythingIsOK();
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
