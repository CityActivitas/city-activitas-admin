'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OneInProgressCaseDetail } from './one-in-progress-case-detail'

interface SortConfig {
  key: keyof Case | null
  direction: 'asc' | 'desc'
}

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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })
  const [searchText, setSearchText] = useState('')
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const router = useRouter()

  // 獲取案件列表
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

        if (!response.ok) throw new Error('Failed to fetch cases')
        const data = await response.json()
        setCases(data)
      } catch (error) {
        console.error('Error fetching cases:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchCases()
  }, [router])

  // 處理排序
  const handleSort = (key: keyof Case) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // 排序邏輯
  const getSortedCases = (cases: Case[]) => {
    if (!sortConfig.key) return cases

    return [...cases].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]

      if (['建立時間', '更新時間'].includes(sortConfig.key)) {
        const aDate = new Date(aValue).getTime()
        const bDate = new Date(bValue).getTime()
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // 過濾邏輯
  const filteredCases = cases.filter(caseItem => 
    searchText === '' || 
    Object.values(caseItem).some(value => 
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  const sortedCases = getSortedCases(filteredCases)

  // 修改處理行點擊的函數
  const handleRowClick = (caseItem: Case) => {
    // console.log('Selected case:', caseItem); // 用於調試
    setSelectedCase(caseItem);
  };

  if (isLoading) return <div>載入中...</div>

  // 如果有選中的案件，顯示詳情頁面
  if (selectedCase) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 pt-24">
          <OneInProgressCaseDetail 
            caseId={selectedCase.id}
            onBack={() => setSelectedCase(null)}
            caseData={selectedCase}
            onUpdateSuccess={fetchCases}
          />
        </div>
      </div>
    );
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
              <div className="space-y-4">
                {/* 搜尋欄位 */}
                <div className="flex gap-2">
                  <Input
                    placeholder="搜尋案件..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {/* 表格 */}
                <div className="relative rounded-md border">
                  <div className="overflow-auto max-h-[70vh]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gray-100 z-10">
                        <TableRow>
                          {[
                            '案件ID', '案件狀態', '活化目標說明', '活化目標類型',
                            '任務總數', '已完成任務數', '建立時間', '更新時間'
                          ].map((header) => (
                            <TableHead 
                              key={header}
                              className="cursor-pointer hover:bg-gray-200"
                              onClick={() => handleSort(header as keyof Case)}
                            >
                              {header}
                              {sortConfig.key === header && (
                                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedCases.map((caseItem) => (
                          <TableRow 
                            key={caseItem.id || caseItem['案件ID']}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleRowClick(caseItem)}
                          >
                            <TableCell>{caseItem['案件ID']}</TableCell>
                            <TableCell>{caseItem['案件狀態']}</TableCell>
                            <TableCell>{caseItem['活化目標說明']}</TableCell>
                            <TableCell>{caseItem['活化目標類型']}</TableCell>
                            <TableCell>{caseItem['任務總數']}</TableCell>
                            <TableCell>{caseItem['已完成任務數']}</TableCell>
                            <TableCell>{caseItem['建立時間']}</TableCell>
                            <TableCell>{caseItem['更新時間']}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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