import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TestLog } from "../../app/Dashboard";

interface ConsoleState {
  logs: Array<TestLog>;
}

const initialState: ConsoleState = {
  logs: new Array<TestLog>(),
};

const consoleSlice = createSlice({
  name: "console",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<TestLog>) => {
      state.logs = [...state.logs, action.payload];
    },
    resetLogs: (state) => {
      state.logs = new Array<TestLog>();
    },
  },
});

export const { addLog, resetLogs } = consoleSlice.actions;

export default consoleSlice.reducer;
