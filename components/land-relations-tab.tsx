import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

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
              <Label>建物土地關聯ID</Label>
              <Input value={editData[land.id].id} readOnly />
            </div>
            <div className="space-y-2">
              <Label>地號</Label>
              <Input 
                value={editData[land.id].landNumber}
                onChange={(e) => handleChange(land.id, 'landNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>土地種類</Label>
              <Input 
                value={editData[land.id].landType}
                onChange={(e) => handleChange(land.id, 'landType', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>土地管理者</Label>
              <Input 
                value={editData[land.id].landManager}
                onChange={(e) => handleChange(land.id, 'landManager', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>建立時間</Label>
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
              <Label>修改時間</Label>
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
              >
                取消
              </Button>
              <Button variant="outline">修改</Button>
              <Button variant="destructive" className="ml-2">刪除</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 