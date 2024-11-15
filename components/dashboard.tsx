'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Home, Briefcase, CheckSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"

export function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [assetCounts, setAssetCounts] = useState({
    idle: 0,
    inProgress: 8,
    activated: 23
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          const [idleResponse, casesResponse, activatedResponse] = await Promise.all([
            fetch('http://localhost:8000/api/v1/idle', {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('http://localhost:8000/api/v1/cases', {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('http://localhost:8000/api/v1/activated', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ])

          if (!idleResponse.ok || !casesResponse.ok || !activatedResponse.ok) {
            throw new Error('Failed to fetch assets data')
          }

          const [idleData, casesData, activatedData] = await Promise.all([
            idleResponse.json(),
            casesResponse.json(),
            activatedResponse.json()
          ])
          
          setAssetCounts({
            idle: idleData.length,
            inProgress: casesData.length,
            activated: activatedData.length
          })

          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching assets data:', error)
          setIsLoading(false)
        }
      }
    }
    
    checkAuth()
  }, [router])

  const handleViewIdleAssets = () => {
    router.push('/idle-asset-detail', {
      state: { assets: assetCounts.idle }
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetCard 
            title="閒置資產" 
            icon={<Home className="h-6 w-6" />} 
            count={assetCounts.idle}
            onClick={handleViewIdleAssets}
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