import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"

interface LandRelationData {
  id: string;
  landNumber: string;
  landType: string;
  landManager: string;
  createdAt: string;
  updatedAt: string;
}

interface LandRelationsTabProps {
  landRelationData: LandRelationData[];
}

export function LandRelationsTab({ landRelationData }: LandRelationsTabProps) {
  const [editData, setEditData] = useState<Record<string, LandRelationData>>(
    landRelationData.reduce((acc, land) => ({
      ...acc,
      [land.id]: { ...land }
    }), {})
  );

  const handleChange = (id: string, field: keyof LandRelationData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {landRelationData.map((land) => (
          <div key={land.id} className="grid grid-cols-2 gap-4 pb-4 border-b last:border-b-0">
            <div className="space-y-2">
              <Label className="whitespace-nowrap min-w-[120px]">建物土地關聯ID</Label>
              <Input value={editData[land.id].id} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="whitespace-nowrap min-w-[120px]">地號</Label>
              <Input 
                value={editData[land.id].landNumber}
                onChange={(e) => handleChange(land.id, 'landNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="whitespace-nowrap min-w-[120px]">土地種類</Label>
              <Input 
                value={editData[land.id].landType}
                onChange={(e) => handleChange(land.id, 'landType', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="whitespace-nowrap min-w-[120px]">土地管理者</Label>
              <Input 
                value={editData[land.id].landManager}
                onChange={(e) => handleChange(land.id, 'landManager', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="whitespace-nowrap min-w-[120px]">建立時間</Label>
              <Input 
                value={new Date(land.createdAt).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })} 
                readOnly 
              />
            </div>
            <div className="space-y-2">
              <Label className="whitespace-nowrap min-w-[120px]">修改時間</Label>
              <Input 
                value={new Date(land.updatedAt).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })} 
                readOnly 
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <Button 
                variant="secondary" 
                className="mr-2"
                onClick={() => setEditData(prev => ({
                  ...prev,
                  [land.id]: { ...land }
                }))}
                disabled={JSON.stringify(editData[land.id]) === JSON.stringify(land)}
              >
                取消
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    disabled={JSON.stringify(editData[land.id]) === JSON.stringify(land)}
                  >
                    修改
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>確認修改</DialogTitle>
                    <DialogDescription>
                      修改後的資料如下：
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 text-sm">
                    {Object.entries(editData[land.id]).map(([key, value]) => {
                      const isModified = land[key as keyof LandRelationData] !== value;
                      const label = {
                        id: '關聯ID',
                        landNumber: '地號',
                        landType: '土地種類',
                        landManager: '土地管理者',
                        createdAt: '建立時間',
                        updatedAt: '修改時間'
                      }[key];

                      return (
                        <div key={key} className="flex">
                          <span className="w-24 flex-shrink-0">{label}:</span>
                          <span className={`${isModified ? "font-bold text-red-500" : ""}`}>
                            {key.includes('At') 
                              ? new Date(value as string).toLocaleString('zh-TW', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : value || '無'
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">
                        取消
                      </Button>
                    </DialogClose>
                    <Button onClick={() => {
                      // TODO: 實作更新邏輯
                      console.log('更新資料:', editData[land.id]);
                    }}>
                      確認修改
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" className="ml-2">刪除</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 