'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

interface AssetData {
  assetId: string
  assetType: string
  department: string
  district: string
  section: string
  address: string
  coordinates: string
  areaCoordinates: string
  markerName: string
  status: string
  createdAt: string
  updatedAt: string
  buildingId: string
  buildingNumber: string
  buildingType: string
  landArea: string
  usage: string
  landUsage: string
  condition: string
  vacancyRate: string
  note: string
}

interface LandRelationData {
  id: string
  landNumber: string
  landType: string
  landManager: string
  landSection: string
  createdAt: string
  updatedAt: string
}

export function AssetDetail() {
  const [formData, setFormData] = useState<AssetData>({
    assetId: '24',
    assetType: '建物',
    department: '教育局',
    district: '將軍區',
    section: '大丘園段',
    address: '',
    coordinates: '41.40338, 2.17403',
    areaCoordinates: '41.40338, 2.17403',
    markerName: '歸仁市場2,3樓',
    status: '未活化',
    createdAt: '2024-11-23 23:30',
    updatedAt: '2024-11-25 23:30',
    buildingId: '19',
    buildingNumber: '歸仁北段6932建號',
    buildingType: '市有建物',
    landArea: '2樓 3729',
    usage: '市場用地',
    landUsage: '特定目的事業用地',
    condition: '空置',
    vacancyRate: '100',
    note: '2樓空置'
  })

  const [landRelationData, setLandRelationData] = useState<LandRelationData[]>([
    {
      id: '2',
      landNumber: '234',
      landType: '私有土地',
      landManager: '財稅局',
      landSection: '大丘園段',
      createdAt: '2024-11-23 23:30',
      updatedAt: '2024-11-25 23:30'
    },
    {
      id: '3',
      landNumber: '234',
      landType: '私有土地',
      landManager: '財稅局',
      landSection: '大丘園段',
      createdAt: '2024-11-23 23:30',
      updatedAt: '2024-11-25 23:30'
    }
  ])

  const [originalData, setOriginalData] = useState<AssetData>(formData)
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    setIsModified(JSON.stringify(formData) !== JSON.stringify(originalData))
  }, [formData, originalData])

  const handleInputChange = (field: keyof AssetData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Here you would typically make an API call to update the data
    setOriginalData(formData)
    setIsModified(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Link href="/assets" className="hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <Tabs defaultValue="asset-details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="asset-details">資產細項</TabsTrigger>
          <TabsTrigger value="land-relations">建物土地關聯細項</TabsTrigger>
        </TabsList>
        <TabsContent value="asset-details">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>資產ID</Label>
                    <Input 
                      value={formData.assetId}
                      onChange={(e) => handleInputChange('assetId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>資產種類</Label>
                    <Input 
                      value={formData.assetType}
                      onChange={(e) => handleInputChange('assetType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>管理機關</Label>
                    <Input 
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>行政區</Label>
                    <Input 
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>地段</Label>
                    <Input 
                      value={formData.section}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>地址</Label>
                    <Input 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>定位座標</Label>
                    <Input 
                      value={formData.coordinates}
                      onChange={(e) => handleInputChange('coordinates', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>區域座標組</Label>
                    <Input 
                      value={formData.areaCoordinates}
                      onChange={(e) => handleInputChange('areaCoordinates', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>標的名稱</Label>
                    <Input 
                      value={formData.markerName}
                      onChange={(e) => handleInputChange('markerName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>狀態</Label>
                    <Input 
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>建立時間</Label>
                    <Input 
                      value={formData.createdAt}
                      onChange={(e) => handleInputChange('createdAt', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>修改時間</Label>
                    <Input 
                      value={formData.updatedAt}
                      onChange={(e) => handleInputChange('updatedAt', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>建物ID</Label>
                    <Input 
                      value={formData.buildingId}
                      onChange={(e) => handleInputChange('buildingId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>建號</Label>
                    <Input 
                      value={formData.buildingNumber}
                      onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>建物種類</Label>
                    <Input 
                      value={formData.buildingType}
                      onChange={(e) => handleInputChange('buildingType', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>樓地板面積</Label>
                    <Input 
                      value={formData.landArea}
                      onChange={(e) => handleInputChange('landArea', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>使用分區</Label>
                    <Input 
                      value={formData.usage}
                      onChange={(e) => handleInputChange('usage', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>土地用途</Label>
                    <Input 
                      value={formData.landUsage}
                      onChange={(e) => handleInputChange('landUsage', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>現況</Label>
                    <Input 
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>空置比例</Label>
                    <Input 
                      value={formData.vacancyRate}
                      onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>備註</Label>
                    <Input 
                      value={formData.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFormData(originalData)}
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!isModified}
                  >
                    修改
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="land-relations">
          <Card>
            <CardContent className="p-4 space-y-4">
              {landRelationData.map((land, index) => (
                <div key={land.id} className="grid grid-cols-2 gap-4 pb-4 border-b last:border-b-0">
                  <div className="space-y-2">
                    <Label>建物土地關聯ID</Label>
                    <Input value={land.id} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>地號</Label>
                    <Input value={land.landNumber} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>土地種類</Label>
                    <Input value={land.landType} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>土地管理者</Label>
                    <Input value={land.landManager} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>地段</Label>
                    <Input value={land.landSection} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>建立時間</Label>
                    <Input value={land.createdAt} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>修改時間</Label>
                    <Input value={land.updatedAt} readOnly />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="outline">修改</Button>
                    <Button variant="destructive" className="ml-2">刪除</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}