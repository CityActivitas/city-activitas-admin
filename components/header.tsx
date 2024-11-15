'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  const handleTitleClick = () => {
    router.push('/dashboard')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="container mx-auto px-4">
        <div className="py-6 flex justify-between items-center">
          <h1 
            className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={handleTitleClick}
          >
            不動產資產管理系統
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> 登出
          </Button>
        </div>
      </div>
    </header>
  )
} 