import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state type for URL
interface UrlState {
  value: string;
}

const initialState: UrlState = {
  value: "",
};

const urlSlice = createSlice({
  name: "url",
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setUrl } = urlSlice.actions;
export default urlSlice.reducer;
