'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Upload } from 'lucide-react'
import { DistrictSelectorDrawerComponent } from "@/components/district-selector-drawer"
import { AgenciesDrawerComponent } from "@/components/agencies-drawer"
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
import { LandRelationsTab } from "@/components/land-relations-tab"
import { LocationDrawerComponent } from "@/components/location-drawer"
import { useToast } from "@/hooks/use-toast"
import { AssetImagesTab } from "@/components/asset-images-tab"

interface Asset {
  id: string;
  '資產類型': string;
  '管理機關': string;
  '行政區': string;
  '地段': string;
  '地址': string;
  '定位座標': string;
  '區域座標組': string;
  '標的名稱': string;
  '建立時間': string;
  '土地明細ID': string;
}

// 資產細項 
interface AssetData {
  assetId: string;
  landDetailId: string;
  assetType: string;
  department: string;
  district: string;
  section: string;
  address: string;
  coordinates: string;
  areaCoordinates: string;
  markerName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  buildingId: string;
  buildingNumber: string;
  buildingType: string;
  landArea: string;
  usage: string;
  landUsage: string;
  condition: string;
  vacancyRate: string;
  note: string;
  landNumber: string;
  landType: string;
  agency_id: string | number;
  district_id: string;
}

// 建物土地關聯細項
interface LandRelationData {
  id: string;
  landNumber: string;  // lot_number
  landType: string;    // land_type
  landManager: string; // land_manager
  createdAt: string;   // created_at
  updatedAt: string;   // updated_at
}

interface OneIdleAssetDetailProps {
  assetId: string;
  onBack: () => void;
  assetData: Asset;
  onUpdateSuccess?: () => void;
}

export function OneIdleAssetDetail({ assetId, onBack, assetData, onUpdateSuccess }: OneIdleAssetDetailProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState<AssetData>({
    assetId: assetData.id || '',
    landDetailId: assetData['土地明細ID'] || '',
    assetType: assetData['資產類型'] || '',
    department: assetData['管理機關'] || '',
    district: assetData['行政區'] || '',
    section: assetData['地段'] || '',
    address: assetData['地址'] || '',
    coordinates: assetData['定位座標'] || '',
    areaCoordinates: assetData['區域座標組'] || '',
    markerName: assetData['標的名稱'] || '',
    status: '未活化',
    createdAt: assetData['建立時間'] || '',
    updatedAt: '',
    buildingId: '',
    buildingNumber: '',
    buildingType: '',
    landArea: '',
    usage: '',
    landUsage: '',
    condition: '',
    vacancyRate: '',
    note: '',
    landNumber: '',
    landType: '',
    agency_id: '',
    district_id: ''
  })

  const [landRelationData, setLandRelationData] = useState<LandRelationData[]>([])
  const [hasLandRelations, setHasLandRelations] = useState<boolean>(false)

  const [originalData, setOriginalData] = useState<AssetData>(formData)
  const [isModified, setIsModified] = useState(false)

  const [locationDrawerOpen, setLocationDrawerOpen] = useState(false)

  useEffect(() => {
    setIsModified(JSON.stringify(formData) !== JSON.stringify(originalData))
  }, [formData, originalData])

  useEffect(() => {
    let isMounted = true;

    const fetchAssetDetails = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const isBuilding = assetData['資產類型'].includes('建物');
      const endpoint = isBuilding 
        ? `http://localhost:8000/api/v1/idle/buildings/${assetId}`
        : `http://localhost:8000/api/v1/idle/lands/${assetId}`;

      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch asset details');

        const detailData = await response.json();
        
        if (!isMounted) return;

        if (isBuilding) {
          setFormData(prev => {
            const newData = {
              ...prev,
              buildingId: detailData['建物明細ID']?.toString() || '',
              buildingNumber: detailData['建號'] || '',
              buildingType: detailData['建物類型'] || '',
              landArea: detailData['樓地板面積'] || '',
              usage: detailData['使用分區'] || '',
              landUsage: detailData['土地用途'] || '',
              condition: detailData['使用現況'] || '',
              vacancyRate: detailData['空置比例(%)']?.toString() || '',
              note: detailData['建物備註'] || '',
              landNumber: detailData['宗地地號'] || '',
              landType: detailData['土地類型'] || ''
            };
            setOriginalData(newData);
            return newData;
          });
        } else {
          setFormData(prev => {
            const newData = {
              ...prev,
              landDetailId: detailData['土地明細ID']?.toString() || '',
              landNumber: detailData['地號'] || '',
              landType: detailData['土地類型'] || '',
              landArea: detailData['面積(平方公尺)']?.toString() || '',
              usage: detailData['使用分區'] || '',
              landUsage: detailData['土地用途'] || '',
              condition: detailData['現況'] || '',
              vacancyRate: detailData['空置比例(%)']?.toString() || '',
              note: detailData['備註'] || ''
            };
            setOriginalData(newData);
            return newData;
          });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching asset details:', error);
      }
    };

    fetchAssetDetails();

    return () => {
      isMounted = false;
    };
  }, [assetId, assetData]);

  useEffect(() => {
    let isMounted = true;

    const fetchLandRelations = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8000/api/v1/idle/buildings/${assetId}/lands`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch land relations');

        const data = await response.json();
        
        if (!isMounted) return;

        const formattedData = data.map((item: any) => ({
          id: item.id.toString(),
          landNumber: item.lot_number || '',
          landType: item.land_type || '',
          landManager: item.land_manager || '',
          createdAt: item.created_at || '',
          updatedAt: item.updated_at || ''
        }));

        setLandRelationData(formattedData);
        setHasLandRelations(formattedData.length > 0);
      } catch (error) {
        console.error('Error fetching land relations:', error);
        setHasLandRelations(false);
      }
    };

    if (assetData['資產類型'].includes('建物')) {
      fetchLandRelations();
    }

    return () => {
      isMounted = false;
    };
  }, [assetId, assetData]);

  const handleInputChange = (field: keyof AssetData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // 定義各類欄位
      const assetFields = ['assetType', 'agency_id', 'district_id', 'section', 'address', 
        'coordinates', 'areaCoordinates', 'markerName', 'status'];
      
      const buildingFields = ['buildingNumber', 'buildingType', 'landArea', 'usage', 
        'landUsage', 'condition', 'vacancyRate', 'note'];
      
      const landFields = ['landNumber', 'landType', 'landArea', 'usage', 
        'landUsage', 'condition', 'vacancyRate', 'note'];

      const changedFields = Object.keys(formData).reduce((acc: Partial<AssetData>, key) => {
        const typedKey = key as keyof AssetData;
        if (JSON.stringify(formData[typedKey]) !== JSON.stringify(originalData[typedKey])) {
          acc[typedKey] = formData[typedKey];
        }
        return acc;
      }, {});

      if (Object.keys(changedFields).length === 0) return;

      const updates = [];

      // 資產基本資料欄位映��
      const assetFieldsMap: { [key: string]: string } = {
        assetType: 'type',
        agency_id: 'agency_id',
        district_id: 'district_id',
        section: 'section',
        address: 'address',
        coordinates: 'coordinates',
        areaCoordinates: 'area_coordinates',
        markerName: 'target_name',
        status: 'status'
      };

      // 處理資產基本資料更新
      const assetPayload: any = {};
      Object.entries(assetFieldsMap).forEach(([formKey, dbKey]) => {
        if (formKey in changedFields) {
          assetPayload[dbKey] = changedFields[formKey as keyof AssetData];
        }
      });

      if (Object.keys(assetPayload).length > 0) {
        updates.push(
          fetch(`http://localhost:8000/api/v1/assets/${formData.assetId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(assetPayload)
          })
        );
      }

      // 建物欄位映射
      const buildingFieldsMap: { [key: string]: string } = {
        buildingNumber: 'building_number',
        buildingType: 'building_type',
        landArea: 'floor_area',      // 注意：前端的 landArea 對應到 floor_area
        usage: 'zone_type',
        landUsage: 'land_use',
        condition: 'current_status',
        vacancyRate: 'vacancy_rate',
        note: 'note'
      };

      // 處理建物細節更新
      if (formData.assetType.includes('建物')) {
        const buildingPayload: any = {};
        Object.entries(buildingFieldsMap).forEach(([formKey, dbKey]) => {
          if (formKey in changedFields) {
            // 注意：vacancy_rate 在建物表是 varchar 類型
            buildingPayload[dbKey] = changedFields[formKey as keyof AssetData];
          }
        });

        if (Object.keys(buildingPayload).length > 0) {
          updates.push(
            fetch(`http://localhost:8000/api/v1/assets/buildings/${formData.buildingId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(buildingPayload)
            })
          );
        }
      }

      // 土地欄位映射
      const landFieldsMap: { [key: string]: string } = {
        landNumber: 'lot_number',
        landType: 'land_type',
        landArea: 'area',
        usage: 'zone_type',
        landUsage: 'land_use',
        condition: 'current_status',
        vacancyRate: 'vacancy_rate',
        note: 'note'
      };

      // 處理土地細節更新
      if (!formData.assetType.includes('建物')) {
        const landPayload: any = {};
        Object.entries(landFieldsMap).forEach(([formKey, dbKey]) => {
          if (formKey in changedFields) {
            if (dbKey === 'area' || dbKey === 'vacancy_rate') {
              landPayload[dbKey] = Number(changedFields[formKey as keyof AssetData]) || 0;
            } else {
              landPayload[dbKey] = changedFields[formKey as keyof AssetData];
            }
          }
        });

        if (Object.keys(landPayload).length > 0) {
          updates.push(
            fetch(`http://localhost:8000/api/v1/assets/lands/${formData.landDetailId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(landPayload)
            })
          );
        }
      }

      // 執行所有更新
      const results = await Promise.all(updates);
      const hasError = results.some(res => !res.ok);

      if (hasError) {
        throw new Error('部分更新失敗');
      }

      setOriginalData(formData);
      setIsModified(false);
      
      // 顯示成功訊息
      toast({
        title: "更新成功",
        description: "資產資料已成功更新",
      });

      // 通知父組件更新成功
      onUpdateSuccess?.();
      
      // 返回列表
      onBack();

    } catch (error) {
      console.error('更新錯誤:', error);
      toast({
        variant: "destructive",
        title: "更新失敗",
        description: "更新資料時發生錯誤，請稍後再試",
      });
    }
  };

  const renderDetailFields = () => {
    const isBuilding = assetData['資產類型'].includes('建物');
    
    if (isBuilding) {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>建物明細ID</Label>
            <Input 
              value={formData.buildingId}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>建號</Label>
            <Input 
              value={formData.buildingNumber}
              onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>建物種類</Label>
            <Input 
              value={formData.buildingType}
              onChange={(e) => handleInputChange('buildingType', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>樓地板面積</Label>
            <Input 
              value={formData.landArea}
              onChange={(e) => handleInputChange('landArea', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>使用分區</Label>
            <Input 
              value={formData.usage}
              onChange={(e) => handleInputChange('usage', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>土地用途</Label>
            <Input 
              value={formData.landUsage}
              onChange={(e) => handleInputChange('landUsage', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>現況</Label>
            <Input 
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>空置比例</Label>
            <Input 
              value={formData.vacancyRate}
              onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>備註</Label>
            <Input 
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>土地明細ID</Label>
            <Input 
              value={formData.landDetailId}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label>地號</Label>
            <Input 
              value={formData.landNumber}
              onChange={(e) => handleInputChange('landNumber', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>土地類型</Label>
            <Input 
              value={formData.landType}
              onChange={(e) => handleInputChange('landType', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>面積(平方公尺)</Label>
            <Input 
              value={formData.landArea}
              onChange={(e) => handleInputChange('landArea', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>使用分區</Label>
            <Input 
              value={formData.usage}
              onChange={(e) => handleInputChange('usage', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>土地用途</Label>
            <Input 
              value={formData.landUsage}
              onChange={(e) => handleInputChange('landUsage', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>現況</Label>
            <Input 
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>空置比例(%)</Label>
            <Input 
              value={formData.vacancyRate}
              onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>備註</Label>
            <Input 
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
            />
          </div>
        </div>
      );
    }
  };


  return (
    <div className="container mx-auto px-4 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Button 
          onClick={onBack} 
          variant="ghost"
          className="hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>回閒置資產列表</span>
        </Button>
      </div>

      <Tabs defaultValue="asset-details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="asset-details">資產細項</TabsTrigger>
          <TabsTrigger value="image-list">圖片列表</TabsTrigger>
          {hasLandRelations && (
            <TabsTrigger value="land-relations">建物土地關聯細項</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="asset-details">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>資產ID</Label>
                    <Input 
                      value={formData.assetId}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>資產種類</Label>
                    <Input 
                      value={formData.assetType}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>管理機關</Label>
                    <AgenciesDrawerComponent 
                      currentUnit={formData.department}
                      onUnitSelect={(unit) => {
                        handleInputChange('department', unit.name);
                        handleInputChange('agency_id', unit.id.toString());
                      }}
                    />
                    <Input 
                      type="hidden"
                      value={formData.agency_id}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>行政區</Label>
                    <DistrictSelectorDrawerComponent 
                      currentDistrict={formData.district}
                      onDistrictSelect={(district) => {
                        handleInputChange('district', district.name);
                        handleInputChange('district_id', district.id.toString());
                      }}
                    />
                    <Input 
                      type="hidden"
                      value={formData.district_id}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>地段</Label>
                    <Input 
                      value={formData.section}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>地址</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        onClick={() => setLocationDrawerOpen(true)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>定位座標</Label>
                    <Input 
                      value={formData.coordinates}
                      onChange={(e) => handleInputChange('coordinates', e.target.value)}
                      onClick={() => setLocationDrawerOpen(true)}
                      readOnly
                    />
                  </div>
                  <LocationDrawerComponent 
                    open={locationDrawerOpen} 
                    onOpenChange={setLocationDrawerOpen}
                    onConfirm={(address, coordinates) => {
                      handleInputChange('address', address);
                      handleInputChange('coordinates', coordinates);
                    }}
                    initialAddress={formData.address}
                    initialCoordinates={formData.coordinates}
                  />
                  <div className="space-y-2">
                    <Label>區域座標組</Label>
                    <Input 
                      value={formData.areaCoordinates}
                      onChange={(e) => handleInputChange('areaCoordinates', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>標的名稱</Label>
                    <Input 
                      value={formData.markerName}
                      onChange={(e) => handleInputChange('markerName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>狀態</Label>
                    <Input 
                      value={formData.status}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>建立時間</Label>
                    <Input 
                      value={formData.createdAt}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>修改時間</Label>
                    <Input 
                      value={formData.updatedAt}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                {renderDetailFields()}

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFormData(originalData)}
                    disabled={!isModified}
                  >
                    取消
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button disabled={!isModified}>
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
                        {Object.entries(formData).map(([key, value]) => {
                          const isModified = originalData[key as keyof AssetData] !== value;
                          const label = {
                            assetId: '資產ID',
                            assetType: '資產種類',
                            department: '管理機關',
                            agency_id: '管理機關ID',
                            district: '行政區',
                            district_id: '行政區ID',
                            section: '地段',
                            address: '地址',
                            coordinates: '定位座標',
                            areaCoordinates: '區域座標組',
                            markerName: '標的名稱',
                            status: '狀態',
                            createdAt: '建立時間',
                            updatedAt: '修改時間',
                            buildingId: '建物明細ID',
                            landDetailId: '土地明細ID',
                            buildingNumber: '建號',
                            buildingType: '建物類型',
                            landArea: '面積',
                            usage: '使用分區',
                            landUsage: '土地用途',
                            condition: '現況',
                            vacancyRate: '空置比例',
                            note: '備註',
                            landNumber: '地號',
                            landType: '土地類型'
                          }[key];

                          return (
                            <div key={key} className="flex">
                              <span className="w-24 flex-shrink-0">{label}:</span>
                              <span className={`${isModified ? "font-bold text-red-500" : ""}`}>
                                {value || '無'}
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
                        <Button onClick={handleSubmit}>
                          確認修改
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="image-list">
          <AssetImagesTab assetId={formData.assetId} />
        </TabsContent>
        <TabsContent value="land-relations">
          <LandRelationsTab landRelationData={landRelationData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}