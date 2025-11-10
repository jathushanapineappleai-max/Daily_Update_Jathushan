// Placeholder API layer - auth
export const login = async (email, password) => {
  console.log('login called', { email });
  return Promise.resolve({ token: 'placeholder', user: { email } });
};

export const logout = async () => {
  console.log('logout called');
  return Promise.resolve({ ok: true });
};

