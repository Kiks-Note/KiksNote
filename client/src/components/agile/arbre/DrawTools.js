import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, TextField, Typography } from "@mui/material";
import { isNameExists, generateUniqueName, findParent } from "../../../utils/FunctionsUtils"
import Button from '@material-ui/core/Button';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { margin } from '@mui/system';




const useStyles = makeStyles((theme) => ({
  drawer: {
    padding: '10px',
    width: 100,
    flexShrink: 0,


  },
  drawerPaper: {
    padding: '10px',
    width: '320px',
    height: '100vh',
  },
  addButton: {
    color: theme.palette.primary.contrastText,
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: theme.palette.primary.white,
    },
  },
  editButton: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: 'yellow',
    '&:hover': {
      backgroundColor: theme.palette.secondary.white,
    },
  },
  deleteButton: {
    color: theme.palette.error.contrastText,
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: theme.palette.error.white,
    },
  },
  titleDraw: {
    textAlign: 'center',
    marginBottom: 70
  },
  addSection: {
    backgroundColor: 'red',
    marginBottom: 70
  },
  nameSection: {
    marginBottom: 30
  },
  deleteSection: {
    marginBottom: 30
  }
}));
const DrawTools = ({ nodeToUpdate, sendUpdateThree, oldTreeData }) => {
  const classes = useStyles();
  const [node, setNode] = useState(nodeToUpdate)
  const [nameEdit, setNameEdit] = useState('')
  const [nameAdd, setNameAdd] = useState('')

  useEffect(() => {
    setNode(nodeToUpdate);
  }, [nodeToUpdate]);

  function handleAddButton() {
    var newBranch = { name: 'Nouveau', children: [] };
    if (nameAdd && nameAdd !== '') {
      newBranch.name = nameAdd;
    }
    if (isNameExists(newBranch.name, oldTreeData)) {
      newBranch.name = generateUniqueName(newBranch.name, oldTreeData);
    }
    const updatedOldTreeData = findAndReplaceObject(node.name, newBranch, oldTreeData, 'add');
    setNode(newBranch);
    setNameAdd('');
    sendUpdateThree(updatedOldTreeData);
  }

  function handleEditButton() {
    if (!nameEdit || nameEdit === '') {
      return;
    }
    var newBranch = { ...node };
    newBranch.name = nameEdit;
    if (isNameExists(newBranch.name, oldTreeData)) {
      newBranch.name = generateUniqueName(newBranch.name, oldTreeData);
    }
    const updatedOldTreeData = findAndReplaceObject(node.name, newBranch, oldTreeData, 'edit');
    setNameEdit('');
    setNode(newBranch);
    sendUpdateThree(updatedOldTreeData);
  }

  function handleNameAdd(e) {
    console.log(e.target.value)
    setNameAdd(e.target.value)
  }

  function handleNameEdit(e) {
    setNameEdit(e.target.value)
  }

  function handleDeletedButton() {

    var parentNode = findParent(oldTreeData, node.name);
    console.log(parentNode)
    if (parentNode == null) {
      return
    }
    var updateChildre = parentNode.children.filter(obj => obj.name !== node.name)
    parentNode.children.splice(0, parentNode.children.length, ...updateChildre)
    const updateoldTreeData = findAndReplaceObject(parentNode.name, parentNode, oldTreeData, 'edit')
    setNode(parentNode)
    sendUpdateThree(updateoldTreeData)

  }


  const buttons = [
    { label: 0, description: 'Description de l\'action 1', clas: 'addButton', icon: <AddIcon /> },
    { label: 1, description: 'Description de l\'action 2', clas: 'editButton', icon: <EditIcon /> },
    { label: 2, description: 'Description de l\'action 3', clas: 'deleteButton', icon: <DeleteIcon /> },
  ];

  const findAndReplaceObject = (targetName, newBranch, oldTreeData, mode) => {

    var updateoldTreeData = { ...oldTreeData };
    if (updateoldTreeData.name === targetName) {
      if (updateoldTreeData.children) {
        if (mode == 'add') {
          updateoldTreeData.children.push(newBranch);
        } else if (mode == 'edit') {
          updateoldTreeData = { ...newBranch };
        }
      }
    } else if (updateoldTreeData.children) {
      // Si la branche a des enfants, récursivement chercher la branche cible dans ses enfants
      updateoldTreeData.children = updateoldTreeData.children.map(child => findAndReplaceObject(targetName, newBranch, child, mode));
    }
    return updateoldTreeData;
  };
  return (
    <div>
      <Drawer

        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        style={{ height: '100vh', right: 0 }}
      >
        <div className='headerDraw' style={{ marginBottom: '70px' }}>
          <div className='titleDraw' >
            <Typography variant="h5" align='center'>ÉDITION DU NOEUD</Typography>
          </div>
          <div className='nameNode'>
            <Typography variant="h6" align='center'>{node.name}</Typography>
          </div>
        </div>

        <br>
        </br>
        <div className='addSection' style={{ marginBottom: '70px' }}>
          <div>  <TextField value={nameAdd} onChange={(e) => handleNameAdd(e)}></TextField></div>
          <Button
            title={buttons[0].description}
            className={buttons[0].clas}
            style={{ backgroundColor: 'green', margin: 30 }}
            onClick={handleAddButton}
          >
            Ajouter un node
          </Button>
        </div>
        <div className='nameSection' style={{ marginBottom: '70px' }}>
          <div >
            <TextField value={nameEdit} onChange={(e) => handleNameEdit(e)}></TextField></div>
          <Button
            title={buttons[1].description}
            className={buttons[1].clas}
            style={{ backgroundColor: 'yellow' }}
            onClick={handleEditButton}

          >
            Changer le nom
          </Button>
        </div>
        <div className='deleteSection' style={{ marginBottom: '70px' }}>
          <Button
            title={buttons[1].description}
            className={buttons[1].clas}
            onClick={handleDeletedButton}
            style={{ backgroundColor: 'red' }}
          >
            Supprimer cette branche
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default DrawTools