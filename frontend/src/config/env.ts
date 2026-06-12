export const env = {
  apiBaseUrl: process.env.REACT_APP_API_URL?.replace('localhost', '127.0.0.1') || "http://127.0.0.1:8080"
};
