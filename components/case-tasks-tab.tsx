import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TaskData {
  任務ID: number;
  任務內容: string;
  任務狀態: string;
  備註: string;
  執行機關: string;
  案件ID: number;
  案件名稱: string;
  標的名稱: string;
  行政區: string;
  資產類型: string;
  開始日期: string;
  預計完成日期: string;
}

export function CaseTasksTab({ taskData }: { taskData: TaskData[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {taskData.map((task) => (
        <Card key={task.任務ID}>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>任務ID</Label>
                <Input value={task.任務ID.toString()} readOnly />
              </div>
              <div className="space-y-2">
                <Label>任務狀態</Label>
                <Input value={task.任務狀態} readOnly />
              </div>
              <div className="space-y-2">
                <Label>執行機關</Label>
                <Input value={task.執行機關} readOnly />
              </div>
              <div className="space-y-2">
                <Label>案件ID</Label>
                <Input value={task.案件ID.toString()} readOnly />
              </div>
              <div className="space-y-2">
                <Label>案件名稱</Label>
                <Input value={task.案件名稱} readOnly />
              </div>
              <div className="space-y-2">
                <Label>標的名稱</Label>
                <Input value={task.標的名稱} readOnly />
              </div>
              <div className="space-y-2">
                <Label>開始日期</Label>
                <Input value={task.開始日期 || '-'} readOnly />
              </div>
              <div className="space-y-2">
                <Label>預計完成日期</Label>
                <Input value={task.預計完成日期 || '-'} readOnly />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>任務內容</Label>
                <Input value={task.任務內容} readOnly />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>備註</Label>
                <Input value={task.備註 || '-'} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 