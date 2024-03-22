import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { fetchUserData } from '../api/user';
import { User } from '../types/user';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | undefined;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [cookies] = useCookies(['__csrf']);

  const getUser = () => {
    fetchUserData()
      .then((res) => {
        console.log(res.data);
        setUser(res.data.profile || undefined);
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
      });
  };

  useEffect(() => {
    // 检查用户是否已登录
    setIsLoggedIn(!!cookies['__csrf']);

    // 如果已登录，则获取用户数据
    if (!!cookies['__csrf']) {
      getUser();
    }
  }, []);

  const login = () => {
    // 设置用户数据和登录状态
    getUser();
    setIsLoggedIn(true);
  };

  const logout = () => {
    // 清空用户数据和登录状态
    setUser(undefined);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
