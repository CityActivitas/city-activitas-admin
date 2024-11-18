'use client'

import { useState } from 'react'
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

const districts = [
  "新營區", "鹽水區", "白河區", "柳營區", "後壁區", "東山區", "麻豆區",
  "下營區", "六甲區", "官田區", "大內區", "佳里區", "學甲區", "西港區",
  "七股區", "將軍區", "北門區", "新化區", "新市區", "善化區", "安定區",
  "山上區", "玉井區", "楠西區", "南化區", "左鎮區", "仁德區", "歸仁區",
  "關廟區", "龍崎區", "永康區", "東區", "南區", "中西區", "北區", "安南區", "安平區"
]

interface DistrictSelectorDrawerProps {
  currentDistrict: string;
  onDistrictSelect: (district: string) => void;
}

export function DistrictSelectorDrawerComponent({ 
  currentDistrict,
  onDistrictSelect 
}: DistrictSelectorDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [tempSelectedDistrict, setTempSelectedDistrict] = useState<string>(currentDistrict)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      setFilter('')
    }
  }

  const filteredDistricts = districts.filter(district => 
    district.toLowerCase().includes(filter.toLowerCase())
  )

  const handleConfirm = () => {
    onDistrictSelect(tempSelectedDistrict)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempSelectedDistrict(currentDistrict)
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
          <DrawerDescription>
            請選擇要修改的行政區域
          </DrawerDescription>
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
                key={district}
                variant={tempSelectedDistrict === district ? "default" : "outline"}
                onClick={() => setTempSelectedDistrict(district)}
                className="min-w-[4.5rem]"
              >
                {district}
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