import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_COLOR = ""
//This is the redux store, this will help to store our impact mapping card
const impactMappingSlice = createSlice({
  name: "impactMapping",
  initialState: {
    goals: [],
    actors: [],
    impacts: [],
    deliverables: [],
  },
  reducers: {
    addImpactMappingGoals: (state, action) => {
      const { text, color } = action.payload;
      const newGoal = {
        text: text,
        color: color || DEFAULT_COLOR, 
      };
      state.goals.push(newGoal);
    },
    addImpactMappingActors: (state, action) => {
      const { text, color } = action.payload;
      const newActor = {
        text: text,
        color: color || DEFAULT_COLOR,
      };
      state.actors.push(newActor);
    },
    addImpactMappingImpacts: (state, action) => {
      const { text, color } = action.payload;
      const newImpact = {
        text: text,
        color: color || DEFAULT_COLOR,
      };
      state.impacts.push(newImpact);
    },
    addImpactMappingDeliverables: (state, action) => {
      const { text, color } = action.payload;
      const newDeliverable = {
        text: text,
        color: color || DEFAULT_COLOR,
      };
      state.deliverables.push(newDeliverable);
    },
    deleteImpactMappingGoals: (state, action) => {
      state.goals.splice(action.payload.index, 1);
    },
    deleteImpactMappingActors: (state, action) => {
      state.actors.splice(action.payload.index, 1);
    },
    deleteImpactMappingImpacts: (state, action) => {
      state.impacts.splice(action.payload.index, 1);
    },
    deleteImpactMappingDeliverables: (state, action) => {
      state.deliverables.splice(action.payload.index, 1);
    },
  },
});

//there you export the function to use it everywhere you want
export const {
  addImpactMappingGoals,
  addImpactMappingActors,
  addImpactMappingDeliverables,
  addImpactMappingImpacts,
  deleteImpactMappingActors,
  deleteImpactMappingDeliverables,
  deleteImpactMappingGoals,
  deleteImpactMappingImpacts,
} = impactMappingSlice.actions;

export default impactMappingSlice.reducer;
