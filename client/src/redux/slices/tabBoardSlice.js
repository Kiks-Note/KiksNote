import { createSlice } from "@reduxjs/toolkit";

const tabBoardSlice = createSlice({
  name: "tabBoardMapping",
  initialState: {
    tabs: [],
    activeTab: "Dashbaord",
  },
  reducers: {
    addTab: (state, action) => {
      const { id } = action.payload;
      const isTabExist = state.tabs.some((tab) => tab.id === id);

      if (!isTabExist) {
        state.tabs.push(action.payload);
      }
    },
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== action.payload.id);
      if (state.activeTab === action.payload) {
        state.activeTab = null;
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { addTab, removeTab, setActiveTab } = tabBoardSlice.actions;

export default tabBoardSlice.reducer;
