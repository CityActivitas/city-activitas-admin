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

interface SortConfig {
  key: keyof AssetRequest
  direction: 'asc' | 'desc'
}

interface RequestAssetTableProps {
  requests: AssetRequest[]
  sortConfig: SortConfig
  onSort: (key: keyof AssetRequest) => void
  onRowClick?: (requestId: string) => void
  agencyMap?: Record<string, string>
  districtMap?: Record<string, string>
}

const SortIcon = ({ columnKey, sortConfig }: { columnKey: keyof AssetRequest, sortConfig: SortConfig }) => {
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

export function RequestAssetTable({ 
  requests, 
  sortConfig, 
  onSort, 
  onRowClick,
  agencyMap = {},
  districtMap = {}
}: RequestAssetTableProps) {
  // console.log(agencyMap)
  return (
    <div className="relative rounded-md border mt-2">
      <div className="overflow-y-scroll max-h-[70vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-200 z-10">
            <TableRow>
              {[
                ['需求編號', 'id'],
                ['需求機關', 'managing_agency'],
                ['資產種類', 'asset_type'],
                ['需求用途', 'purpose'],
                ['需求面積', 'area'],
                ['希望樓層', 'preferred_floor'],
                ['希望地點', 'district'],
                ['經費來源', 'funding_source'],
                ['申請狀態', 'requirement_status'],
                ['申請時間', 'created_at']
              ].map(([label, key]) => (
                <TableHead 
                  key={key}
                  className="group cursor-pointer hover:bg-gray-200"
                  onClick={() => onSort(key as keyof AssetRequest)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon columnKey={key as keyof AssetRequest} sortConfig={sortConfig} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow 
                key={request.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onRowClick && onRowClick(request.id)}
              >
                <TableCell>{request.id}</TableCell>
                <TableCell>
                  {request.agency_id && agencyMap[request.agency_id]
                    ? agencyMap[request.agency_id]
                    : request.managing_agency}
                </TableCell>
                <TableCell>{request.asset_type}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>{request.area} m²</TableCell>
                <TableCell>{request.preferred_floor || '-'}</TableCell>
                <TableCell>
                  {request.district_id && districtMap[request.district_id]
                    ? districtMap[request.district_id]
                    : request.district}
                </TableCell>
                <TableCell>{request.funding_source}</TableCell>
                <TableCell>{request.requirement_status}</TableCell>
                <TableCell>{request.created_at.split('T')[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 