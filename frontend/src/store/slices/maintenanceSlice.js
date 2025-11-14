import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
};

export const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
