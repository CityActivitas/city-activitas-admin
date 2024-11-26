import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"

interface TaskData {
  id: number;
  case_id: number;
  agency_id: number;
  task_content: string;
  status: string;
  start_date: string;
  complete_date: string;
  due_date: string;
  note: string;
  created_at: string;
  updated_at: string;
}

interface CaseTasksTabProps {
  taskData: TaskData[];
}

export function CaseTasksTab({ taskData }: CaseTasksTabProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任務ID</TableHead>
              <TableHead>任務內容</TableHead>
              <TableHead>任務狀態</TableHead>
              <TableHead>備註</TableHead>
              <TableHead>執行機關</TableHead>
              <TableHead>案件ID</TableHead>
              <TableHead>案件名稱</TableHead>
              <TableHead>標的名稱</TableHead>
              <TableHead>行政區</TableHead>
              <TableHead>資產類型</TableHead>
              <TableHead>開始日期</TableHead>
              <TableHead>預計完成日期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskData.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.任務ID || '-'}</TableCell>
                <TableCell>{task.任務內容 || '-'}</TableCell>
                <TableCell>{task.任務狀態 || '-'}</TableCell>
                <TableCell>{task.備註 || '-'}</TableCell>
                <TableCell>{task.執行機關 || '-'}</TableCell>
                <TableCell>{task.案件ID || '-'}</TableCell>
                <TableCell>{task.案件名稱 || '-'}</TableCell>
                <TableCell>{task.標的名稱 || '-'}</TableCell>
                <TableCell>{task.行政區 || '-'}</TableCell>
                <TableCell>{task.資產類型 || '-'}</TableCell>
                <TableCell>{task.開始日期 || '-'}</TableCell>
                <TableCell>{task.預計完成日期 || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 