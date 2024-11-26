'use client'

import { Button } from "@/components/ui/button"
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type UserData = {
  email: string
  user_metadata?: {
    system_role?: string
  }
  // 其他可能的使用者資料欄位
}

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  const handleTitleClick = () => {
    const dashboardPath = user?.user_metadata?.system_role === 'reporter' 
      ? '/reporter-dashboard' 
      : '/dashboard'
    router.push(dashboardPath)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="container mx-auto px-4">
        <div className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 
              className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
              onClick={handleTitleClick}
            >
              不動產資產管理系統
            </h1>
            {user?.user_metadata?.system_role === 'admin' && (
              <span className="text-sm text-gray-500 mt-2">管理者</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>{user?.email || '使用者'}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> 登出
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 