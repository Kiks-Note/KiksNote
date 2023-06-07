import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, TextField, Typography } from "@mui/material";
import { isNameExists, generateUniqueName, findParent } from "../../../utils/FunctionsUtils"
import Button from '@material-ui/core/Button';
import { SwipeableDrawer } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const DrawTools = ({ nodeToUpdate, sendUpdateThree, oldTreeData, open }) => {
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
    let data = { updateTree: updatedOldTreeData, updateNode: newBranch }
    setNameAdd('');
    sendUpdateThree(data);
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
    let data = { updateTree: updatedOldTreeData, updateNode: newBranch }
    sendUpdateThree(data);
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
    let data = { updateTree: updateoldTreeData, updateNode: parentNode }
    sendUpdateThree(data);


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


        open={open}
        variant="persistent"
        onClose={!open}
        PaperProps={{
          style: {
            width: '500px',
            height: '150px',
            borderRadius: '20px',
            marginLeft: '75px'
          },
        }}
        style={{ height: '50px', right: 0 }}
      >
        <div className='headerDraw' >
          <div className='nameNode' style={{ margin: '1px' }}>
            <Typography variant="h4" align='center'>{node == null ? ' ' : node.name}</Typography>
          </div>
        </div>

        <br>
        </br>
        <div className='addSection' style={{ marginBottom: '3px', display: 'flex', justifyContent: 'space-between', width: '500px', height: '40px', margin: '10px' }}>
          <div >
            <TextField value={nameAdd} onChange={(e) => handleNameAdd(e)} style={{ width: '120px', height: '5px' }}></TextField>
            <Button
              s className={buttons[0].clas}
              style={{ color: 'green', margin: 10, backgroundColor: 'white', border: 10, borderColor: 'green' }}
              onClick={handleAddButton}
            >
              {buttons[0].icon}
            </Button>
          </div>
          <div >
            <TextField value={nameEdit} onChange={(e) => handleNameEdit(e)} style={{ width: '120px', height: '5px' }}></TextField>
            <Button
              title={buttons[1].description}
              className={buttons[1].clas}
              style={{ backgroundColor: 'white', margin: 10, color: 'yellow', border: 10, borderColor: 'yellow' }}
              onClick={handleEditButton}

            >
              {buttons[1].icon}
            </Button>
          </div>
          <div style={{ marginBottom: '7px' }}>
            <Button
              title={buttons[2].description}
              className={buttons[2].clas}
              onClick={handleDeletedButton}
              style={{ backgroundColor: 'white', color: 'red', margin: 10, borderColor: 'red', border: 10 }}
            >
              {buttons[2].icon}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default DrawTools