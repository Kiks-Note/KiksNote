import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import impactMappingSlice from "./slices/impactMappingSlice";
import tabBoardSlice from "./slices/tabBoardSlice";
import thunk from "redux-thunk";

export const store = configureStore({
  reducer: {
    impactMapping: impactMappingSlice,
    tabBoard: tabBoardSlice,
  },
  middleware: [...getDefaultMiddleware(), thunk],
});
