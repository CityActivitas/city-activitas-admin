'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const AgenciesDrawer = dynamic(
  () => import('./agencies-drawer').then(mod => mod.AgenciesDrawerComponent),
  { ssr: false }
)

type ManagementUnit = {
  id: number
  name: string
  note: string
}

interface AgenciesDrawerProps {
  currentUnit: string;
  onUnitSelect: (unit: { name: string, id: number }) => void;
}

export function AgenciesDrawerComponent ({ 
  currentUnit,
  onUnitSelect 
}: AgenciesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [managementUnits, setManagementUnits] = useState<ManagementUnit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<ManagementUnit | null>(null)
  const [filteredUnits, setFilteredUnits] = useState<ManagementUnit[]>([])

  // 從 API 獲取管理機關資料
  useEffect(() => {
    const fetchManagementUnits = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return

        const response = await fetch('http://localhost:8000/api/v1/common/agencies', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch management units')

        const data = await response.json()
        setManagementUnits(data)
        setFilteredUnits(data)
        
        // 設置當前選中的單位
        const currentUnitData = data.find((unit: ManagementUnit) => unit.name === currentUnit)
        setSelectedUnit(currentUnitData || null)
      } catch (error) {
        console.error('Error fetching management units:', error)
      }
    }

    fetchManagementUnits()
  }, [currentUnit])

  // 過濾邏輯
  useEffect(() => {
    const filtered = managementUnits.filter(unit => 
      (unit.name?.toLowerCase() || '').includes(filter.toLowerCase()) ||
      (unit.note?.toLowerCase() || '').includes(filter.toLowerCase())
    )
    setFilteredUnits(filtered)
  }, [filter, managementUnits])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setFilter('')
      setSelectedUnit(managementUnits.find(unit => unit.name === currentUnit) || null)
    }
  }

  const handleConfirm = () => {
    if (selectedUnit) {
      onUnitSelect({
        name: selectedUnit.name,
        id: selectedUnit.id
      });
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedUnit(managementUnits.find(unit => unit.name === currentUnit) || null)
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <div className="cursor-pointer">
          <Input 
            value={currentUnit}
            readOnly
          />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>選擇管理單位</DrawerTitle>
          <DrawerDescription>請選擇一個管理單位</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <Input
            placeholder="搜尋管理單位..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4"
          />
        </div>
        <div className="px-4 overflow-y-auto h-[60vh]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredUnits.map((unit) => (
              <Button
                key={unit.id}
                variant={selectedUnit?.id === unit.id ? "default" : "outline"}
                onClick={() => setSelectedUnit(unit)}
                className="min-w-[150px] justify-start"
              >
                <div className="text-left">
                  <div>{unit.name}</div>
                  <div className="text-sm text-muted-foreground">{unit.note}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
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