import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function Tags() {
    return (
        <FormGroup>
            <FormControlLabel control={<Checkbox/>} label="PHP"/>
            <FormControlLabel control={<Checkbox/>} label="NodeJS"/>
            <FormControlLabel control={<Checkbox/>} label="ReactJS"/>
            <FormControlLabel control={<Checkbox/>} label="VueJS"/>
            <FormControlLabel control={<Checkbox/>} label="Angular"/>
            <FormControlLabel control={<Checkbox/>} label="Laravel"/>
            <FormControlLabel control={<Checkbox/>} label="Symfony"/>
            <FormControlLabel control={<Checkbox/>} label="ExpressJS"/>
            <FormControlLabel control={<Checkbox/>} label="NestJS"/>
        </FormGroup>
    );
}