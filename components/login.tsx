'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">不動產資產管理系統 </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">帳號</Label>
            <Input id="username" placeholder="請輸入您的帳號" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <Input id="password" type="password" placeholder="請輸入您的密碼" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">登入</Button>
          <div className="flex justify-between w-full text-sm">
            <Link href="/register" className="text-blue-600 hover:underline">
              註冊新帳號
            </Link>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              忘記密碼？
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}