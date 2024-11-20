export type Asset = {
  id: string
  '資產類型': string
  '管理機關': string
  '行政區': string
  '地段': string
  '地址': string
  '定位座標': string
  '區域座標組': string
  '標的名稱': string
  '建立時間': string
  '土地明細ID': string | null
  '建物明細ID': string | null
}

export type SortConfig = {
  key: keyof Asset | null
  direction: 'asc' | 'desc'
} 