import { FormControl } from '@mui/material';
import { Input } from '@mui/material';
import { InputLabel } from '@mui/material';
import { FormHelperText } from '@mui/material';
import './Profile.scss';


export default function Profile() {
  return (
    <div className='userForms'>
      <FormControl className='formControl'>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
      </FormControl>
      <FormControl>
      <InputLabel htmlFor="my-input"> User's Name</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">
            We'll never share your name.
        </FormHelperText>
      </FormControl>
    </div>
  );
}
