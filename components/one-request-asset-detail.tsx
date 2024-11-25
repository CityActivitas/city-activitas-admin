'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AssetRequest {
  id: string
  managing_agency: string
  agency_id: string
  purpose: string
  asset_type: "土地" | "建物"
  preferred_floor?: string
  area: number
  district: string
  district_id: string
  urgency_note: string
  funding_source: string
  requirement_status: string
  created_at: string
  reporter_email: string
}

interface OneRequestAssetDetailProps {
  request: AssetRequest
  onBack: () => void
  agencyMap: Record<string, string>
  districtMap: Record<string, string>
}

export function OneRequestAssetDetail({ 
  request: initialRequest,
  onBack,
  agencyMap,
  districtMap
}: OneRequestAssetDetailProps) {
  const { toast } = useToast()
  const [request, setRequest] = useState({
    ...initialRequest,
    managing_agency: agencyMap[initialRequest.agency_id] || initialRequest.managing_agency,
    district: districtMap[initialRequest.district_id] || initialRequest.district
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    ...initialRequest,
    managing_agency: agencyMap[initialRequest.agency_id] || initialRequest.managing_agency,
    district: districtMap[initialRequest.district_id] || initialRequest.district
  })

  // 從 localStorage 獲取用戶角色
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.user_metadata?.system_role

  // 判斷欄位是否可以編輯
  const canEdit = (fieldName: string) => {
    const nonEditableFields = ['id', 'reporter_email', 'created_at']
    if (nonEditableFields.includes(fieldName)) return false

    if (userRole === 'admin') return true
    
    if (userRole === 'reporter') {
      return ['提案中', '需要修改'].includes(request.requirement_status)
    }

    return false
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData({
      ...request,
      managing_agency: agencyMap[request.agency_id] || request.managing_agency,
      district: districtMap[request.district_id] || request.district
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedData(request)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/v1/proposals/asset-requirements/${request.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData)
      })

      if (!response.ok) throw new Error('更新失敗')

      const updatedRequest = await response.json()
      setRequest(updatedRequest)
      setIsEditing(false)
      
      toast({
        title: "更新成功",
        description: "資料已成功更新",
        variant: "default",
      })

      onBack()
      
    } catch (error) {
      console.error('更新錯誤:', error)
      toast({
        title: "更新失敗",
        description: "更新資料時發生錯誤，請稍後再試",
        variant: "destructive",
      })
    }
  }

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setEditedData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
      .replace(/\//g, '-')
      .replace(/,/g, '')
  }

  return (
    <div className="container mx-auto px-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack} 
          variant="ghost"
          className="hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </Button>
        {(userRole === 'admin' || 
          (userRole === 'reporter' && ['提案中', '需要修改'].includes(request.requirement_status))) && (
          <div className="space-x-2">
            {!isEditing ? (
              <Button onClick={handleEdit}>編輯</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>取消</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>儲存</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>確認修改</DialogTitle>
                      <DialogDescription>
                        修改後的資料如下：
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      {Object.entries(editedData).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2">
                          <span className="font-medium">{key}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">取消</Button>
                      </DialogClose>
                      <Button onClick={handleSave}>確認修改</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              'id',
              'managing_agency',
              'purpose',
              'asset_type',
              'preferred_floor',
              'area',
              'district',
              'urgency_note',
              'funding_source',
              'requirement_status',
              'reporter_email',
              'created_at'
            ].map(key => {
              const value = request[key]
              let displayValue = value

              if (key === 'created_at') {
                displayValue = formatDateTime(value)
              }

              const label = {
                id: '需求編號',
                managing_agency: '需求機關',
                purpose: '需求用途',
                asset_type: '資產類型',
                preferred_floor: '希望樓層',
                area: '需求面積（平方公尺）',
                district: '希望地點',
                urgency_note: '急迫性說明',
                funding_source: '經費來源',
                requirement_status: '需求狀態',
                reporter_email: '申請人信箱',
                created_at: '申請時間'
              }[key] || key

              return (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  {key === 'requirement_status' ? (
                    <div className="space-y-2">
                      {isEditing && canEdit(key) ? (
                        <Select
                          value={editedData.requirement_status}
                          onValueChange={(value) => handleFieldChange('requirement_status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇需求狀態" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="提案中">提案中</SelectItem>
                            <SelectItem value="需要修改">需要修改</SelectItem>
                            <SelectItem value="不執行">不執行</SelectItem>
                            <SelectItem value="已核准">已核准</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={request.requirement_status || ''}
                          readOnly
                          className="bg-gray-50"
                        />
                      )}
                    </div>
                  ) : (
                    <Input
                      value={isEditing ? editedData[key] || '' : displayValue || ''}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      readOnly={!isEditing || !canEdit(key)}
                      className={(!isEditing || !canEdit(key)) ? 'bg-gray-50' : ''}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 