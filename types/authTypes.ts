export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: number;
    email?: string;
    username?: string;
    rating: number;
  } | null;
  access_token?: string | null;
  loading: boolean;
  error: string | null;
}

export interface PlayerInfo {
  id?: number | null;
  username?: string | null;
}

export interface PlayerInforHistory extends PlayerInfo {
  rating: number;
  color: "w" | "b";
}
