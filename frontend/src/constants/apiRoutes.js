// // api routes constants placeholder
// export const API = {
//   BASE_URL: 'http://localhost:5000',
//   EMPLOYEES: '/employees',
//   ATTENDANCE: '/attendance',
//   LEAVES: '/leaves',
//   PAYROLL: '/payroll',
//   REPORTS: '/reports',
//   AUTH: '/auth',
// };

// api routes constants placeholder
export const API = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  LEAVES: '/leaves',
  PAYROLL: '/payroll',
  REPORTS: '/reports',
  AUTH: '/auth',
};
