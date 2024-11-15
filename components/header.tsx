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

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">不動產資產管理系統</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> 登出
        </Button>
      </div>
    </header>
  )
} 