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

const formSchema = z.object({
  managing_agency: z.string().min(1, { message: "請輸入管理機關" }),
  asset_name: z.string().min(1, { message: "請輸入標的名稱" }),
  district_id: z.string().min(1, { message: "請選擇行政區" }),
  section: z.string().min(1, { message: "請輸入地段" }),
  lot_number: z.string().min(1, { message: "請輸入地號" }),
  address: z.string().min(1, { message: "請輸入地址" }),
  coordinates: z.string().optional(),
  usage_license: z.enum(["有", "無"]).optional(),
  building_license: z.enum(["有", "無", "部分"]).optional(),
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
  estimated_schedule: z.string().optional(),
  delisting_request: z.boolean().optional(),
  delisting_reason: z.string().optional(),
  notes: z.string().optional(),
})

export function ReportAssetForm() {
  const [locationDrawerOpen, setLocationDrawerOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      managing_agency: "",
      asset_name: "",
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
      estimated_schedule: "",
      delisting_request: false,
      delisting_reason: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // TODO: 實作提交邏輯
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
                      onUnitSelect={(unit) => field.onChange(unit)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asset_name"
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
              name="district_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>行政區</FormLabel>
                  <FormControl>
                    <DistrictSelectorDrawerComponent
                      currentDistrict={field.value}
                      onDistrictSelect={(district) => field.onChange(district)}
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
              name="usage_license"
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
              name="building_license"
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
            name="estimated_schedule"
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
            name="delisting_request"
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
            name="notes"
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
            <Button type="submit">提交</Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 