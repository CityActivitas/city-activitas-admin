'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import dynamic from 'next/dynamic'

const DistrictSelectorDrawer = dynamic(
  () => import('./district-selector-drawer').then(mod => mod.DistrictSelectorDrawerComponent),
  { ssr: false }
)

type District = {
  id: number
  name: string
}

interface DistrictSelectorDrawerProps {
  currentDistrict: string;
  onDistrictSelect: (district: { name: string, id: number }) => void;
}

export function DistrictSelectorDrawerComponent({ 
  currentDistrict,
  onDistrictSelect 
}: DistrictSelectorDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([])

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return

        const response = await fetch('http://localhost:8000/api/v1/common/districts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch districts')

        const data = await response.json()
        setDistricts(data)
        setFilteredDistricts(data)
        
        const currentDistrictData = data.find((district: District) => district.name === currentDistrict)
        setSelectedDistrict(currentDistrictData || null)
      } catch (error) {
        console.error('Error fetching districts:', error)
      }
    }

    fetchDistricts()
  }, [currentDistrict])

  useEffect(() => {
    const filtered = districts.filter(district => 
      district.name.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredDistricts(filtered)
  }, [filter, districts])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setFilter('')
      setSelectedDistrict(districts.find(district => district.name === currentDistrict) || null)
    }
  }

  const handleConfirm = () => {
    if (selectedDistrict) {
      onDistrictSelect({
        name: selectedDistrict.name,
        id: selectedDistrict.id
      })
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedDistrict(districts.find(district => district.name === currentDistrict) || null)
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <div className="cursor-pointer">
          <Input 
            value={currentDistrict}
            readOnly
          />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>選擇行政區</DrawerTitle>
          <DrawerDescription>請選擇要修改的行政區域</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Input
            placeholder="搜尋行政區..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4"
          />
        </div>
        <ScrollArea className="max-h-[30vh] px-4">
          <div className="flex flex-wrap gap-1">
            {filteredDistricts.map((district) => (
              <Button
                key={district.id}
                variant={selectedDistrict?.id === district.id ? "default" : "outline"}
                onClick={() => setSelectedDistrict(district)}
                className="min-w-[4.5rem]"
              >
                {district.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 mt-2 flex justify-end space-x-2">
          <Button onClick={handleConfirm}>確認修改</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleCancel}>取消</Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}