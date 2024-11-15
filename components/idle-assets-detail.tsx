'use client'

import { useState, useEffect } from 'react'
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

type Asset = {
  id: string
  type: string
  agency: string
  district: string
  section: string
  address: string
  coordinates: string
  areaCoordinates: string
  name: string
  createdAt: string
  updatedAt: string
}

const mockAssets: Asset[] = [
  {
    id: '1',
    type: '土地',
    agency: '財政部',
    district: '中正區',
    section: '忠孝段',
    address: '台北市中正區忠孝東路一段1號',
    coordinates: '25.046273, 121.517498',
    areaCoordinates: '25.046273,121.517498;25.046373,121.517598;25.046473,121.517698',
    name: '忠孝東路閒置地',
    createdAt: '2023-01-01',
    updatedAt: '2023-06-15',
  },
  // ... 可以添加更多模擬數據
]

export function IdleAssetsDetailComponent() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setAssets(mockAssets)
  }, [])

  // 在客戶端渲染之前返回 null 或載入中狀態
  if (!isClient) {
    return null
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">閒置資產詳情</h1>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">閒置資產列表</TabsTrigger>
            <TabsTrigger value="add">新增資產</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>資產種類</TableHead>
                  <TableHead>機關</TableHead>
                  <TableHead>行政區</TableHead>
                  <TableHead>地段</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>定位座標</TableHead>
                  <TableHead>區域座標組</TableHead>
                  <TableHead>標的名稱</TableHead>
                  <TableHead>建立時間</TableHead>
                  <TableHead>更新時間</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.agency}</TableCell>
                    <TableCell>{asset.district}</TableCell>
                    <TableCell>{asset.section}</TableCell>
                    <TableCell>{asset.address}</TableCell>
                    <TableCell>{asset.coordinates}</TableCell>
                    <TableCell>{asset.areaCoordinates}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.createdAt}</TableCell>
                    <TableCell>{asset.updatedAt}</TableCell>
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
                  <Label htmlFor="coordinates">定位座標</Label>
                  <Input id="coordinates" placeholder="輸入定位座標" />
                </div>
                <div>
                  <Label htmlFor="areaCoordinates">區域座標組</Label>
                  <Input id="areaCoordinates" placeholder="輸入區域座標組" />
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
  )
}