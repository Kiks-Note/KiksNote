import { createSlice } from '@reduxjs/toolkit';

//This is the redux store, this will help to store our impact mapping card
const impactMappingSlice = createSlice({
    name: 'impactMapping',
    initialState:[],
    reducers: {
        addImpactMapping: (state, action) => {
            state.push(action.payload);
        }
    }
})

//there you export the function to use it everywhere you want
export const {addImpactMapping} = impactMappingSlice.actions


export default impactMappingSlice.reducer