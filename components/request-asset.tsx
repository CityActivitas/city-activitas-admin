'use client'

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { RequestAssetForm } from "./request-asset-form"
import { useState, useEffect } from "react"
import { FileText, X } from "lucide-react"
import { RequestAssetTable } from "./request-asset-table"

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">申請資產需求</h1>
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
              requests={requests}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={(requestId) => {
                const request = requests.find(r => r.id === requestId)
                if (request) {
                  setSelectedRequest({
                    ...request,
                    managing_agency: agencyMap[request.agency_id] || request.managing_agency,
                    district: districtMap[request.district_id] || request.district
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