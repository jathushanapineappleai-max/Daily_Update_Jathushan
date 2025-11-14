import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  isLoading: false,
  error: null,
};

export const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = vendorsSlice.actions;
export default vendorsSlice.reducer;
