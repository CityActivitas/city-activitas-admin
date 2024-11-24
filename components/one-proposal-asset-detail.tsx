'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'

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
  proposal,
  onBack,
  agencyMap,
  districtMap
}: OneProposalAssetDetailProps) {
  return (
    <div className="container mx-auto px-4 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Button 
          onClick={onBack} 
          variant="ghost"
          className="hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>回提案列表</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 基本資訊 */}
            <div className="space-y-2">
              <Label>提案編號</Label>
              <Input value={proposal.id} readOnly />
            </div>
            <div className="space-y-2">
              <Label>標的名稱</Label>
              <Input value={proposal.target_name || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>管理機關</Label>
              <Input value={agencyMap[proposal.agency_id] || proposal.agency_id} readOnly />
            </div>
            <div className="space-y-2">
              <Label>行政區</Label>
              <Input value={districtMap[proposal.district_id] || proposal.district_id} readOnly />
            </div>
            <div className="space-y-2">
              <Label>地段</Label>
              <Input value={proposal.section} readOnly />
            </div>
            <div className="space-y-2">
              <Label>地號</Label>
              <Input value={proposal.lot_number} readOnly />
            </div>
            <div className="space-y-2">
              <Label>地址</Label>
              <Input value={proposal.address} readOnly />
            </div>
            <div className="space-y-2">
              <Label>座標</Label>
              <Input value={proposal.coordinates} readOnly />
            </div>

            {/* 執照資訊 */}
            <div className="space-y-2">
              <Label>使用執照</Label>
              <Input value={proposal.has_usage_license} readOnly />
            </div>
            <div className="space-y-2">
              <Label>建築執照</Label>
              <Input value={proposal.has_building_license} readOnly />
            </div>

            {/* 土地資訊 */}
            <div className="space-y-2">
              <Label>土地種類</Label>
              <Input value={proposal.land_type} readOnly />
            </div>
            <div className="space-y-2">
              <Label>使用分區</Label>
              <Input value={proposal.zone_type} readOnly />
            </div>
            <div className="space-y-2">
              <Label>土地用途</Label>
              <Input value={proposal.land_use} readOnly />
            </div>

            {/* 面積資訊 */}
            <div className="space-y-2">
              <Label>面積（平方公尺）</Label>
              <Input value={proposal.area} readOnly />
            </div>
            <div className="space-y-2">
              <Label>樓地板面積</Label>
              <Input value={proposal.floor_area || ''} readOnly />
            </div>

            {/* 使用狀態 */}
            <div className="space-y-2">
              <Label>目前使用情形說明</Label>
              <Input value={proposal.usage_description} readOnly />
            </div>
            <div className="space-y-2">
              <Label>資產使用情形</Label>
              <Input value={proposal.usage_status} readOnly />
            </div>
            <div className="space-y-2">
              <Label>活化辦理情形</Label>
              <Input value={proposal.activation_status} readOnly />
            </div>
            <div className="space-y-2">
              <Label>預估活化時程</Label>
              <Input value={proposal.estimated_activation_date || ''} readOnly />
            </div>

            {/* 列管狀態 */}
            <div className="space-y-2">
              <Label>是否申請解除列管</Label>
              <Input value={proposal.is_requesting_delisting ? '是' : '否'} readOnly />
            </div>
            <div className="space-y-2">
              <Label>解除列管原因</Label>
              <Input value={proposal.delisting_reason || ''} readOnly />
            </div>

            {/* 其他資訊 */}
            <div className="space-y-2">
              <Label>提報人信箱</Label>
              <Input value={proposal.reporter_email} readOnly />
            </div>
            <div className="space-y-2">
              <Label>提案狀態</Label>
              <Input value={proposal.proposal_status} readOnly />
            </div>
            <div className="space-y-2">
              <Label>提報時間</Label>
              <Input value={proposal.created_at.split('T')[0]} readOnly />
            </div>
            <div className="space-y-2">
              <Label>更新時間</Label>
              <Input value={proposal.updated_at.split('T')[0]} readOnly />
            </div>
            <div className="space-y-2">
              <Label>審查者ID</Label>
              <Input value={proposal.reviewer_id || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>審查備註</Label>
              <Input value={proposal.reviewer_note || ''} readOnly />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>備註</Label>
              <Input value={proposal.note || ''} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 