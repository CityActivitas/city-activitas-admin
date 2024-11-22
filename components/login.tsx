'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('登入失敗')
      }

      const data = await response.json()
      
      // 儲存 token 到 localStorage
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // 檢查用戶角色並導向對應頁面
      if (data.user?.user_metadata?.system_role === 'reporter') {
        router.push('/reporter-dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('帳號或密碼錯誤')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">資產管理系統</CardTitle>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">帳號</Label>
              <Input 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="請輸入您的帳號" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入您的密碼" 
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">登入</Button>
            <div className="flex justify-between w-full text-sm">
              {/* <Link href="/register" className="text-blue-600 hover:underline">
                註冊新帳號
              </Link>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                忘記密碼？
              </Link> */}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}