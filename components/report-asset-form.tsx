'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AgenciesDrawerComponent } from "@/components/agencies-drawer"
import { DistrictSelectorDrawerComponent } from "@/components/district-selector-drawer"
import { useState } from 'react'
import { LocationDrawerComponent } from "@/components/location-drawer"
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
  managing_agency: z.string().min(1, { message: "請輸入管理機關" }),
  agency_id: z.string().min(1, { message: "請選擇管理機關" }),
  target_name: z.string().min(1, { message: "請輸入標的名稱" }),
  district: z.string().min(1, { message: "請選擇行政區" }),
  district_id: z.string().min(1, { message: "請選擇行政區" }),
  section: z.string().min(1, { message: "請輸入地段" }),
  lot_number: z.string().min(1, { message: "請輸入地號" }),
  address: z.string().min(1, { message: "請輸入地址" }),
  coordinates: z.string().optional(),
  has_usage_license: z.enum(["有", "無"]).optional(),
  has_building_license: z.enum(["有", "無", "部分"]).optional(),
  land_type: z.string().min(1, { message: "請選擇土地種類" }),
  zone_type: z.string().min(1, { message: "請選擇使用分區" }),
  land_use: z.string().min(1, { message: "請選擇土地用途" }),
  area: z.number().min(0, { message: "面積必須大於0" }),
  floor_area: z.string().optional(),
  usage_description: z.string().min(1, { message: "請輸入目前使用情形說明" }),
  usage_status: z.enum(["閒置", "低度利用"], { 
    required_error: "請選擇資產使用情形" 
  }),
  activation_status: z.string().optional(),
  estimated_activation_date: z.string().optional(),
  is_requesting_delisting: z.boolean().optional(),
  delisting_reason: z.string().optional(),
  note: z.string().optional(),
})

interface ReportAssetFormProps {
  onSubmitSuccess?: () => void
}

export function ReportAssetForm({ onSubmitSuccess }: ReportAssetFormProps) {
  const { toast } = useToast()
  const [locationDrawerOpen, setLocationDrawerOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      managing_agency: "",
      agency_id: "",
      target_name: "",
      district: "",
      district_id: "",
      section: "",
      lot_number: "",
      address: "",
      coordinates: "",
      land_type: "",
      zone_type: "",
      land_use: "",
      area: 0,
      floor_area: "",
      usage_description: "",
      usage_status: "閒置",
      activation_status: "",
      estimated_activation_date: "",
      is_requesting_delisting: false,
      delisting_reason: "",
      note: "",
      has_usage_license: undefined,
      has_building_license: undefined,
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
        estimated_activation_date: values.estimated_activation_date || null,
        area: Number(values.area) || 0
      }

      console.log('Submitting data:', submitData)

      const response = await fetch('http://localhost:8000/api/v1/proposals/asset-proposals', {
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
        description: "資產提報已成功送出",
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
        <h2 className="text-lg font-semibold">提報資產表單</h2>
        <p className="text-sm text-gray-500">請填寫以下資產資訊</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本資訊 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="managing_agency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>管理機關</FormLabel>
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
              name="target_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標的名稱</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>行政區</FormLabel>
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
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>地段</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lot_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>地號</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>地址</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      onClick={() => setLocationDrawerOpen(true)}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>座標</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      onClick={() => setLocationDrawerOpen(true)}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LocationDrawerComponent 
              open={locationDrawerOpen} 
              onOpenChange={setLocationDrawerOpen}
              onConfirm={(address, coordinates) => {
                form.setValue('address', address);
                form.setValue('coordinates', coordinates);
              }}
              initialAddress={form.getValues('address')}
              initialCoordinates={form.getValues('coordinates')}
            />
          </div>

          {/* 執照資訊 */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="has_usage_license"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用執照</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="有" />
                        </FormControl>
                        <FormLabel className="font-normal">有</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="無" />
                        </FormControl>
                        <FormLabel className="font-normal">無</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="has_building_license"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>建築執照</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="有" />
                        </FormControl>
                        <FormLabel className="font-normal">有</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="無" />
                        </FormControl>
                        <FormLabel className="font-normal">無</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="部分" />
                        </FormControl>
                        <FormLabel className="font-normal">部分</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 土地資訊 */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="land_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>土地種類</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇土地種類" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="市有土地">市有土地</SelectItem>
                      <SelectItem value="國有土地">國有土地</SelectItem>
                      <SelectItem value="私有土地">私有土地</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zone_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用分區</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="例如: 鄉村區"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="land_use"
            render={({ field }) => (
              <FormItem>
                <FormLabel>土地用途</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="例如: 加油站專用區"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 面積資訊 */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>面積（平方公尺）</FormLabel>
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
              name="floor_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>樓地板面積（平方公尺）</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="例如：2樓:3729.7 3樓:3426.2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 使用狀態 */}
          <FormField
            control={form.control}
            name="usage_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>目前使用情形說明</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="請說明目前的使用情形"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usage_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>資產使用情形</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="閒置" />
                      </FormControl>
                      <FormLabel className="font-normal">閒置</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="低度利用" />
                      </FormControl>
                      <FormLabel className="font-normal">低度利用</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activation_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>活化辦理情形</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="請說明目前活化辦理的進度與情形"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimated_activation_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>預估活化時程</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_requesting_delisting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>是否申請解除列管</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value ? "true" : "false"}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">是</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">否</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delisting_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>解除列管原因</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    placeholder="若申請解除列管，請說明原因"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 備註 */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>備註</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button>提交</Button>
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
                      managing_agency: '管理機關',
                      target_name: '標的名稱',
                      district: '行政區',
                      section: '地段',
                      lot_number: '地號',
                      address: '地址',
                      coordinates: '座標',
                      has_usage_license: '使用執照',
                      has_building_license: '建築執照',
                      land_type: '土地種類',
                      zone_type: '使用分區',
                      land_use: '土地用途',
                      area: '面積（平方公尺）',
                      floor_area: '樓地板面積（平方公尺）',
                      usage_description: '目前使用情形說明',
                      usage_status: '資產使用情形',
                      activation_status: '活化辦理情形',
                      estimated_activation_date: '預估活化時程',
                      is_requesting_delisting: '是否申請解除列管',
                      delisting_reason: '解除列管原因',
                      note: '備註'
                    }[key] || key;

                    return (
                      <div key={key} className="flex">
                        <span className="w-32 flex-shrink-0">{label}:</span>
                        <span>
                          {key === 'is_requesting_delisting' 
                            ? (value ? '是' : '否')
                            : (value || '無')}
                        </span>
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

          <Input 
            type="hidden"
            {...form.register('agency_id')}
          />
          <Input 
            type="hidden"
            {...form.register('district_id')}
          />
        </form>
      </Form>
    </div>
  )
} 