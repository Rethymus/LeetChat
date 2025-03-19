import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string | number;
  nickname: string;
  phone?: string;
  email?: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
}

interface UserState {
  currentUser: User | null;
  onlineUsers: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  onlineUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    addOnlineUser(state, action: PayloadAction<string>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser(state, action: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },
    clearUser(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, setOnlineUsers, addOnlineUser, removeOnlineUser, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
