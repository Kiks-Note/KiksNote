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

then

```bash
  cd server
  yarn install
  yarn run dev
  cd ..

  cd client
  yarn install
  yarn start
  cd ..
```

# Good practices

Respect these unless you want me to unleash the **CELIAN**. 

## Git

### Issues

All your commits must be related to an Issue. Please add tags and assignees when you create an issue. 

### Branch naming

    type/group/title

e.g.

    feat/board/sprint
    docs/commun/readme

### Commit naming

    #issue type/title

e.g.

    #14 feat/new readme with setup and good practices
    #7 fix/comment code for firebase

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
