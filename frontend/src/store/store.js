import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import usersSlice from './slices/usersSlice';
import meetingsSlice from './slices/meetingsSlice';
import announcementsSlice from './slices/announcementsSlice';
import financesSlice from './slices/financesSlice';
import maintenanceSlice from './slices/maintenanceSlice';
import documentsSlice from './slices/documentsSlice';
import vendorsSlice from './slices/vendorsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    users: usersSlice,
    meetings: meetingsSlice,
    announcements: announcementsSlice,
    finances: financesSlice,
    maintenance: maintenanceSlice,
    documents: documentsSlice,
    vendors: vendorsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
