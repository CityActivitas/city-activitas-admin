'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AgenciesDrawerComponent } from "@/components/agencies-drawer"
import { DistrictSelectorDrawerComponent } from "@/components/district-selector-drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OneInProgressCaseDetailProps {
  caseId: string
  onBack: () => void
  caseData: any
  onUpdateSuccess: () => void
}

export function OneInProgressCaseDetail({ 
  caseId, 
  onBack, 
  caseData, 
  onUpdateSuccess 
}: OneInProgressCaseDetailProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState(caseData)
  const originalData = caseData
  const isModified = JSON.stringify(formData) !== JSON.stringify(originalData)

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/v1/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('更新失敗')

      toast({
        title: "更新成功",
        description: "案件資料已成功更新",
      })

      onUpdateSuccess()
      onBack()
    } catch (error) {
      console.error('更新錯誤:', error)
      toast({
        variant: "destructive",
        title: "更新失敗",
        description: "更新資料時發生錯誤，請稍後再試",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Button 
          onClick={onBack} 
          variant="ghost"
          className="hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>回案件列表</span>
        </Button>
      </div>

      <Tabs defaultValue="case-details" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="case-details">案件詳情</TabsTrigger>
        </TabsList>
        <TabsContent value="case-details">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>案件ID</Label>
                    <Input value={formData['案件ID']} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>案件名稱</Label>
                    <Input 
                      value={formData['案件名稱']} 
                      onChange={(e) => handleInputChange('案件名稱', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>案件狀態</Label>
                    <Input 
                      value={formData['案件狀態']} 
                      onChange={(e) => handleInputChange('案件狀態', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>管理機關</Label>
                    <AgenciesDrawerComponent 
                      currentUnit={formData['管理機關']}
                      onUnitSelect={(unit) => handleInputChange('管理機關', unit.name)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>行政區</Label>
                    <DistrictSelectorDrawerComponent 
                      currentDistrict={formData['行政區']}
                      onDistrictSelect={(district) => handleInputChange('行政區', district.name)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>地址</Label>
                    <Input 
                      value={formData['地址']} 
                      onChange={(e) => handleInputChange('地址', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>活化目標說明</Label>
                    <Input 
                      value={formData['活化目標說明']} 
                      onChange={(e) => handleInputChange('活化目標說明', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>活化目標類型</Label>
                    <Input 
                      value={formData['活化目標類型']} 
                      onChange={(e) => handleInputChange('活化目標類型', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>任務總數</Label>
                    <Input value={formData['任務總數']} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>已完成任務數</Label>
                    <Input value={formData['已完成任務數']} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>建立時間</Label>
                    <Input value={formData['建立時間']} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>更新時間</Label>
                    <Input value={formData['更新時間']} readOnly />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFormData(originalData)}
                    disabled={!isModified}
                  >
                    取消
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button disabled={!isModified}>
                        修改
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>確認修改</DialogTitle>
                        <DialogDescription>
                          修改後的資料如下：
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        {Object.entries(formData).map(([key, value]) => {
                          const isModified = originalData[key] !== value;
                          return (
                            <div key={key} className="flex">
                              <span className="w-32 flex-shrink-0">{key}:</span>
                              <span className={`${isModified ? "font-bold text-red-500" : ""}`}>
                                {value || '無'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">取消</Button>
                        </DialogClose>
                        <Button onClick={handleSubmit}>確認修改</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 