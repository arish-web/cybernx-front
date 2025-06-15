import { create } from 'zustand';
import { User } from '../types';


interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useStore = create<Store>((set) => {
   const storedUser = sessionStorage.getItem('currentUser');
  const storedToken = sessionStorage.getItem('token');

  return {
    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    setCurrentUser: (user) => {
      if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.removeItem('currentUser');
      }
      set({ currentUser: user });
    },
    token: storedToken || null,
     setToken: (token) => {
      if (token) {
        sessionStorage.setItem('token', token);
      } else {
        sessionStorage.removeItem('token');
      }
      set({ token });
    },
  };
});
