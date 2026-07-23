export const setEmail = (email: string) => {
  sessionStorage.setItem('email', email);
};

export const getEmail = (): string => {
  return sessionStorage.getItem('email');
};

export const unauthorized = (code: number, message: string) => {
  if (code === 401 && message === 'jwt expired') {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  }
};

export const BaseServerUrl = import.meta.env.VITE_BASE_URL;
export const BaseServerV2Url = import.meta.env.VITE_BASE_V2_URL;
// export const BaseServerUrl = "https://plainb-server.vercel.app";
