import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoginPageInTheWindow, setIsLoginPageInTheWindow] = useState(true);
  const [isLogin , setIsLogin] = useState(false)

  return (
    <AuthContext.Provider value={{ isLogin , setIsLogin ,isLoginPageInTheWindow, setIsLoginPageInTheWindow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
