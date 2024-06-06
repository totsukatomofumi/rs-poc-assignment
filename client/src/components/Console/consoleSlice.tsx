import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITestLog } from "../../app/Dashboard";

interface ConsoleState {
  logs: Array<ITestLog>;
}

const initialState: ConsoleState = {
  logs: new Array<ITestLog>(),
};

const consoleSlice = createSlice({
  name: "console",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<ITestLog>) => {
      state.logs = [...state.logs, action.payload];
    },
    resetLogs: (state) => {
      state.logs = new Array<ITestLog>();
    },
  },
});

export const { addLog, resetLogs } = consoleSlice.actions;

export default consoleSlice.reducer;
