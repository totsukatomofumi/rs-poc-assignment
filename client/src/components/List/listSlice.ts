import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TestRunner } from "../../app/Dashboard";

interface ListState {
  services: Array<TestRunner>;
  activeServices: Array<TestRunner>;
}

const initialState: ListState = {
  services: new Array<TestRunner>(),
  activeServices: new Array<TestRunner>(),
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    resetList: (state) => {
      state.services = new Array<TestRunner>();
      state.activeServices = new Array<TestRunner>();
    },
    setServices: (state, action: PayloadAction<Array<TestRunner>>) => {
      state.services = action.payload;
    },
    addActiveService: (state, action: PayloadAction<TestRunner>) => {
      state.activeServices.push(action.payload);
    },
    removeActiveService: (state, action: PayloadAction<TestRunner>) => {
      state.activeServices = state.activeServices.filter(
        (s) => s.address !== action.payload.address
      );
    },
  },
});

export const { resetList, setServices, addActiveService, removeActiveService } =
  listSlice.actions;

export default listSlice.reducer;
