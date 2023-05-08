import {  useState } from "react";
import { makeStyles } from "@mui/styles";
import Tree from 'react-d3-tree';


import { Drawer, List, ListItem, ListItemText, Typography, IconButton} from "@mui/material";

import { ExpandMore, ChevronRight, Delete } from "@mui/icons-material";

import { TreeView,TreeItem } from '@mui/lab';

import Arbre from "../../components/agile/Arbre.js";




const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        height: '100%',
    },
    content: {
        flexGrow: 1,

    },
    main:{backgroundcolor:'white!',width: '100%',
    height: '100%'},
    main:{},
    ro: {
        flexGrow: 1,
    }
}));
function ArbreFonctionnel() {
    const classes = useStyles();
    const [selectedProject, setSelectedProject] = useState(null);

    const handleProjectSelect = (project) => {
        console.log(project)
        setSelectedProject(project);
    };

    const projects = [
        { id: 1, name: 'Nouveau projet', content:null },
        { id: 2, name: 'Projet 2', content: {
            name: 'Root',
            children: [
                {
                    name: 'Node 1',
                    children: [
                        
                    ],
                },
                {
                    name: 'Node 2',
                },
            ],
        } },
        { id: 3, name: 'Projet 3', content: {
            name: 'Root',
            children: [
                {
                    name: 'Node 1',
                    children: [
                        
                    ],
                },
                
            ],
        } },
    ];



   

    const handleDelete = (event, nodeId) => {
        // Logic to delete the node
        console.log('Deleting node:', nodeId);
    };

    const renderTree = (nodes) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={
                <div>
                    <Typography variant="body1">{nodes.label}</Typography>
                    <IconButton
                        aria-label="delete"
                        onClick={(event) => handleDelete(event, nodes.id)}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </div>
            }
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );

   

    return (
        <div className={classes.root}>
            {/* Barre de sélection des projets */}
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <div className={classes.drawerContainer}>
                    <List>
                        {projects.map((project) => (
                            <ListItem
                                button
                                key={project.id}
                                onClick={() => handleProjectSelect(project)}
                            >
                                <ListItemText primary={project.name} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            {/* Mode d'édition du projet sélectionné */}
            <main className={classes.main}>
                {selectedProject ? (
                   <Arbre data={selectedProject.content}></Arbre>
                ) : (
                    <Typography variant="h5">Sélectionnez un projet ou cré</Typography>
                )}
            </main>
        </div>
    );
}

export default ArbreFonctionnel;
