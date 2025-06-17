import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const authCookies = {
  setTokens: (accessToken: string, refreshToken?: string) => {
    setCookie('tr-token', accessToken, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    if (refreshToken) {
      setCookie('tr-refresh_token', refreshToken, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }
  },
  clear: () => {
    deleteCookie('tr-token');
    deleteCookie('tr-refresh_token');
  },
  getAccessToken: () => getCookie('tr-token'),
  getRefreshToken: () => getCookie('tr-refresh_token'),
};

export const authAdminCookies = {
  setTokens: (accessToken: string, refreshToken?: string) => {
    setCookie('tr-admin_token', accessToken, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    if (refreshToken) {
      setCookie('tr-admin_refresh_token', refreshToken, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }
  },
  clear: () => {
    deleteCookie('tr-admin_token');
    deleteCookie('tr-admin_refresh_token');
  },
  getAccessToken: () => getCookie('tr-admin_token'),
  getRefreshToken: () => getCookie('tr-admin_refresh_token'),
};
