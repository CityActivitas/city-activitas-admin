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
  '案件編號': string
  '案件名稱': string
  '管理機關': string
  '行政區': string
  '地段': string
  '地址': string
  '處理進度': string
  '建立時間': string
}

export function InProgressCasesDetailComponent() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件編號</TableHead>
                    <TableHead>案件名稱</TableHead>
                    <TableHead>管理機關</TableHead>
                    <TableHead>行政區</TableHead>
                    <TableHead>地段</TableHead>
                    <TableHead>地址</TableHead>
                    <TableHead>處理進度</TableHead>
                    <TableHead>建立時間</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem['案件編號']}</TableCell>
                      <TableCell>{caseItem['案件名稱']}</TableCell>
                      <TableCell>{caseItem['管理機關']}</TableCell>
                      <TableCell>{caseItem['行政區']}</TableCell>
                      <TableCell>{caseItem['地段']}</TableCell>
                      <TableCell>{caseItem['地址']}</TableCell>
                      <TableCell>{caseItem['處理進度']}</TableCell>
                      <TableCell>{caseItem['建立時間']}</TableCell>
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
            </TabsContent>
            <TabsContent value="add">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caseNumber">案件編號</Label>
                    <Input id="caseNumber" placeholder="輸入案件編號" />
                  </div>
                  <div>
                    <Label htmlFor="caseName">案件名稱</Label>
                    <Input id="caseName" placeholder="輸入案件名稱" />
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
                    <Label htmlFor="section">地段</Label>
                    <Input id="section" placeholder="輸入地段" />
                  </div>
                  <div>
                    <Label htmlFor="address">地址</Label>
                    <Input id="address" placeholder="輸入地址" />
                  </div>
                  <div>
                    <Label htmlFor="progress">處理進度</Label>
                    <Input id="progress" placeholder="輸入處理進度" />
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