'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Home, Briefcase, CheckSquare, Building, FileText } from 'lucide-react'
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
  const [proposalCount, setProposalCount] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          const [idleResponse, casesResponse, activatedResponse, proposalsResponse] = await Promise.all([
            fetch('http://localhost:8000/api/v1/idle', {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('http://localhost:8000/api/v1/cases', {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('http://localhost:8000/api/v1/activated', {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('http://localhost:8000/api/v1/proposals/asset-proposals', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ])

          if (!idleResponse.ok || !casesResponse.ok || !activatedResponse.ok || !proposalsResponse.ok) {
            throw new Error('Failed to fetch data')
          }

          const [idleData, casesData, activatedData, proposalsData] = await Promise.all([
            idleResponse.json(),
            casesResponse.json(),
            activatedResponse.json(),
            proposalsResponse.json()
          ])
          
          setAssetCounts({
            idle: idleData.length,
            inProgress: casesData.length,
            activated: activatedData.length
          })
          setProposalCount(proposalsData.length)
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching data:', error)
          setIsLoading(false)
        }
      }
    }
    
    checkAuth()
  }, [router])

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <AssetCard 
              title="閒置資產" 
              icon={<Home className="h-6 w-6" />} 
              count={assetCounts.idle}
              description="閒置資產總數"
              onClick={() => router.push('/idle-asset-detail')}
            />
            <AssetCard 
              title="進行中案件" 
              icon={<Briefcase className="h-6 w-6" />} 
              count={assetCounts.inProgress}
              description="進行中案件總數"
              onClick={() => router.push('/in-progress-cases-detail')}
            />
            <AssetCard 
              title="已活化資產" 
              icon={<CheckSquare className="h-6 w-6" />} 
              count={assetCounts.activated}
              description="已活化資產總數"
              onClick={() => router.push('/activated-assets-detail')}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssetCard 
              title="提報資產" 
              icon={<Building className="h-6 w-6" />} 
              count={proposalCount}
              description="提報閒置資產"
              onClick={() => router.push('/report-asset')}
            />
            <AssetCard 
              title="申請資產需求" 
              icon={<FileText className="h-6 w-6" />} 
              count={0}
              description="申請使用閒置資產"
              onClick={() => router.push('/request-asset')}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function AssetCard({ title, icon, count, description, onClick }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          總計 {count} 筆資料
        </p>
        <Button className="mt-4 w-full" variant="outline" onClick={onClick}>
          查看詳情
        </Button>
      </CardContent>
    </Card>
  )
}