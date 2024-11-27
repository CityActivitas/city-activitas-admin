import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Pencil, Trash2, MoreVertical, Loader2 } from "lucide-react"
import { useDropzone } from 'react-dropzone'
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

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
  const [previewingImage, setPreviewingImage] = useState<AssetImage | null>(null)
  const [editingImage, setEditingImage] = useState<AssetImage | null>(null)
  const [deletingImage, setDeletingImage] = useState<AssetImage | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)

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
    if (!selectedFile || !imageTitle || !assetId) return
    
    setIsUploading(true)

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
      
      toast({
        title: "上傳成功",
        description: "圖片已成功上傳",
      })

      setImageTitle('')
      setImageDescription('')
      setSelectedFile(null)
      setPreviewImage(null)
      setShowUploadCard(false)
      await fetchImages()
      
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "上傳失敗",
        description: error instanceof Error ? error.message : "上傳圖片時發生錯誤",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
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

  // 圖片卡片點擊處理
  const handleImageClick = (image: AssetImage) => {
    setPreviewingImage(image)
  }

  // 處理編輯
  const handleEdit = async () => {
    if (!editingImage) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `http://localhost:8000/api/v1/assets/images/${editingImage.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        }
      )

      if (!response.ok) throw new Error('更新失敗')

      toast({
        title: "更新成功",
        description: "圖片資訊已更新",
      })

      // 重新載入圖片列表
      await fetchImages()
      setEditingImage(null)
    } catch (error) {
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "更新圖片資訊時發生錯誤",
        variant: "destructive",
      })
    }
  }

  // 處理刪除
  const handleDelete = async () => {
    if (!deletingImage) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `http://localhost:8000/api/v1/assets/images/${deletingImage.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error('刪除失敗')

      toast({
        title: "刪除成功",
        description: "圖片已刪除",
      })

      // 重新載入圖片列表
      await fetchImages()
      setDeletingImage(null)
    } catch (error) {
      toast({
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "刪除圖片時發生錯誤",
        variant: "destructive",
      })
    }
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
                onClick={() => {
                  setShowUploadCard(false)
                  setPreviewImage(null)
                  setImageTitle('')
                  setImageDescription('')
                  setSelectedFile(null)
                }}
                disabled={isUploading}
              >
                取消
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !imageTitle || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    上傳中...
                  </>
                ) : (
                  '新增'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 圖片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <div className="aspect-video relative">
              <img
                src={image.storage_url}
                alt={image.title}
                className="object-cover w-full h-full cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
              {/* 操作選單 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      setEditingImage(image)
                      setEditTitle(image.title)
                      setEditDescription(image.description || '')
                    }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      編輯
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeletingImage(image)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      刪除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
        ))}
      </div>

      {/* 圖片預覽 Dialog */}
      <Dialog open={!!previewingImage} onOpenChange={() => setPreviewingImage(null)}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>{previewingImage?.title}</DialogTitle>
            {previewingImage?.description && (
              <DialogDescription>
                {previewingImage.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="relative aspect-[16/9] mt-2">
            <img
              src={previewingImage?.storage_url}
              alt={previewingImage?.title}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="text-sm text-gray-500 space-y-1 mt-2">
            <p>檔案名稱：{previewingImage?.file_name}</p>
            <p>檔案大小：{previewingImage && formatFileSize(previewingImage.file_size)}</p>
            <p>檔案類型：{previewingImage?.mime_type}</p>
            <p>上傳者：{previewingImage?.editor_email}</p>
            <p>上傳時間：{previewingImage && formatDate(previewingImage.created_at)}</p>
            <p>更新時間：{previewingImage && formatDate(previewingImage.updated_at)}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 編輯 Dialog */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯圖片資訊</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">標題</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">描述</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingImage(null)}>
              取消
            </Button>
            <Button onClick={handleEdit}>
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 刪除確認 Dialog */}
      <AlertDialog open={!!deletingImage} onOpenChange={() => setDeletingImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除這張圖片嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。圖片將會從系統中永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 在上傳時為整個上傳區域添加 loading 遮罩 */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>正在上傳圖片...</span>
          </div>
        </div>
      )}
    </div>
  )
} 