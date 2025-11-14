import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  isLoading: false,
  error: null,
};

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = documentsSlice.actions;
export default documentsSlice.reducer;
