import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  announcements: [],
  isLoading: false,
  error: null,
};

export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = announcementsSlice.actions;
export default announcementsSlice.reducer;
