import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface User {
    id:number;
    name:string;
    email:string;
}

interface AuthState {
    user: User| null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token:null,
    isAuthenticated:false,
    loading: false,
    error:null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{user: User; token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;