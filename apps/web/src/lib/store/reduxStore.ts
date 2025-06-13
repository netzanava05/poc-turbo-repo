// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

export type User = {
    id: string
    name: string
    role: string
}

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null },
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload
        },
    },
})

export const { setUser } = authSlice.actions

export const store = configureStore({
    reducer: { auth: authSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
