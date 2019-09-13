export const signup = user => {
  return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const signin = user => {
  return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .catch(err => console.log(err));
};

export const authenticate = (jwt, next) => {
  if (typeof window != 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(jwt));
    next();
  }
};

export const isAuthenticate = () => {
  let jwt = localStorage.jwt;
  if (jwt) return JSON.parse(jwt);
  return false;
};

export const signout = next => {
  if (typeof window !== 'undefined') localStorage.removeItem('jwt');
  next();
  return fetch(`${process.env.REACT_APP_API_URL}/signout`, { method: 'POST' })
    .then(res => res.json())
    .catch(err => console.log(err));
};

//check path
export const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: '#ff9900' };
  return {};
};
