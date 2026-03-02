export interface GuestSession {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}

export interface RequestToken {
  success: boolean;
  expires_at: string;
  request_token: string;
}

export interface UserSession {
  success: boolean;
  session_id: string;
}

export interface UserAccount {
  avatar: Avatar;
  id: number;
  iso_639_1: string; // preferred language
  iso_3166_1: string; // two-char country code
  name: string;
  include_adult: boolean;
  username: string;
}

export interface Avatar {
  gravatar: {
    hash: string;
  };
  tmdb: {
    avatar_path: string;
  };
}
