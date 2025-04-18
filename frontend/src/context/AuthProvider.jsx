import { createContext, useContext, useState } from "react";

const AuthContex = createContext({
  isAuthenticated: false,
  userData: "",
  token: "",
  role: "",
  login: () => {},
  logout: () => {},
});

const useAuth = () => useContext(AuthContex);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setrole] = useState(false);

  // Placeholder login function (replace with your actual login logic)
  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUserData(userData);
    setToken(token);
    setrole(userData.role);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);


    if (userData.role===1) {
      window.location.href="/dashboard"
    }
    else{
      window.location.href="/"
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setToken(null);
    setrole(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  
  return (
    <AuthContex.Provider
      value={{ isAuthenticated, userData, role, token, login, logout }}
    >
      {children}
    </AuthContex.Provider>
  );
};

export { AuthContex, AuthProvider, useAuth };
