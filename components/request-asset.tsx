'use client'

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { RequestAssetForm } from "./request-asset-form"
import { useState } from "react"
import { FileText, X } from "lucide-react"

export function RequestAsset() {
  const [showForm, setShowForm] = useState(false)

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">申請資產需求</h1>
          <Button 
            onClick={toggleForm}
            className="flex items-center gap-2"
            variant={showForm ? "secondary" : "default"}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                關閉表單
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                新增需求
              </>
            )}
          </Button>
        </div>

        {showForm ? (
          <RequestAssetForm />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500">
              尚無資產需求
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 