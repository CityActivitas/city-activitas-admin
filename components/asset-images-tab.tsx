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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
      console.log('Dropped files:', acceptedFiles)
      // 創建預覽URL
      const file = acceptedFiles[0]
      if (file) {
        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)
      }
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
                }}
              >
                清除
              </Button>
              <Button>
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