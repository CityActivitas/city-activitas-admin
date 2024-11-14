'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Home, Briefcase, CheckSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [assetCounts, setAssetCounts] = useState({
    idle: 15,
    inProgress: 8,
    activated: 23
  })

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  if (isLoading) {
    return null
  }

  const handleLogout = () => {
    // 清除儲存的認證資訊
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    
    // 導向回登入頁面
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">不動產資產管理系統</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> 登出
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetCard 
            title="閒置資產" 
            icon={<Home className="h-6 w-6" />} 
            count={assetCounts.idle}
            onClick={() => console.log('查看閒置資產詳情')}
          />
          <AssetCard 
            title="進行中案件" 
            icon={<Briefcase className="h-6 w-6" />} 
            count={assetCounts.inProgress}
            onClick={() => console.log('查看進行中案件詳情')}
          />
          <AssetCard 
            title="已活化資產" 
            icon={<CheckSquare className="h-6 w-6" />} 
            count={assetCounts.activated}
            onClick={() => console.log('查看已活化資產詳情')}
          />
        </div>
      </main>
    </div>
  )
}

function AssetCard({ title, icon, count, onClick }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          總計 {count} 筆資料
        </p>
        <Button className="mt-4 w-full" variant="outline" onClick={onClick}>
          查看詳情
        </Button>
      </CardContent>
    </Card>
  )
}