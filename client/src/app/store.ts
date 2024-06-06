import { configureStore } from "@reduxjs/toolkit";
import consoleReducer from "../components/Console/consoleSlice";
import listReducer from "../components/List/listSlice";

export const store = configureStore({
  reducer: {
    console: consoleReducer,
    list: listReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
