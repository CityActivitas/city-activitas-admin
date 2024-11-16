'use client'

import * as React from 'react'
import { ChevronDown, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface FilterBlockProps {
  onFilterChange: (filters: { 
    searchText: string, 
    isAssetIncluded: boolean, 
    selectedAssetTypes: string[],
    isAgencyIncluded: boolean,
    selectedAgencies: string[],
    isDistrictIncluded: boolean,
    selectedDistricts: string[]
  }) => void
  agencies: string[]
  districts?: string[]
}

export function IdleAssetsFilter({ onFilterChange, agencies, districts = [] }: FilterBlockProps) {
  const [searchText, setSearchText] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [isAssetIncluded, setIsAssetIncluded] = React.useState(true)
  const [selectedAssetTypes, setSelectedAssetTypes] = React.useState<string[]>(['building', 'land'])
  const [isAgencyIncluded, setIsAgencyIncluded] = React.useState(true)
  const [selectedAgencies, setSelectedAgencies] = React.useState<string[]>(agencies)
  const [isDistrictIncluded, setIsDistrictIncluded] = React.useState(true)
  const [selectedDistricts, setSelectedDistricts] = React.useState<string[]>(districts)

  React.useEffect(() => {
    onFilterChange({ 
      searchText, 
      isAssetIncluded, 
      selectedAssetTypes,
      isAgencyIncluded,
      selectedAgencies,
      isDistrictIncluded,
      selectedDistricts
    })
  }, [searchText, isAssetIncluded, selectedAssetTypes, isAgencyIncluded, selectedAgencies, isDistrictIncluded, selectedDistricts, onFilterChange])

  const handleReset = () => {
    setSearchText('')
    setIsAssetIncluded(true)
    setSelectedAssetTypes(['building', 'land'])
    setIsAgencyIncluded(true)
    setSelectedAgencies(agencies)
    setIsDistrictIncluded(true)
    setSelectedDistricts(districts)
  }

  return (
    <div className="border rounded-lg py-2 px-4 bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2">
            <ChevronDown className={`h-4 w-4 transform ${isOpen ? 'rotate-0' : '-rotate-90'} transition-transform`} />
            <span className="font-medium">條件篩選</span>
          </CollapsibleTrigger>
          {isOpen && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="text-gray-500"
            >
              重設條件
            </Button>
          )}
        </div>
        <CollapsibleContent>
          {/* Search Input - Move to top */}
          <div className="flex gap-2 pt-4 pb-6">
            <Input
              placeholder="輸入要過濾的文字"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setSearchText('')}
              className="shrink-0"
            >
              清除
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-6 divide-x divide-gray-200">
            {/* Asset Type Section */}
            <div className="space-y-2 md:pr-6">
              <h3 className="font-medium">資產種類</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="asset-toggle" 
                    checked={isAssetIncluded}
                    onCheckedChange={setIsAssetIncluded}
                  />
                  <Label htmlFor="asset-toggle">
                    {isAssetIncluded ? "包含" : "不包含"}
                  </Label>
                </div>
                <ToggleGroup 
                  type="multiple"
                  value={selectedAssetTypes}
                  onValueChange={setSelectedAssetTypes}
                  className="flex flex-col gap-2"
                >
                  <ToggleGroupItem value="building" className="h-8 justify-start px-3">建物</ToggleGroupItem>
                  <ToggleGroupItem value="land" className="h-8 justify-start px-3">土地</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Management Agency Section */}
            <div className="space-y-2 md:px-6">
              <h3 className="font-medium">管理機關</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="agency-toggle" 
                    checked={isAgencyIncluded}
                    onCheckedChange={setIsAgencyIncluded}
                  />
                  <Label htmlFor="agency-toggle">
                    {isAgencyIncluded ? "包含" : "不包含"}
                  </Label>
                </div>
                <ToggleGroup 
                  type="multiple"
                  value={selectedAgencies}
                  onValueChange={setSelectedAgencies}
                  className="flex flex-wrap gap-2"
                >
                  {agencies.map((agency) => (
                    <ToggleGroupItem 
                      key={agency} 
                      value={agency} 
                      className="h-8 justify-start px-3"
                    >
                      {agency}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>

            {/* Administrative District Section */}
            <div className="space-y-2 md:pl-6">
              <h3 className="font-medium">行政區</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="district-toggle"
                    checked={isDistrictIncluded}
                    onCheckedChange={setIsDistrictIncluded}
                  />
                  <Label htmlFor="district-toggle">
                    {isDistrictIncluded ? "包含" : "不包含"}
                  </Label>
                </div>
                <ToggleGroup 
                  type="multiple"
                  value={selectedDistricts}
                  onValueChange={setSelectedDistricts}
                  className="flex flex-wrap gap-2"
                >
                  {districts.map((district) => (
                    <ToggleGroupItem 
                      key={district} 
                      value={district} 
                      className="h-8 justify-start px-3"
                    >
                      {district}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}