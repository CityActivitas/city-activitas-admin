'use client'

import { useState, useEffect } from "react"
import { Building, X } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ReportAssetForm } from "./report-asset-form"
import { ProposalAssetTable, SortConfig } from "./proposal-asset-table"
import { OneProposalAssetDetail } from "./one-proposal-asset-detail"
import * as XLSX from 'xlsx'

interface AssetProposal {
  id: string
  asset_name: string
  managing_agency: string
  district: string
  section: string
  address: string
  reporter_email: string
  status: string
  created_at: string
  target_name: string
  agency_id: string
  district_id: string
  proposal_status: string
  coordinates: string
  has_usage_license: string
  has_building_license: string
  land_type: string
  land_number: string
  land_area: number
  floor_area: number
  building_age: number
  floor_count: number
  management_type: string
  current_use: string
  target_use: string
  contact_name: string
  contact_phone: string
  contact_email: string
  notes: string
  image_urls: string[]
  attachments: string[]
  zone_type: string
  land_use: string
  area: string
  usage_description: string
  usage_status: string
  activation_status: string
  estimated_activation_date: string
  is_requesting_delisting: boolean
  delisting_reason: string
  delisting_notes: string
  delisting_attachments: string[]
  review_status: string
  review_notes: string
  review_attachments: string[]
  reviewed_at: string
  note: string
  lot_number: string
  updated_at: string
  reviewer_id: string
  reviewer_note: string
  agency: string
}

export function ReportAsset() {
  const [showForm, setShowForm] = useState(false)
  const [proposals, setProposals] = useState<AssetProposal[]>([])
  const [agencyMap, setAgencyMap] = useState<Record<string, string>>({})
  const [districtMap, setDistrictMap] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'created_at', 
    direction: 'desc' 
  })
  const [selectedProposal, setSelectedProposal] = useState<AssetProposal | null>(null)

  useEffect(() => {
    fetchProposals()
    fetchMappingData()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/proposals/asset-proposals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (!response.ok) throw new Error('獲取提案列表失敗')
      const data = await response.json()
      // console.log(data)
      setProposals(data)
    } catch (error) {
      console.error('獲取提案列表錯誤:', error)
    }
  }

  const fetchMappingData = async () => {
    try {
      const agencyResponse = await fetch('http://localhost:8000/api/v1/common/agencies')
      if (!agencyResponse.ok) throw new Error('Failed to fetch agencies')
      const agencies = await agencyResponse.json()
      const agencyMapping = agencies.reduce((acc: Record<string, string>, agency: { id: number, name: string }) => {
        acc[agency.id.toString()] = agency.name
        return acc
      }, {})
      setAgencyMap(agencyMapping)

      const districtResponse = await fetch('http://localhost:8000/api/v1/common/districts')
      if (!districtResponse.ok) throw new Error('Failed to fetch districts')
      const districts = await districtResponse.json()
      const districtMapping = districts.reduce((acc: Record<string, string>, district: { id: number, name: string }) => {
        acc[district.id.toString()] = district.name
        return acc
      }, {})
      setDistrictMap(districtMapping)
    } catch (error) {
      console.error('Error fetching mapping data:', error)
    }
  }

  const handleSort = (key: keyof AssetProposal) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedProposals = [...proposals].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  const handleRowClick = (proposalId: string) => {
    console.log('Clicked proposal:', proposalId)
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const handleExportExcel = () => {
    const exportData = sortedProposals.map(proposal => ({
      '提報ID': proposal.id,
      '地段': proposal.section,
      '標的名稱': proposal.target_name,
      '使用分區': proposal.zone_type,
      '活化狀態': proposal.activation_status,
      '地址': proposal.address,
      '管理機關': agencyMap[proposal.agency_id] || proposal.agency_id,
      '面積': proposal.area,
      '座標': proposal.coordinates,
      '建立時間': proposal.created_at,
      '行政區': districtMap[proposal.district_id] || proposal.district_id,
      '預計活化日期': proposal.estimated_activation_date,
      '建物面積': proposal.floor_area,
      '建照狀態': proposal.has_building_license,
      '使用執照狀態': proposal.has_usage_license,
      '土地類型': proposal.land_type,
      '土地使用': proposal.land_use,
      '地號': proposal.lot_number,
      '是否申請解除列管': proposal.is_requesting_delisting ? '是' : '否',
      '解除列管原因': proposal.delisting_reason,
      '備註': proposal.note,
      '提案狀態': proposal.proposal_status,
      '提報者信箱': proposal.reporter_email,
      '審查時間': proposal.reviewed_at,
      '審查者ID': proposal.reviewer_id,
      '審查意見': proposal.reviewer_note,
      '更新時間': proposal.updated_at,
      '使用說明': proposal.usage_description,
      '使用狀態': proposal.usage_status,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '提報資產')

    XLSX.writeFile(wb, '提報資產清單.xlsx')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">提報資產共{proposals.length}筆</h1>
          <div className="flex gap-2">
            <Button onClick={handleExportExcel}>
              匯出Excel
            </Button>
            {!selectedProposal && (
              <Button 
                onClick={toggleForm}
                className="flex items-center gap-2"
                variant={showForm ? "secondary" : "default"}
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4" />
                    關閉表單
                  </>
                ) : (
                  <>
                    <Building className="h-4 w-4" />
                    新增提報
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {showForm ? (
          <ReportAssetForm 
            onSubmitSuccess={() => {
              setShowForm(false)  // 關閉表單
              fetchProposals()    // 重新獲取列表
            }} 
          />
        ) : proposals.length > 0 ? (
          !selectedProposal && (
            <ProposalAssetTable 
              proposals={sortedProposals}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={(proposalId) => {
              const proposal = proposals.find(p => p.id === proposalId);
              if (proposal) {
                setSelectedProposal({
                  ...proposal,
                  agency: agencyMap[proposal.agency_id] || '',
                  district: districtMap[proposal.district_id] || ''
                });
              }
              }}
              agencyMap={agencyMap}
              districtMap={districtMap}
            />
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              尚無提報資產
            </div>
          </div>
        )}

        {selectedProposal && (
              <OneProposalAssetDetail 
                proposal={{
                  ...selectedProposal,
                  floor_area: selectedProposal.floor_area.toString()
                }}
                onBack={() => {
                  setSelectedProposal(null);
                  fetchProposals();
                }}
                agencyMap={agencyMap}
                districtMap={districtMap}
          />
        )}
      </main>
    </div>
  )
} 