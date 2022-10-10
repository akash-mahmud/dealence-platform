import React, { useState, useContext, createContext, useEffect } from "react";
import Axios from "axios";
import { NotificationManager } from 'react-notifications';

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const res = await Axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
              withCredentials: true,
            });
            if (res.data) {
                setUser(res.data);
            } else {
                setUser(null);
            }
            setLoadingUser(false);
        }
        getUser()
    }, [])

    const signin = (username, password, cb) => {
        return Axios({
          method: 'post',
          data: {
            username: username,
            password: password,
          },
          withCredentials: true,
          url: `${process.env.REACT_APP_API_DATA}/user/login`,
        }).then((res) => {
          if (res.data === 'success') {
        
            Axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
              withCredentials: true,
            }).then((res) => {
              setUser(res.data);
              cb();
            });
          } else {
            NotificationManager.error('Email or Password not correct', 'Error');
          }
        });
    };

    const signout = cb => {
        Axios.get(`${process.env.REACT_APP_API_DATA}/user/logout`, {
          withCredentials: true,
        }).then((res) => {
          if (res.data === 'success') {
            setUser(null);
            cb();
          }
        });
    };

    return {
        user,
        loadingUser,
        signin,
        signout
    };
}

