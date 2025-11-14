import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  isLoading: false,
  error: null,
};

export const financesSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = financesSlice.actions;
export default financesSlice.reducer;
