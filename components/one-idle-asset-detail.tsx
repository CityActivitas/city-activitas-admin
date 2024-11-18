'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from 'lucide-react'
import { DistrictSelectorDrawerComponent } from "@/components/district-selector-drawer"
import { AgenciesDrawerComponent } from "@/components/agencies-drawer"

interface Asset {
  id: string;
  '資產類型': string;
  '管理機關': string;
  '行政區': string;
  '地段': string;
  '地址': string;
  '標的名稱': string;
  '建立時間': string;
}

// 資產細項 
interface AssetData {
  assetId: string
  assetType: string
  department: string
  district: string
  section: string
  address: string
  coordinates: string
  areaCoordinates: string
  markerName: string
  status: string
  createdAt: string
  updatedAt: string
  buildingId: string
  buildingNumber: string
  buildingType: string
  landArea: string
  usage: string
  landUsage: string
  condition: string
  vacancyRate: string
  note: string
  landNumber: string
  landType: string
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
}

export function OneIdleAssetDetail({ assetId, onBack, assetData }: OneIdleAssetDetailProps) {
  const [formData, setFormData] = useState<AssetData>({
    assetId: assetData.id || '',
    assetType: assetData['資產類型'] || '',
    department: assetData['管理機關'] || '',
    district: assetData['行政區'] || '',
    section: assetData['地段'] || '',
    address: assetData['地址'] || '',
    coordinates: '41.40338, 2.17403',
    areaCoordinates: '41.40338, 2.17403',
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
    landType: ''
  })

  const [landRelationData, setLandRelationData] = useState<LandRelationData[]>([])
  const [hasLandRelations, setHasLandRelations] = useState<boolean>(false)

  const [originalData, setOriginalData] = useState<AssetData>(formData)
  const [isModified, setIsModified] = useState(false)

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
              buildingId: detailData['資產ID']?.toString() || '',
              buildingNumber: detailData['建號'] || '',
              buildingType: detailData['建物類型'] || '',
              landArea: detailData['樓地板面積'] || '',
              usage: detailData['使用分區'] || '',
              landUsage: detailData['土地使用'] || '',
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

  const handleSubmit = () => {
    // Here you would typically make an API call to update the data
    setOriginalData(formData)
    setIsModified(false)
  }

  const renderDetailFields = () => {
    const isBuilding = assetData['資產類型'].includes('建物');
    
    if (isBuilding) {
      return (
        <div className="grid grid-cols-2 gap-4">
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
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <button 
          onClick={onBack} 
          className="hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <Tabs defaultValue="asset-details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="asset-details">資產細項</TabsTrigger>
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
                      onUnitSelect={(unit) => handleInputChange('department', unit)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>行政區</Label>
                    <DistrictSelectorDrawerComponent 
                      currentDistrict={formData.district}
                      onDistrictSelect={(district) => handleInputChange('district', district)}
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
                    <Input 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>定位座標</Label>
                    <Input 
                      value={formData.coordinates}
                      onChange={(e) => handleInputChange('coordinates', e.target.value)}
                    />
                  </div>
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
                      onChange={(e) => handleInputChange('status', e.target.value)}
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
                  <Button 
                    onClick={handleSubmit}
                    disabled={!isModified}
                  >
                    修改
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="land-relations">
          <Card>
            <CardContent className="p-4 space-y-4">
              {landRelationData.map((land) => (
                <div key={land.id} className="grid grid-cols-2 gap-4 pb-4 border-b last:border-b-0">
                  <div className="space-y-2">
                    <Label>建物土地關聯ID</Label>
                    <Input value={land.id} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>地號</Label>
                    <Input value={land.landNumber} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>土地種類</Label>
                    <Input value={land.landType} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>土地管理者</Label>
                    <Input value={land.landManager} readOnly />
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
                    <Button variant="outline">修改</Button>
                    <Button variant="destructive" className="ml-2">刪除</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}