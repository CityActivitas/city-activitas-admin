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
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          // 獲取提報資產數量
          const proposalResponse = await fetch('http://localhost:8000/api/v1/proposals/asset-proposals', {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          // 獲取資產需求數量
          const requestResponse = await fetch('http://localhost:8000/api/v1/proposals/asset-requirements', {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (!proposalResponse.ok || !requestResponse.ok) {
            throw new Error('Failed to fetch data')
          }

          const proposalData = await proposalResponse.json()
          const requestData = await requestResponse.json()

          setProposalCount(proposalData.length)
          setRequestCount(requestData.length)
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching data:', error)
          setIsLoading(false)
        }
      }
    }
    
    fetchCounts()
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
              count={requestCount}
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