import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, TextField } from "@mui/material";
import { isNameExists, generateUniqueName, findParent } from "../../../utils/FunctionsUtils"
import Button from '@material-ui/core/Button';
import { Icon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { set } from 'lodash';
import { array } from 'prop-types';



const useStyles = makeStyles((theme) => ({
  drawer: {

    width: 50,
    flexShrink: 0,
    width: '270px',

  },
  drawerPaper: {
    transform: 'rotate(180deg)',
    width: '270px',
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
    var updateChildre = parentNode.children.filter(obj => obj.name !== node.name)
    console.log(updateChildre)
    parentNode.children.splice(0, parentNode.children.length, ...updateChildre)
    console.log(parentNode)
    const updateoldTreeData = findAndReplaceObject(parentNode.name, parentNode, oldTreeData, 'edit')
    console.log(updateoldTreeData)

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
        <div>
          ÉDITION DU NOEUD : {node.name}
          <br>
          </br>
        </div>
        <div>
          <div>Ajouter un enfant à cette branche : <TextField value={nameAdd} onChange={(e) => handleNameAdd(e)}></TextField></div>
          <Button
            title={buttons[0].description}
            className={buttons[0].clas}
            onClick={handleAddButton}
          >
            {buttons[0].icon}
          </Button>
        </div>
        <div>
          <div>Changer le nom : <TextField value={nameEdit} onChange={(e) => handleNameEdit(e)}></TextField></div>
          <Button
            title={buttons[1].description}
            className={buttons[1].clas}
            onClick={handleEditButton}

          >
            {buttons[1].icon}
          </Button>
        </div>
        <div>
          <div>Supprimer cette branche </div>
          <Button
            title={buttons[1].description}
            className={buttons[1].clas}
            onClick={handleDeletedButton}
          >
            {buttons[1].icon}
          </Button>
          <button>Supprimer tous ces enfants</button>
        </div>
      </Drawer>
    </div>
  )
}

export default DrawTools