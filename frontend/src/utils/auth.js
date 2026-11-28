export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userFullName');
  localStorage.removeItem('username');
};

export const isAuthenticated = () => !!getAccessToken();

export const getUserInfo = () => ({
  fullName: localStorage.getItem('userFullName') || 'Pemilik Lintang Bakso',
  username: localStorage.getItem('username') || 'owner_lintang',
});
