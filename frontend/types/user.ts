export enum Role {
  ADMIN = "ADMIN",
  COLLABORATOR = "COLLABORATOR",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
