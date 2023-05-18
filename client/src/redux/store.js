import { configureStore } from '@reduxjs/toolkit';
import impactMappingSlice from './slices/impactMappingSlice';

//Slices used to make it usable in every file you want
export const store = configureStore({
    reducer: {
        impactMapping: impactMappingSlice,
        tabBoard: tabBoardSlice,
    },
})