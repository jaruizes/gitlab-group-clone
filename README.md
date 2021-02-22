# Gitlab Groups Clone Tool

This project provides a NodeJS tool to clone all the projects within a group, identified by its id

## Setup
Execute this command to install NodeJS packages:

```
npm i
```

## Usage
Execute this command to execute the tool:

```
npm start
```

The system asks you the following questions:
- Gitlab URL
- GroupId to clone: this id is an integer. It's not the group name.
- Destination path: path where the group will be cloned
- Method: ssh / http
- Token: a token is necessary in order to call Gitlab API to get information about the group. This token isn't stored.

** For each project associated to the group, the tool checks if the project is already cloned. In this case, the tool
will perform a pull action instead of a clone action


## Roadmap

- Check if the group has more than 100 projects associated. In this case, multiple calls to Gitlab API should be implemented (pagination)
