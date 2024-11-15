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

type ActivatedAsset = {
  id: string
  '備註': string | null
  '列入計算': string
  '土地公告現值': number
  '地址': string | null
  '地點說明': string
  '房屋課稅現值': number
  '是否補列': string
  '標的名稱': string | null
  '活化ID': number
  '活化年度': number
  '活化狀態': string
  '活化結束日期': string | null
  '活化開始日期': string
  '用途類型': string
  '管理機關': string | null
  '節流效益': number
  '行政區': string | null
  '補列年度': string | null
  '計畫用途': string
  '資產ID': string | null
  '需求機關': string
}

export function ActivatedAssetsDetailComponent() {
  const [assets, setAssets] = useState<ActivatedAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // console.log(assets)

  useEffect(() => {
    const fetchActivatedAssets = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          const response = await fetch('http://localhost:8000/api/v1/activated', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch activated assets')
          }

          const data = await response.json()
          setAssets(data)
        } catch (error) {
          console.error('Error fetching activated assets:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchActivatedAssets()
  }, [router])

  if (isLoading) {
    return <div>載入中...</div>
  }

  const handleEdit = (id: string) => {
    console.log(`Editing activated asset with id: ${id}`)
  }

  const handleDelete = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-4">已活化資產詳情</h1>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">已活化資產列表</TabsTrigger>
              <TabsTrigger value="add">新增資產</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="relative rounded-md border">
                <div className="overflow-auto max-h-[70vh]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>活化ID</TableHead>
                        <TableHead>活化年度</TableHead>
                        <TableHead>列入計算</TableHead>
                        <TableHead>地點說明</TableHead>
                        <TableHead>用途類型</TableHead>
                        <TableHead>需求機關</TableHead>
                        <TableHead>計畫用途</TableHead>
                        <TableHead>活化開始日期</TableHead>
                        <TableHead>活化結束日期</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((asset, index) => (
                        <TableRow key={asset.id || `asset-${index}`}>
                          <TableCell>{asset['活化ID']}</TableCell>
                          <TableCell>{asset['活化年度']}</TableCell>
                          <TableCell>{asset['列入計算']}</TableCell>
                          <TableCell>{asset['地點說明']}</TableCell>
                          <TableCell>{asset['用途類型']}</TableCell>
                          <TableCell>{asset['需求機關']}</TableCell>
                          <TableCell>{asset['計畫用途']}</TableCell>
                          <TableCell>{asset['活化開始日期']}</TableCell>
                          <TableCell>{asset['活化結束日期'] || '-'}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(asset.id)}>
                              修改
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(asset.id)}>
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
                    <Label htmlFor="type">資產類型</Label>
                    <Input id="type" placeholder="輸入資產類型" />
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
                    <Label htmlFor="name">標的名稱</Label>
                    <Input id="name" placeholder="輸入標的名稱" />
                  </div>
                  <div>
                    <Label htmlFor="activationType">活化方式</Label>
                    <Input id="activationType" placeholder="輸入活化方式" />
                  </div>
                  <div>
                    <Label htmlFor="activationStatus">活化狀態</Label>
                    <Input id="activationStatus" placeholder="輸入活化狀態" />
                  </div>
                </div>
                <Button type="submit">新增資產</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 