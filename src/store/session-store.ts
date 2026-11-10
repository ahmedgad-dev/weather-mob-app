import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type Session = {
  token: string;
  user: { name: string; email: string };
};

type SessionState = {
  session: Session | null;
  signIn: (session: Session) => void;
  signOut: () => void;
};

// Tokens go in the iOS Keychain / Android Keystore, never AsyncStorage, which is plain text on disk.
const secureStorage: StateStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      signIn: (session) => set({ session }),
      signOut: () => set({ session: null }),
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ session: state.session }),
    }
  )
);

export function useSessionHydrated() {
  return useSyncExternalStore(
    (onChange) => useSessionStore.persist.onFinishHydration(onChange),
    () => useSessionStore.persist.hasHydrated()
  );
}
