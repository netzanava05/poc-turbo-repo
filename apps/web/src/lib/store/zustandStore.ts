import { create } from 'zustand'

export type User = {
    id: string
    name: string
    role: string
}

export type AuthState = {
    user: User | null
}

const defaultState: AuthState = {
    user: null,
}

export type AuthAction = {
    setUser: (user: User | null) => void
}

export const createAuthStore = create<AuthState & AuthAction>()((set) => ({
    user: defaultState.user,
    setUser: (user) => set({ user }),
}));

