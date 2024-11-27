import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { useDropzone } from 'react-dropzone'
import { useToast } from "@/hooks/use-toast"

interface AssetImage {
  id: number
  storage_url: string
  title: string
  description: string
  created_at: string
  updated_at: string
  editor_email: string
  file_name: string
  file_size: number
  mime_type: string
}

interface AssetImagesTabProps {
  assetId: string
}

export function AssetImagesTab({ assetId }: AssetImagesTabProps) {
  const { toast } = useToast()
  const [images, setImages] = useState<AssetImage[]>([])
  const [showUploadCard, setShowUploadCard] = useState(false)
  const [imageTitle, setImageTitle] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 取得圖片列表
  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `http://localhost:8000/api/v1/assets/${assetId}/images`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to fetch images')
      
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching images:', error)
      toast({
        title: "載入失敗",
        description: "無法取得圖片列表",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchImages()
  }, [assetId])

  const sanitizeFileName = (fileName: string) => {
    // 取得檔案副檔名
    const ext = fileName.split('.').pop()
    // 生成隨機檔名 (timestamp + 隨機字串)
    const randomName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    return `${randomName}.${ext}`
  }

  const handleUpload = async () => {
    if (!selectedFile || !imageTitle) return

    try {
      const token = localStorage.getItem('access_token')
      
      // 建立新的 File 物件，使用處理過的檔名
      const sanitizedFile = new File(
        [selectedFile],
        sanitizeFileName(selectedFile.name),
        { type: selectedFile.type }
      )
      
      // 建立 FormData
      const formData = new FormData()
      formData.append('file', sanitizedFile)

      // 將 title 和 description 作為 query parameters
      const queryParams = new URLSearchParams({
        title: imageTitle,
      })
      if (imageDescription) {
        queryParams.append('description', imageDescription)
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/assets/${assetId}/images?${queryParams.toString()}`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || '上傳失敗')
      }

      const result = await response.json()
      
      // 顯示成功訊息
      toast({
        title: "上傳成功",
        description: "圖片已成功上傳",
        variant: "default",
      })

      // 清除表單並關閉上傳區塊
      handleReset()
      setShowUploadCard(false)
      
      // TODO: 重新載入圖片列表
      
    } catch (error) {
      console.error('Error uploading image:', error)
      // 顯示錯誤訊息
      toast({
        title: "上傳失敗",
        description: error instanceof Error ? error.message : "圖片上傳時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 集中處理重置表單的邏輯
  const handleReset = () => {
    setPreviewImage(null)
    setImageTitle('')
    setImageDescription('')
    setSelectedFile(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB 限制
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setSelectedFile(file)
        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]
      let errorMessage = "檔案上傳失敗"
      
      if (error?.code === "file-too-large") {
        errorMessage = "檔案大小不能超過 5MB"
      } else if (error?.code === "file-invalid-type") {
        errorMessage = "只接受 PNG、JPG、GIF 圖片格式"
      }

      toast({
        title: "檔案錯誤",
        description: errorMessage,
        variant: "destructive",
      })
    }
  })

  // 格式化檔案大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 格式化時間
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW')
  }

  return (
    <div className="space-y-4">
      {/* 上傳按鈕 */}
      <div className="flex justify-end">
        <Button onClick={() => {
          setShowUploadCard(!showUploadCard)
          if (!showUploadCard) {
            handleReset()
          }
        }}>
          {showUploadCard ? (
            <>
              <X className="w-4 h-4 mr-2" />
              取消新增
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              新增圖片
            </>
          )}
        </Button>
      </div>

      {/* 上傳卡片 */}
      {showUploadCard && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* 拖拉上傳區域 */}
            <div
              {...getRootProps()}
              className={`
                p-8 border-2 border-dashed rounded-lg cursor-pointer
                transition-colors duration-200
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-200'}
              `}
            >
              <input {...getInputProps()} />
              {previewImage ? (
                <div className="relative w-full aspect-video">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewImage(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  {isDragActive ? (
                    <p>將圖片拖放到這裡 ...</p>
                  ) : (
                    <p>將圖片拖放到這裡，或點擊選擇圖片</p>
                  )}
                </div>
              )}
            </div>

            {/* 圖片資訊表單 */}
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="圖片標題"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="圖片描述"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                清除
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !imageTitle}
              >
                新增
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 圖片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.length > 0 ? (
          images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={image.storage_url}
                  alt={image.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="text-xs text-gray-400 space-y-1">
                  <p>大小：{formatFileSize(image.file_size)}</p>
                  <p>上傳者：{image.editor_email}</p>
                  <p>更新時間：{formatDate(image.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            尚無圖片
          </div>
        )}
      </div>
    </div>
  )
} 