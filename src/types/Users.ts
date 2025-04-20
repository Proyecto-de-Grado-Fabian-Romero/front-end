export interface UserState {
  publicId?: string;
  name?: string;
  email?: string;
  phone?: string;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  role?: UserRole;
  photoFileId?: string;
  photoFileName?: string;
  photoFileUrl?: string;
  verified?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export enum UserRole {
  Owner = "Owner",
  Admin = "Admin",
  User = "User",
}
