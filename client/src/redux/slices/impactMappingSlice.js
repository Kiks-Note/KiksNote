import { createSlice } from '@reduxjs/toolkit';

//This is the redux store, this will help to store our impact mapping card
const impactMappingSlice = createSlice({
    name: 'impactMapping',
    initialState:{
        goal:[],
        actors:[],
        impacts:[],
        deliverables:[]
},
    reducers: {
        addImpactMappingGoals: (state, action) => {
            state.goal.push(action.payload.goal)
        },
        addImpactMappingActors: (state, action) => {
            state.actors.push(action.payload.actors)
        },
        addImpactMappingImpacts: (state, action) => {
            state.impacts.push(action.payload.impacts)
        },
        addImpactMappingDeliverables: (state, action) => {
            state.deliverables.push(action.payload.deliverables)
        }
    }
})

//there you export the function to use it everywhere you want
export const {addImpactMappingGoals, addImpactMappingActors, addImpactMappingDeliverables, addImpactMappingImpacts} = impactMappingSlice.actions


export default impactMappingSlice.reducer