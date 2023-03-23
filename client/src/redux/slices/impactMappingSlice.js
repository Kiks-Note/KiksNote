import { createSlice } from '@reduxjs/toolkit';

const impactMappingSlice = createSlice({
    name: 'impactMapping',
    initialState:[],
    reducers: {
        addImpactMapping: (state, action) => {
            state.push(action.payload);
        }
    }
})

export const {addImpactMapping} = impactMappingSlice.actions


export default impactMappingSlice.reducer