'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"

type Case = {
  id: string
  '任務總數': string
  '地址': string
  '已完成任務數': string
  '建立時間': string
  '更新時間': string
  '最新會議結論': string | null
  '案件ID': string
  '案件名稱': string
  '案件狀態': string
  '標的名稱': string
  '活化目標說明': string
  '活化目標類型': string
  '管理機關': string
  '行政區': string
  '資產類型': string
}

export function InProgressCasesDetailComponent() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // console.log(cases)

  useEffect(() => {
    const fetchCases = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          const response = await fetch('http://localhost:8000/api/v1/cases', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch cases')
          }

          const data = await response.json()
          setCases(data)
        } catch (error) {
          console.error('Error fetching cases:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCases()
  }, [router])

  if (isLoading) {
    return <div>載入中...</div>
  }

  const handleEdit = (id: string) => {
    console.log(`Editing case with id: ${id}`)
  }

  const handleDelete = (id: string) => {
    setCases(cases.filter(case_ => case_.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-4">進行中案件詳情</h1>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">案件列表</TabsTrigger>
              <TabsTrigger value="add">新增案件</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="relative rounded-md border">
                <div className="overflow-auto max-h-[70vh]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-100 z-10 font-bold">
                      <TableRow>
                        <TableHead>案件ID</TableHead>
                        <TableHead>案件狀態</TableHead>
                        <TableHead>活化目標說明</TableHead>
                        <TableHead>活化目標類型</TableHead>
                        <TableHead>任務總數</TableHead>
                        <TableHead>已完成任務數</TableHead>
                        <TableHead>建立時間</TableHead>
                        <TableHead>更新時間</TableHead>
                        <TableHead className="font-bold">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cases.map((caseItem, index) => (
                        <TableRow key={`${caseItem.id}-${index}`}>
                          <TableCell>{caseItem['案件ID']}</TableCell>
                          <TableCell>{caseItem['案件狀態']}</TableCell>
                          <TableCell>{caseItem['活化目標說明']}</TableCell>
                          <TableCell>{caseItem['活化目標類型']}</TableCell>
                          <TableCell>{caseItem['任務總數']}</TableCell>
                          <TableCell>{caseItem['已完成任務數']}</TableCell>
                          <TableCell>{caseItem['建立時間']}</TableCell>
                          <TableCell>{caseItem['更新時間']}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(caseItem.id)}>
                              修改
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(caseItem.id)}>
                              刪除
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="add">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taskNumber">任務編號</Label>
                    <Input id="taskNumber" placeholder="輸入任務編號" />
                  </div>
                  <div>
                    <Label htmlFor="caseName">案件名稱</Label>
                    <Input id="caseName" placeholder="輸入案件名稱" />
                  </div>
                  <div>
                    <Label htmlFor="status">案件狀態</Label>
                    <Input id="status" placeholder="輸入案件狀態" />
                  </div>
                  <div>
                    <Label htmlFor="location">標的位置</Label>
                    <Input id="location" placeholder="輸入標的位置" />
                  </div>
                  <div>
                    <Label htmlFor="target">活化目標說明</Label>
                    <Input id="target" placeholder="輸入活化目標說明" />
                  </div>
                  <div>
                    <Label htmlFor="targetType">活化目標類型</Label>
                    <Input id="targetType" placeholder="輸入活化目標類型" />
                  </div>
                  <div>
                    <Label htmlFor="agency">管理機關</Label>
                    <Input id="agency" placeholder="輸入管理機關" />
                  </div>
                  <div>
                    <Label htmlFor="district">行政區</Label>
                    <Input id="district" placeholder="輸入行政區" />
                  </div>
                  <div>
                    <Label htmlFor="assetType">資產類型</Label>
                    <Input id="assetType" placeholder="輸入資產類型" />
                  </div>
                </div>
                <Button type="submit">新增案件</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 