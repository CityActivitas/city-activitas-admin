'use client'

import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
interface FilterSummaryProps {
  isAssetIncluded: boolean
  selectedAssetTypes: string[]
  isAgencyIncluded: boolean
  selectedAgencies: string[]
  isDistrictIncluded: boolean
  selectedDistricts: string[]
}

export function IdleAssetsFilterSummary({
  isAssetIncluded,
  selectedAssetTypes,
  isAgencyIncluded,
  selectedAgencies,
  isDistrictIncluded,
  selectedDistricts
}: FilterSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="border rounded-lg py-2 px-4 bg-white mt-2"
    >
      <CollapsibleTrigger className="flex items-center gap-2">
        <ChevronDown className={`h-4 w-4 transform ${isOpen ? 'rotate-0' : '-rotate-90'} transition-transform`} />
        <span className="font-medium">篩選器摘要</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm text-gray-600 flex flex-wrap items-center mt-2">
          資產種類{isAssetIncluded ? "包含" : "不包含"}：
          {selectedAssetTypes.map((type) => (
            <span key={type} className="ml-2 bg-gray-100 rounded-md text-sm">
              {type === 'building' ? '建物' : '土地'}
            </span>
          ))}
        </p>
        <p className="text-sm text-gray-600 flex flex-wrap items-center mt-2">
          管理機關{isAgencyIncluded ? "包含" : "不包含"}：
          {selectedAgencies.map((agency) => (
            <span key={agency} className="ml-2 bg-gray-100 rounded-md text-sm">
              {agency}
            </span>
          ))}
        </p>
        <p className="text-sm text-gray-600 flex flex-wrap items-center mt-2">
          行政區{isDistrictIncluded ? "包含" : "不包含"}：
          {selectedDistricts.map((district) => (
            <span key={district} className="ml-2 bg-gray-100 rounded-md text-sm">
              {district}
            </span>
          ))}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
} 