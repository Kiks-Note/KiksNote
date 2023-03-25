import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function SearchBar({title}) {
    return (
        <Stack spacing={2} sx={{width: 800}}>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={title.map((option) => option.title)}
                renderInput={(params) => <TextField {...params} label="Rechercher un titre"/>}
            />
        </Stack>
    );
}
