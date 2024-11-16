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
import { FilterBlock } from '@/components/filter-block'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { FilterSummary } from '@/components/filter-summary'

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

type SortConfig = {
  key: keyof Asset | null
  direction: 'asc' | 'desc'
}

export function IdleAssetsDetailComponent() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>(['building', 'land'])
  const [isAssetIncluded, setIsAssetIncluded] = useState(true)
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([])
  const [isAgencyIncluded, setIsAgencyIncluded] = useState(true)
  const [isDistrictIncluded, setIsDistrictIncluded] = useState(true)
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })

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

  // 獲取唯一的管理機關和行政區列表
  const uniqueAgencies = Array.from(new Set(assets.map(asset => asset['管理機關'])))
  const uniqueDistricts = Array.from(new Set(assets.map(asset => asset['行政區'])))

  const handleFilterChange = ({ 
    searchText, 
    isAssetIncluded, 
    selectedAssetTypes,
    isAgencyIncluded,
    selectedAgencies,
    isDistrictIncluded,
    selectedDistricts
  }: {
    searchText: string
    isAssetIncluded: boolean
    selectedAssetTypes: string[]
    isAgencyIncluded: boolean
    selectedAgencies: string[]
    isDistrictIncluded: boolean
    selectedDistricts: string[]
  }) => {
    setSearchText(searchText)
    setIsAssetIncluded(isAssetIncluded)
    setSelectedAssetTypes(selectedAssetTypes)
    setIsAgencyIncluded(isAgencyIncluded)
    setSelectedAgencies(selectedAgencies)
    setIsDistrictIncluded(isDistrictIncluded)
    setSelectedDistricts(selectedDistricts)
  }

  // 修改過濾邏輯
  const filteredAssets = assets.filter(asset => {
    // 文字搜尋過濾
    const searchResult = searchText === '' || 
      Object.values(asset).some(value => 
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      )

    // 資產類型過濾
    const assetType = asset['資產類型']
    const isBuilding = assetType.includes('建物')
    const isLand = assetType.includes('土地')
    const matchesType = (
      (isBuilding && selectedAssetTypes.includes('building')) ||
      (isLand && selectedAssetTypes.includes('land'))
    )
    const assetTypeResult = isAssetIncluded ? matchesType : !matchesType

    // 管理機關過濾
    const matchesAgency = selectedAgencies.length === 0 || 
      selectedAgencies.includes(asset['管理機關'])
    const agencyResult = isAgencyIncluded ? matchesAgency : !matchesAgency

    // 行政區過濾
    const matchesDistrict = selectedDistricts.length === 0 || 
      selectedDistricts.includes(asset['行政區'])
    const districtResult = isDistrictIncluded ? matchesDistrict : !matchesDistrict

    return searchResult && assetTypeResult && agencyResult && districtResult
  })

  const handleSort = (key: keyof Asset) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortedAssets = (assets: Asset[]) => {
    if (!sortConfig.key) return assets

    return [...assets].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]

      if (sortConfig.key === '建立時間') {
        const aDate = new Date(aValue).getTime()
        const bDate = new Date(bValue).getTime()
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const sortedAssets = getSortedAssets(filteredAssets)

  const SortIcon = ({ columnKey }: { columnKey: keyof Asset }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <ChevronUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      )
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
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
              <FilterBlock 
                onFilterChange={handleFilterChange} 
                agencies={uniqueAgencies}
                districts={uniqueDistricts}
              />
              <FilterSummary 
                isAssetIncluded={isAssetIncluded}
                selectedAssetTypes={selectedAssetTypes}
                isAgencyIncluded={isAgencyIncluded}
                selectedAgencies={selectedAgencies}
                isDistrictIncluded={isDistrictIncluded}
                selectedDistricts={selectedDistricts}
              />
              <div className="relative rounded-md border mt-2">
                <div className="overflow-y-scroll max-h-[70vh]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-100 z-10">
                      <TableRow>
                        {[
                          ['資產類型', '資產類型'],
                          ['管理機關', '管理機關'],
                          ['行政區', '行政區'],
                          ['地段', '地段'],
                          ['地址', '地址'],
                          ['標的名稱', '標的名稱'],
                          ['建立時間', '建立時間']
                        ].map(([label, key]) => (
                          <TableHead 
                            key={key}
                            className="group cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSort(key as keyof Asset)}
                          >
                            <div className="flex items-center gap-1">
                              {label}
                              <SortIcon columnKey={key as keyof Asset} />
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell>{asset['資產類型']}</TableCell>
                          <TableCell>{asset['管理機關']}</TableCell>
                          <TableCell>{asset['行政區']}</TableCell>
                          <TableCell>{asset['地段']}</TableCell>
                          <TableCell>{asset['地址']}</TableCell>
                          <TableCell>{asset['標的名稱']}</TableCell>
                          <TableCell>
                            {new Date(asset['建立時間']).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\//g, '-')}
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