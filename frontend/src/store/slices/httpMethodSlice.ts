import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HttpMethodState {
  value: string;
}

const initialState: HttpMethodState = {
  value: "GET"
}



const httpMethodSlice = createSlice({
  name: "httpMethod", initialState,
  reducers: {
    setHttpMethod: (state, action) => {
      state.value = action.payload;
    }
  }
})
export const { setHttpMethod } = httpMethodSlice.actions;

export default httpMethodSlice.reducer;