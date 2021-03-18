import prompter from './cloner-prompter';
import inquirer from 'inquirer';

jest.mock('inquirer');

describe('Prompter', () => {
    test('User input', async () => {
        expect.assertions(1);
        inquirer.prompt = jest.fn().mockResolvedValue({
            gitlabUrlBase: 'http://gitlab.com',
            groupId: 1234,
            workingDir: './',
            token: 'hgadhdjhdjksds',
            method: 'ssh'
        });

        await expect(prompter.performQuestions()).resolves.toEqual({
            gitlabUrlBase: 'http://gitlab.com',
            groupId: 1234,
            workingDir: './',
            token: 'hgadhdjhdjksds',
            method: 'ssh'
        });
    });
});
