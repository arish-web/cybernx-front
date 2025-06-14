// import { create } from 'zustand';
// import { Job, Application, User } from '../types';

// interface Store {
//   isDarkMode: boolean;
//   toggleDarkMode: () => void;
//   currentUser: User | null;
//   setCurrentUser: (user: User | null) => void;
// }

// export const useStore = create<Store>((set) => ({
//   isDarkMode: false,
//   toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
//   currentUser: null,
//   setCurrentUser: (user) => set({ currentUser: user }),
// }));


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
  const storedUser = localStorage.getItem('currentUser');
  const storedToken = localStorage.getItem('token');

  return {
    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    setCurrentUser: (user) => set({ currentUser: user }),
    token: storedToken || null,
    setToken: (token) => set({ token }),
  };
});
