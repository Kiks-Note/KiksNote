import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {createContext} from "react";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://212.73.217.176:5050/auth/user")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  return (
    <AuthContext.Provider value={{user}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default useAuth;
