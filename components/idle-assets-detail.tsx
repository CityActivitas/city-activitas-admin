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
import { ScrollArea } from "@/components/ui/scroll-area"


type Asset = {
  id: string
  '資產類型': string
  '管理機關': string
  '行政區': string
  '地段': string
  '地址': string
  '標的名稱': string
  '建立時間': string
}

export function IdleAssetsDetailComponent() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // console.log(assets)

  useEffect(() => {
    const fetchIdleAssets = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (!token) {
          router.push('/login')
          return
        }

        try {
          const response = await fetch('http://localhost:8000/api/v1/idle', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch idle assets')
          }

          const data = await response.json()
          setAssets(data)
        } catch (error) {
          console.error('Error fetching idle assets:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchIdleAssets()
  }, [router])

  if (isLoading) {
    return <div>載入中...</div>
  }

  const handleEdit = (id: string) => {
    // 實現編輯邏輯
    console.log(`Editing asset with id: ${id}`)
  }

  const handleDelete = (id: string) => {
    // 實現刪除邏輯
    setAssets(assets.filter(asset => asset.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-4">閒置資產詳情</h1>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">閒置資產列表</TabsTrigger>
              <TabsTrigger value="add">新增資產</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="relative rounded-md border">
                <div className="overflow-auto max-h-[70vh]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-100 z-10 font-bold">
                      <TableRow>
                        <TableHead>資產類型</TableHead>
                        <TableHead>管理機關</TableHead>
                        <TableHead>行政區</TableHead>
                        <TableHead>地段</TableHead>
                        <TableHead>地址</TableHead>
                        <TableHead>標的名稱</TableHead>
                        <TableHead>建立時間</TableHead>
                        <TableHead className="font-bold">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{asset['資產類型']}</TableCell>
                          <TableCell>{asset['管理機關']}</TableCell>
                          <TableCell>{asset['行政區']}</TableCell>
                          <TableCell>{asset['地段']}</TableCell>
                          <TableCell>{asset['地址']}</TableCell>
                          <TableCell>{asset['標的名稱']}</TableCell>
                          <TableCell>{asset['建立時間']}</TableCell>
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
                    <Label htmlFor="type">資產種類</Label>
                    <Input id="type" placeholder="輸入資產種類" />
                  </div>
                  <div>
                    <Label htmlFor="agency">機關</Label>
                    <Input id="agency" placeholder="輸入機關名稱" />
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