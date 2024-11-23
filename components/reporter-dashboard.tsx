'use client'

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ReporterDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AssetCard 
              title="提報資產" 
              icon={<Building className="h-6 w-6" />} 
              description="提報閒置資產"
              onClick={() => router.push('/report-asset')}
            />
            <AssetCard 
              title="申請資產需求" 
              icon={<FileText className="h-6 w-6" />} 
              description="申請使用閒置資產"
              onClick={() => router.push('/request-asset')}
            />
          </div>
        </div>
      </main>
    </div>
  )
} 

function AssetCard({ title, icon, description, onClick }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        <Button className="mt-4 w-full" variant="outline" onClick={onClick}>
          前往
        </Button>
      </CardContent>
    </Card>
  )
} 