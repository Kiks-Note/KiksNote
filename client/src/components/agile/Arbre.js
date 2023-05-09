import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tree from 'react-d3-tree';
import Button from '@material-ui/core/Button';
import { Icon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddRounded, EditNotificationsRounded, NoEncryption } from '@mui/icons-material';
import { array } from 'prop-types';
import { isNameExists, generateUniqueName  } from '../../utils/FunctionsUtils';
import InputNode from './arbre/InputNode'






const useStyles = makeStyles((theme) => ({
  treeContainer: {
    height: '100vh',
    width: '100vh',
    transform: 'rotate(180deg)',
    color:'white'
  },
  treeMarker: {
    position: 'relative',
  },
  treeMarkerIcon: {
    position: 'absolute',
    background:'transparent'
  }, 
  addButton: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  editButton: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  deleteButton: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  node__leaf :{
    color:' green',
    /* Let's also make the radius of leaf nodes larger */
    r: 40,
  }
}));

const Arbre = ({projet}) => {
  const classes = useStyles();
  const [showToolbar,setShowToolbar] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [currentProjetId, setCurrentProjetId] = useState(null)
  const [showInputFor, setShowInputFor] = useState(null)
  const [treeData,setTreeData] = useState({
    name: 'Root',
    children: [
    ],
  });
  

  useEffect(() => {
   if(currentProjetId == null || projet.id != currentProjetId){
    setTreeData(projet.content)
    setCurrentProjetId(projet.id)
   }
  }, [projet]);

  const handleNodeMouseOver = (event) => {
    console.log(event)
    setHoveredNode(event);
  };

  const handleNodeMouseOut = () => {
    setHoveredNode(null);
  };

  /*TOOOOLLLLBBBARRR*/
  const buttons = [
    { label: 0, description: 'Description de l\'action 1', clas : 'addButton', icon: <AddIcon />},
    { label: 1, description: 'Description de l\'action 2', clas : 'editButton',icon: <EditIcon />  },
    { label: 2, description: 'Description de l\'action 3', clas : 'deleteButton',icon: <DeleteIcon /> },
  ];


  const addNode = (node) => {
 var  nouvelBranche = { name: 'Nouveau', children:[] }   
 if (isNameExists(nouvelBranche.name, treeData)) {
    nouvelBranche.name = generateUniqueName(nouvelBranche.name, treeData);
  } 
    const updatedTreeData = findAndReplaceObject(node.name, nouvelBranche, treeData,'ajout');
    setTreeData(updatedTreeData)  
  }

  const editNode = (data) => {
    console.log(data)
    if (isNameExists(data.newBranch.name, treeData)) {
        data.newBranch.name = generateUniqueName(data.newBranch.name, treeData);
      } 

      const updatedTreeData = findAndReplaceObject(data.oldBranch, data.newBranch, treeData,'edit');
      console.log(updatedTreeData)
      setTreeData(updatedTreeData)
      setShowInput(false)
      setShowInputFor(null)

}

const deleteNode = (node) => {
    //si root selectionner just détruire tous les enfant
    const updatedTreeData = findAndReplaceObject(node.name, null, treeData,'retirer');
    console.log(updatedTreeData)
    setTreeData(updatedTreeData)
    

}

  const handleButtonToolbar = ( index,node, event)=> {
    console.log(index)
        switch(index){
            case 0:
                addNode(node)
                break;
            case 1:
                setShowInput(true)
                setShowInputFor(node.name)
                break;

            case 2:
                deleteNode(node)
        }
        
  }

  const findAndReplaceObject = (targetName, newBranch, treeData, mode) => {
    var updateTreeData = { ...treeData };
    if (updateTreeData.name === targetName) {
        if(updateTreeData.children){
           if(mode == 'ajout'){
            updateTreeData.children.push(newBranch);
           }else if(mode == 'edit'){
            console.log(updateTreeData.name )
            updateTreeData = {...newBranch};
          }
           else if(mode == 'retirer'){
            //updateTreeData.children.pop()
            updateTreeData.children = updateTreeData.children.filter(child => child.name !== targetName);

        }
        }
    } else if (updateTreeData.children) {
      // Si la branche a des enfants, récursivement chercher la branche cible dans ses enfants
      updateTreeData.children = updateTreeData.children.map(child => findAndReplaceObject(targetName, newBranch, child, mode));
    }
    return updateTreeData;
  };




/*FINNNNN TOOOOLBAR*/

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps
  }) => (
    <g transform="rotate(180,0,0)">
  <rect
    width="100"
    height="50"
    x="-50"
    y= "-30"
    
    onClick={toggleNode}
    onMouseEnter={() => {setShowToolbar(true);
        handleNodeMouseOver(nodeDatum.name);
    }}
    onMouseLeave={() => {setShowToolbar(false);
        handleNodeMouseOut();
        }}
  > 
   </rect>
   {showInput && nodeDatum.name == showInputFor  ? (
  <foreignObject x="-50" y="-30" width="100" height="50">
    <InputNode node = {nodeDatum} sendName={editNode}></InputNode>
  </foreignObject>
) : (
  <text dominantBaseline="middle" textAnchor="middle" fill="white">
    {nodeDatum.name}
  </text>
)}
  {showToolbar && nodeDatum.name == hoveredNode && (
    <foreignObject className={classes.treeMarkerIcon} {...foreignObjectProps} onMouseEnter={() => {setShowToolbar(true);
        handleNodeMouseOver(nodeDatum.name);
    }}
    onMouseLeave={() => {setShowToolbar(false);
        handleNodeMouseOut();
        }}>
    {buttons.map((button, index) => {
        // Pour bloquer a 3 la pronfondeur
      if (nodeDatum.__rd3t.depth && nodeDatum.__rd3t.depth == 3 && index == 0) {
            return null;
        }
        // Pour ne pas suprimer la branche mèr
      if (nodeDatum.__rd3t.depth && nodeDatum.__rd3t.depth == 0 && index == 2) {
            return null;
          }
      // Verifie si le noeud a déja son max de branche
      if (nodeDatum.children && nodeDatum.children.length == 3 && index == 0) {
        return null;
      }
      return (
        <Button
          key={index}
          title={button.description}
          className={classes[button.clas]}
          onClick={(e) => handleButtonToolbar(button.label, nodeDatum, e)}
        >
          {button.icon && <span className={classes.icon}>{button.icon}</span>}
        </Button>
      );
    })}

        
    </foreignObject>
  )}
</g>
  );



  const nodeSize = { x: 400, y: 400 };
 
  const foreignObjectProps = { width: nodeSize.x -200 , height: nodeSize.y-50, x: 50, y:-20 };
  
  const translate = {
    x: 200, 
    y: 50, 
  };
 
  return (
    <div className={classes.treeContainer}>
      <Tree data={treeData}
        orientation="vertical"
        translate={translate}
        separation={{ siblings: 0.5, nonSiblings: 0.5 }}
        nodeSize={nodeSize }
        leafNodeClassName={classes.node__leaf}
        renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
         
  />
    </div>
  );
};

export default Arbre;
