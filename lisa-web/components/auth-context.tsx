"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  isSystemAdmin: boolean
  groups: {
    id: string
    name: string
    role: "group_admin" | "user"
  }[]
}

interface AuthContextType {
  user: User | null
  selectedGroup: { id: string; name: string; role: "group_admin" | "user" } | null
  isLoading: boolean
  login: (userId: string, password: string) => Promise<void>
  logout: () => Promise<void>
  selectGroup: (groupId: string) => void
  clearSelectedGroup: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: Record<string, User> = {
  admin: {
    id: "admin",
    name: "Admin User",
    email: "admin@company.com",
    isSystemAdmin: true,
    groups: [],
  },
  john: {
    id: "john",
    name: "John Doe",
    email: "john@company.com",
    isSystemAdmin: false,
    groups: [
      { id: "group-1", name: "営業部", role: "group_admin" },
      { id: "group-2", name: "開発部", role: "user" },
    ],
  },
  jane: {
    id: "jane",
    name: "Jane Smith",
    email: "jane@company.com",
    isSystemAdmin: false,
    groups: [{ id: "group-1", name: "営業部", role: "user" }],
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string
    name: string
    role: "group_admin" | "user"
  } | null>(null)
  const router = useRouter()

  const login = async (userId: string, _password: string) => {
    const foundUser = mockUsers[userId]
    if (foundUser) {
      setUser(foundUser)
    }
  }

  const logout = async () => {
    setUser(null)
    setSelectedGroup(null)
    sessionStorage.removeItem("selectedGroupId")
    router.push("/login") // Redirect to login page after logout
  }

  const selectGroup = (groupId: string) => {
    if (!user) return

    const group = user.groups.find((g) => g.id === groupId)
    if (group) {
      setSelectedGroup(group)
      sessionStorage.setItem("selectedGroupId", groupId)
    }
  }

  const clearSelectedGroup = () => {
    setSelectedGroup(null)
    sessionStorage.removeItem("selectedGroupId")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedGroup,
        isLoading: false,
        login,
        logout,
        selectGroup,
        clearSelectedGroup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
