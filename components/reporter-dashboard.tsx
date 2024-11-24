'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ReporterDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [proposalCount, setProposalCount] = useState(0)

  useEffect(() => {
    const fetchProposalCount = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          const response = await fetch('http://localhost:8000/api/v1/proposals/asset-proposals', {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch proposals data')
          }

          const data = await response.json()
          setProposalCount(data.length)
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching proposals data:', error)
          setIsLoading(false)
        }
      }
    }
    
    fetchProposalCount()
  }, [router])

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="py-6">
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
              count={0}  // 如果有需要也可以加入申請資產的數量統計
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
          前往
        </Button>
      </CardContent>
    </Card>
  )
} 