import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_COLOR = ""
//This is the redux store, this will help to store our impact mapping card
const impactMappingSlice = createSlice({
  name: "impactMapping",
  initialState: {
    // it can represent variable that you want to use everywhere
    goals: [],
    actors: [],
    impacts: [],
    deliverables: [],
  },
  reducers: {
    // function to add data to goals tab
    addImpactMappingGoals: (state, action) => {
      const { text, color } = action.payload;
      const newGoal = {
        text: text,
        color: color || DEFAULT_COLOR, 
      };
      state.goals.push(newGoal);
    },
    // function to add data to actors tab
    addImpactMappingActors: (state, action) => {
      const { text, color } = action.payload;
      const newActor = {
        text: text,
        color: color || DEFAULT_COLOR,
      };
      state.actors.push(newActor);
    },
    // function to add data to impacts tab
    addImpactMappingImpacts: (state, action) => {
      const { text, color } = action.payload;
      const newImpact = {
        text: text,
        color: color || DEFAULT_COLOR,
      };
      state.impacts.push(newImpact);
    },
    // function to add data to deliverables tab
    addImpactMappingDeliverables: (state, action) => {
      const { text, color } = action.payload;
      const newDeliverable = {
        text: text,
        color: color || DEFAULT_COLOR,
      };
      state.deliverables.push(newDeliverable);
    },
    // function to delete goals from tab
    deleteImpactMappingGoals: (state, action) => {
      state.goals.splice(action.payload.index, 1);
    },
    // function to delete actors from tab
    deleteImpactMappingActors: (state, action) => {
      state.actors.splice(action.payload.index, 1);
    },
    // function to delete impacts from tab
    deleteImpactMappingImpacts: (state, action) => {
      state.impacts.splice(action.payload.index, 1);
    },
    // function to delete deliverables from tab
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