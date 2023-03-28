import { createSlice } from '@reduxjs/toolkit';

//This is the redux store, this will help to store our impact mapping card
const impactMappingSlice = createSlice({
    name: 'impactMapping',
    initialState:{
        goals:[],
        actors:[],
        impacts:[],
        deliverables:[]
},
    reducers: {
        addImpactMappingGoals: (state, action) => {
            state.goals.push(action.payload.goals)
        },
        addImpactMappingActors: (state, action) => {
            state.actors.push(action.payload.actors)
        },
        addImpactMappingImpacts: (state, action) => {
            state.impacts.push(action.payload.impacts)
        },
        addImpactMappingDeliverables: (state, action) => {
            state.deliverables.push(action.payload.deliverables)
        },
        deleteImpactMappingGoals: (state, action) =>{
            state.goals.splice(action.payload.index, 1)
        },
        deleteImpactMappingActors: (state, action) =>{
            state.actors.splice(action.payload.index, 1)
        },
        deleteImpactMappingImpacts: (state, action) =>{
            state.impacts.splice(action.payload.index, 1)
        },
        deleteImpactMappingDeliverables: (state, action) =>{
            state.deliverables.splice(action.payload.index, 1)
        }

    }
})

//there you export the function to use it everywhere you want
export const {addImpactMappingGoals, addImpactMappingActors, addImpactMappingDeliverables, addImpactMappingImpacts, deleteImpactMappingActors, deleteImpactMappingDeliverables, deleteImpactMappingGoals, deleteImpactMappingImpacts} = impactMappingSlice.actions


export default impactMappingSlice.reducer