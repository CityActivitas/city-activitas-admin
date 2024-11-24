'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface ProposalAsset {
  id: string
  target_name: string | null
  agency_id: string
  district_id: string
  section: string
  address: string
  reporter_email: string
  proposal_status: string
  created_at: string
  coordinates: string
  has_usage_license: string
  has_building_license: string
  land_type: string
  zone_type: string
  land_use: string
  area: string
  floor_area: string | null
  usage_description: string
  usage_status: string
  activation_status: string
  estimated_activation_date: string | null
  is_requesting_delisting: boolean
  delisting_reason: string | null
  note: string | null
  lot_number: string
  updated_at: string
  reviewer_id: string | null
  reviewer_note: string | null
}

interface OneProposalAssetDetailProps {
  proposal: ProposalAsset
  onBack: () => void
  agencyMap: Record<string, string>
  districtMap: Record<string, string>
}

export function OneProposalAssetDetail({ 
  proposal: initialProposal,
  onBack,
  agencyMap,
  districtMap
}: OneProposalAssetDetailProps) {
  const { toast } = useToast()
  const [proposal, setProposal] = useState(initialProposal)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(initialProposal)

  // 從 localStorage 獲取用戶角色
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.user_metadata?.system_role

  // 判斷欄位是否可以編輯
  const canEdit = (fieldName: string) => {
    // 這些欄位永遠不能編輯
    const nonEditableFields = ['id', 'reporter_email', 'created_at', 'updated_at', 'reviewed_at']
    if (nonEditableFields.includes(fieldName)) return false

    if (userRole === 'admin') return true
    
    if (userRole === 'reporter') {
      if (fieldName === 'reviewer_note') return false
      return ['提案中', '需要修改'].includes(proposal.proposal_status)
    }

    return false
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData(proposal)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedData(proposal)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/v1/proposals/${proposal.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData)
      })

      if (!response.ok) throw new Error('更新失敗')

      const updatedProposal = await response.json()
      setProposal(updatedProposal)
      setIsEditing(false)
      
      toast({
        title: "更新成功",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "更新失敗",
        variant: "destructive",
      })
    }
  }

  const handleFieldChange = (fieldName: string, value: string | boolean) => {
    setEditedData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  // 格式化日期時間
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
    }).replace(/\//g, '-')
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
          (userRole === 'reporter' && ['提案中', '需要修改'].includes(proposal.proposal_status))) && (
          <div className="space-x-2">
            {!isEditing ? (
              <Button onClick={handleEdit}>編輯</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>取消</Button>
                <Button onClick={handleSave}>儲存</Button>
              </>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              // 基本資訊
              'id',
              'managing_agency',
              'target_name',
              'district',
              'section',
              'lot_number',
              'address',
              'coordinates',
              
              // 執照資訊
              'has_usage_license',
              'has_building_license',
              
              // 土地資訊
              'land_type',
              'zone_type',
              'land_use',
              
              // 面積資訊
              'area',
              'floor_area',
              
              // 使用狀態
              'usage_description',
              'usage_status',
              'activation_status',
              'estimated_activation_date',
              
              // 列管資訊
              'is_requesting_delisting',
              'delisting_reason',
              
              // 備註與其他資訊
              'note',
              'reporter_email',
              'proposal_status',
              'reviewer_note',
              'created_at',
              'updated_at',
              'reviewed_at'
            ]
              .filter(key => {
                if (userRole === 'admin') {
                  return key !== 'reviewer_id'
                } else if (userRole === 'reporter') {
                  return !['reviewer_id', 'reporter_email'].includes(key)
                }
                return true
              })
              .map(key => {
                const value = proposal[key]
                let displayValue = value

                if (key === 'agency_id') {
                  displayValue = agencyMap[value] || value
                } else if (key === 'district_id') {
                  displayValue = districtMap[value] || value
                } else if (['created_at', 'updated_at', 'reviewed_at'].includes(key)) {
                  displayValue = formatDateTime(value)
                }

                const label = {
                  id: '提案編號',
                  managing_agency: '管理機關',
                  target_name: '標的名稱',
                  district: '行政區',
                  section: '地段',
                  lot_number: '地號',
                  address: '地址',
                  coordinates: '座標',
                  has_usage_license: '使用執照',
                  has_building_license: '建築執照',
                  land_type: '土地種類',
                  zone_type: '使用分區',
                  land_use: '土地用途',
                  area: '面積（平方公尺）',
                  floor_area: '樓地板面積（平方公尺）',
                  usage_description: '使用情形說明',
                  usage_status: '使用狀態',
                  activation_status: '活化辦理情形',
                  estimated_activation_date: '預估活化時程',
                  is_requesting_delisting: '是否申請解除列管',
                  delisting_reason: '解除列管原因',
                  note: '備註',
                  reporter_email: '提報人信箱',
                  proposal_status: '提案狀態',
                  reviewer_note: '審查備註',
                  created_at: '提報時間',
                  updated_at: '更新時間',
                  reviewed_at: '審查時間'
                }[key] || key

                return (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      value={isEditing ? editedData[key] || '' : displayValue || ''}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      readOnly={!isEditing || !canEdit(key)}
                      className={(!isEditing || !canEdit(key)) ? 'bg-gray-50' : ''}
                    />
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 