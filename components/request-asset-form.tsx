'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AgenciesDrawerComponent } from "@/components/agencies-drawer"
import { DistrictSelectorDrawerComponent } from "@/components/district-selector-drawer"
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
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  managing_agency: z.string().min(1, { message: "請輸入需求機關" }),
  agency_id: z.string().min(1, { message: "請選擇需求機關" }),
  purpose: z.string().min(1, { message: "請輸入需求用途" }),
  asset_type: z.enum(["土地", "建物"]),
  preferred_floor: z.string().optional(),
  area: z.number().min(0, { message: "面積必須大於0" }),
  district: z.string().min(1, { message: "請選擇希望地點" }),
  district_id: z.string().min(1, { message: "請選擇希望地點" }),
  urgency_note: z.string().min(1, { message: "請說明必要性與急迫性" }),
  funding_source: z.string().min(1, { message: "請說明經費來源" }),
})

// 新增介面定義
interface RequestAssetFormProps {
  onSubmitSuccess?: () => void
}

// 修改元件定義，加入 props
export function RequestAssetForm({ onSubmitSuccess }: RequestAssetFormProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      managing_agency: "",
      agency_id: "",
      purpose: "",
      asset_type: "建物",
      preferred_floor: "",
      area: 0,
      district: "",
      district_id: "",
      urgency_note: "",
      funding_source: "擬爭取納入市預算編列",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const reporterEmail = user?.email

      if (!reporterEmail) {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "無法取得使用者資訊",
        })
        return
      }

      const submitData = {
        ...values,
        reporter_email: reporterEmail,
        area: Number(values.area) || 0
      }

      console.log('Submitting data:', submitData)

      const response = await fetch('http://localhost:8000/api/v1/proposals/asset-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '提交失敗')
      }

      toast({
        title: "提交成功",
        description: "資產需求已成功送出",
      })

      form.reset()
      
      const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement
      if (closeButton) {
        closeButton.click()
      }

      onSubmitSuccess?.()
      
    } catch (error) {
      console.error('提交錯誤:', error)
      toast({
        variant: "destructive",
        title: "提交失敗",
        description: "提交資料時發生錯誤，請稍後再試",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">資產需求表單</h2>
        <p className="text-sm text-gray-500">請填寫以下需求資訊</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="managing_agency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>需求機關</FormLabel>
                <FormControl>
                  <AgenciesDrawerComponent
                    currentUnit={field.value}
                    onUnitSelect={(unit) => {
                      form.setValue('managing_agency', unit.name);
                      form.setValue('agency_id', unit.id.toString());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asset_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>資產種類</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇資產種類" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="土地">土地</SelectItem>
                    <SelectItem value="建物">建物</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>需求用途</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>需求面積（平方公尺）</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>希望樓層</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：1-3樓" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>希望地點</FormLabel>
                <FormControl>
                  <DistrictSelectorDrawerComponent
                    currentDistrict={field.value}
                    onDistrictSelect={(district) => {
                      form.setValue('district', district.name);
                      form.setValue('district_id', district.id.toString());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgency_note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>必要性與急迫性說明</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="funding_source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>經費來源</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="擬爭取納入市預算編列" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Input 
            type="hidden"
            {...form.register('agency_id')}
          />
          <Input 
            type="hidden"
            {...form.register('district_id')}
          />

          <div className="flex justify-end gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">提交需求</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>確認提交</DialogTitle>
                  <DialogDescription>
                    提交的資料如下：
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm max-h-[60vh] overflow-y-auto">
                  {Object.entries(form.getValues()).map(([key, value]) => {
                    const label = {
                      managing_agency: '需求機關',
                      agency_id: '機關代碼',
                      purpose: '需求用途',
                      asset_type: '資產種類',
                      preferred_floor: '希望樓層',
                      area: '需求面積（平方公尺）',
                      district: '希望地點',
                      district_id: '地點代碼',
                      urgency_note: '必要性與急迫性說明',
                      funding_source: '經費來源'
                    }[key] || key;

                    // ��過不需要顯示的欄位
                    if (['agency_id', 'district_id'].includes(key)) {
                      return null;
                    }

                    return (
                      <div key={key} className="flex">
                        <span className="w-32 flex-shrink-0">{label}:</span>
                        <span>{value || '無'}</span>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <DialogClose asChild data-dialog-close>
                    <Button variant="outline">
                      取消
                    </Button>
                  </DialogClose>
                  <Button onClick={form.handleSubmit(onSubmit)}>
                    確認提交
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  )
} 