'use client'

import { useState, useEffect } from "react"
import { Building, X } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ReportAssetForm } from "./report-asset-form"
import { ProposalAssetTable } from "./proposal-asset-table"

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
}

export function ReportAsset() {
  const [showForm, setShowForm] = useState(false)
  const [proposals, setProposals] = useState<AssetProposal[]>([])
  const [agencyMap, setAgencyMap] = useState<Record<string, string>>({})
  const [districtMap, setDistrictMap] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AssetProposal
    direction: 'asc' | 'desc'
  }>({ key: 'created_at', direction: 'desc' })

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
      if (!response.ok) throw new Error('Failed to fetch proposals')
      const data = await response.json()
      console.log('Proposals:', data)
      setProposals(data)
    } catch (error) {
      console.error('Error fetching proposals:', error)
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">提報資產</h1>
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
        </div>

        {showForm ? (
          <ReportAssetForm 
            onSubmitSuccess={() => {
              setShowForm(false)  // 關閉表單
              fetchProposals()    // 重新獲取列表
            }} 
          />
        ) : proposals.length > 0 ? (
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
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              尚無提報資產
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 