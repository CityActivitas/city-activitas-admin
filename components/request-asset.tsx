'use client'

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { RequestAssetForm } from "./request-asset-form"
import { useState, useEffect } from "react"
import { FileText, X } from "lucide-react"
import { RequestAssetTable } from "./request-asset-table"
import { OneRequestAssetDetail } from "./one-request-asset-detail"
import * as XLSX from 'xlsx'

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
  updated_at: string
  reviewer_note: string
  reviewed_at: string
  reviewer_id: string
}

interface SortConfig {
  key: keyof AssetRequest
  direction: 'asc' | 'desc'
}

export function RequestAsset() {
  const [showForm, setShowForm] = useState(false)
  const [requests, setRequests] = useState<AssetRequest[]>([])
  const [agencyMap, setAgencyMap] = useState<Record<string, string>>({})
  const [districtMap, setDistrictMap] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'created_at', 
    direction: 'desc' 
  })
  const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null)

  useEffect(() => {
    fetchRequests()
    fetchMappingData()
  }, [])

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

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/proposals/asset-requirements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (!response.ok) throw new Error('獲取需求列表失敗')
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('獲取需求列表錯誤:', error)
    }
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const handleSort = (key: keyof AssetRequest) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedRequests = [...requests].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  const handleExportExcel = () => {
    const exportData = sortedRequests.map(request => ({
      '需求ID': request.id,
      '需求機關': agencyMap[request.agency_id] || request.agency_id,
      '需求用途': request.purpose,
      '資產種類': request.asset_type,
      '希望樓層': request.preferred_floor || '',
      '面積(平方公尺)': request.area,
      '希望地點': districtMap[request.district_id] || request.district_id,
      '必要性、急迫性說明': request.urgency_note,
      '經費來源': request.funding_source,
      '提報者信箱': request.reporter_email,
      '需求狀態': request.requirement_status,
      '建立時間': request.created_at,
      '更新時間': request.updated_at,
      '審核者備註': request.reviewer_note || '',
      '審核時間': request.reviewed_at || '',
      '審核者ID': request.reviewer_id || ''
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '資產需求')

    XLSX.writeFile(wb, '資產需求清單.xlsx')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">申請資產需求共{requests.length}筆</h1>
          <div className="flex gap-2">
            <Button onClick={handleExportExcel}>
              匯出Excel
            </Button>
            {!selectedRequest && (
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
                    <FileText className="h-4 w-4" />
                    新增需求
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {showForm ? (
          <RequestAssetForm 
            onSubmitSuccess={() => {
              setShowForm(false)
              fetchRequests()
            }}
          />
        ) : requests.length > 0 ? (
          !selectedRequest && (
            <RequestAssetTable 
              requests={sortedRequests}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={(requestId) => {
                const request = requests.find(r => r.id === requestId)
                if (request) {
                  setSelectedRequest({
                    ...request,
                    managing_agency: agencyMap[request.agency_id] || '',
                    district: districtMap[request.district_id] || ''
                  })
                }
              }}
              agencyMap={agencyMap}
              districtMap={districtMap}
            />
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              尚無資產需求
            </div>
          </div>
        )}

        {selectedRequest && (
          <OneRequestAssetDetail 
            request={selectedRequest}
            onBack={() => {
              setSelectedRequest(null)
              fetchRequests()
            }}
            agencyMap={agencyMap}
            districtMap={districtMap}
          />
        )}
      </main>
    </div>
  )
} 