import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IService } from "../../app/Dashboard";

interface ListState {
  services: Array<IService>;
}

const initialState: ListState = {
  services: new Array<IService>(),
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<IService>) => {
      action.payload.index = state.services.length;
      state.services.push(action.payload);
    },
    setService: (state, action: PayloadAction<IService>) => {
      action.payload.address = state.services[action.payload.index].address;
      state.services[action.payload.index] = action.payload;
    },
  },
});

export const { addService, setService } = listSlice.actions;

export default listSlice.reducer;
