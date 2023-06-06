import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_COLOR = "#FFC0CB"
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
    editImpactMappingGoal: (state, action) => {
      const { index, text, color } = action.payload;
      const updatedGoal = {
        text: text || state.goals[index].text,
        color: color || state.goals[index].color,
      };
      state.goals[index] = updatedGoal;
    },
    editImpactMappingActor: (state, action) => {
      const { index, text, color } = action.payload;
      const updatedActor = {
        text: text || state.actors[index].text,
        color: color || state.actors[index].color,
      };
      state.actors[index] = updatedActor;
    },
    editImpactMappingImpact: (state, action) => {
      const { index, text, color } = action.payload;
      const updatedImpact = {
        text: text || state.impacts[index].text,
        color: color || state.impacts[index].color,
      };
      state.impacts[index] = updatedImpact;
    }
    ,
    editImpactMappingDeliverable: (state, action) => {
      const { index, text, color } = action.payload;
      const updatedDeliverable = {
        text: text || state.deliverables[index].text,
        color: color || state.deliverables[index].color,
      };
      state.deliverables[index] = updatedDeliverable;
    }
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
  editImpactMappingGoal,
  editImpactMappingActor,
  editImpactMappingImpact,
  editImpactMappingDeliverable,
} = impactMappingSlice.actions;

export default impactMappingSlice.reducer;