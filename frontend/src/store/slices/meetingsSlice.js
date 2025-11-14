import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meetings: [],
  isLoading: false,
  error: null,
};

export const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = meetingsSlice.actions;
export default meetingsSlice.reducer;
