export enum Role {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  STUDENT = 'student',
  VIEWER = 'viewer'
}

export interface User {
  uuid: string
  email: string
  name?: string
  role: Role
  last_login_at?: Date
  joined_date?: Date
  avatar?: string
  created_at: Date
  updated_at: Date
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: User['role']
}

export interface UpdateUserDto {
  name?: string
  email?: string
  role?: User['role']
}

export interface UserFilters {
  search?: string
  role?: User['role']
  sortBy?: 'name' | 'email' | 'role' | 'joinedDate' | 'lastActive'
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  users: User[]
  count: number
  limit: number
  offset: number
}
