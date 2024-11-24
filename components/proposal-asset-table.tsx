'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from 'react'
import { OneProposalAssetDetail } from './one-proposal-asset-detail'

interface AssetProposal {
  id: string
  target_name: string
  agency_id: string
  district_id: string
  section: string
  address: string
  land_type: string
  proposal_status: string
  created_at: string
}

interface SortConfig {
  key: keyof AssetProposal
  direction: 'asc' | 'desc'
}

interface ProposalAssetTableProps {
  proposals: AssetProposal[]
  sortConfig: SortConfig
  onSort: (key: keyof AssetProposal) => void
  onRowClick?: (proposalId: string) => void
  agencyMap: Record<string, string>
  districtMap: Record<string, string>
}

const SortIcon = ({ columnKey, sortConfig }: { columnKey: keyof AssetProposal, sortConfig: SortConfig }) => {
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

export function ProposalAssetTable({ 
  proposals, 
  sortConfig, 
  onSort, 
  onRowClick,
  agencyMap,
  districtMap 
}: ProposalAssetTableProps) {
  const [selectedProposal, setSelectedProposal] = useState<AssetProposal | null>(null)

  if (selectedProposal) {
    return (
      <OneProposalAssetDetail 
        proposal={selectedProposal}
        onBack={() => setSelectedProposal(null)}
        agencyMap={agencyMap}
        districtMap={districtMap}
      />
    )
  }

  return (
    <div className="relative rounded-md border mt-2">
      <div className="overflow-y-scroll max-h-[70vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-200 z-10">
            <TableRow>
              {[
                ['提報編號', 'id'],
                ['標的名稱', 'target_name'],
                ['管理機關', 'agency_id'],
                ['行政區', 'district_id'],
                ['地段', 'section'],
                ['地址', 'address'],
                ['土地種類', 'land_type'],
                ['狀態', 'proposal_status'],
                ['提報時間', 'created_at']
              ].map(([label, key]) => (
                <TableHead 
                  key={key}
                  className="group cursor-pointer hover:bg-gray-200"
                  onClick={() => onSort(key as keyof AssetProposal)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon columnKey={key as keyof AssetProposal} sortConfig={sortConfig} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow 
                key={proposal.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedProposal(proposal)}
              >
                <TableCell>{proposal.id}</TableCell>
                <TableCell>{proposal.target_name}</TableCell>
                <TableCell>
                  {proposal.agency_id && agencyMap[proposal.agency_id]
                    ? agencyMap[proposal.agency_id]
                    : proposal.agency_id}
                </TableCell>
                <TableCell>
                  {proposal.district_id && districtMap[proposal.district_id]
                    ? districtMap[proposal.district_id]
                    : proposal.district_id}
                </TableCell>
                <TableCell>{proposal.section}</TableCell>
                <TableCell>{proposal.address}</TableCell>
                <TableCell>{proposal.land_type}</TableCell>
                <TableCell>{proposal.proposal_status}</TableCell>
                <TableCell>{proposal.created_at.split('T')[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 