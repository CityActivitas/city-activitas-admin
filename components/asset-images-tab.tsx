import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X } from "lucide-react"
import { useDropzone } from 'react-dropzone'

interface AssetImagesTabProps {
  assetId: string
}

export function AssetImagesTab({ assetId }: AssetImagesTabProps) {
  const [showUploadCard, setShowUploadCard] = useState(false)
  const [imageTitle, setImageTitle] = useState('')
  const [imageDescription, setImageDescription] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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
      console.log('Upload success:', result)

      // 上傳成功後清除表單
      setShowUploadCard(false)
      setPreviewImage(null)
      setImageTitle('')
      setImageDescription('')
      setSelectedFile(null)
      
      // TODO: 重新載入圖片列表
      
    } catch (error) {
      console.error('Error uploading image:', error)
      // TODO: 顯示錯誤訊息給使用者
    }
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
      // TODO: 顯示錯誤訊息給使用者
      console.error('File rejected:', fileRejections)
    }
  })

  return (
    <div className="space-y-4">
      {/* 上傳按鈕 */}
      <div className="flex justify-end">
        <Button onClick={() => {
          setShowUploadCard(!showUploadCard)
          if (!showUploadCard) {
            setPreviewImage(null)
            setImageTitle('')
            setImageDescription('')
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
                onClick={() => {
                  setPreviewImage(null)
                  setImageTitle('')
                  setImageDescription('')
                  setSelectedFile(null)
                }}
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
      <div className="grid grid-cols-3 gap-4">
        {/* 這裡可以放圖片列表，先放個預設內容 */}
        <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-gray-500">尚無圖片</p>
        </div>
      </div>
    </div>
  )
} 