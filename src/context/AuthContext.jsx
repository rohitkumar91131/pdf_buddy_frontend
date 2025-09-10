import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoginPageInTheWindow, setIsLoginPageInTheWindow] = useState(true);

  return (
    <AuthContext.Provider value={{ isLoginPageInTheWindow, setIsLoginPageInTheWindow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
