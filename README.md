# Setup

## From scratch

```bash
  git clone https://github.com/Kiks-Note/KiksNote.git
```

Add credentials.json in KiksNote/server for FireBase

## From project directory

```bash
  git pull
```

then in 2 different terminals

```bash
  cd server
  yarn install
  yarn run dev
```
```bash
  cd client
  yarn install
  yarn start
```

# Good practices

Respect these unless you want me to unleash the **CELIAN**. 

## Git

### Issues

All your commits must be related to an Issue. Please add tags and assignees when you create an issue. 

### Branch naming

    type/title

e.g.

    feat/blog
    docs/readme

### Commit naming

    #issue type/title

e.g.

    #3 style/drawer
    #7 fix/comment code for firebase

or for the last commit of the issue

    close #issue type/title

e.g.

    close #14 docs/finished readme

### Available types  


    build/ Build related changes (eg: npm related/ adding external dependencies)
    
    chore/ A code change that external user won't see (eg: change to .gitignore file or .prettierrc file)
    
    feat/ A new feature
    
    fix/ A bug fix
    
    docs/ Documentation related changes
    
    refactor/ A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/function name)
    
    perf/ A code that improves performance
    
    style/ A code that is related to styling
    
    test/ Adding new test or making changes to existing test

## Code

### Directory naming

    ./snake_case/

### File naming

    CamelCase.js

### Variable naming

The lesser the scope, the shorter the name can be. 
The greater the scope, the more explicit the name should be. 

### Database

Everything is snake_case. Collection names are plural.
Ask for more details before adding/changing anything. 
