"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, XCircle, User, CreditCard } from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  data?: any
  error?: string
}

export default function DatabaseTestPage() {
  const [connectionResult, setConnectionResult] = useState<TestResult | null>(null)
  const [userTestResult, setUserTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("password123")

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()
      setConnectionResult(result)
    } catch (error) {
      setConnectionResult({
        success: false,
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const testUserOperations = async () => {
    setLoading(true)
    try {
      // Test user registration
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: testEmail,
          password: testPassword,
        }),
      })

      const registerResult = await registerResponse.json()

      if (registerResponse.ok) {
        setUserTestResult({
          success: true,
          message: "User registration and database operations successful!",
          data: {
            user: registerResult.user,
            hasToken: !!registerResult.token,
          },
        })
      } else {
        setUserTestResult({
          success: false,
          message: "User registration failed",
          error: registerResult.error,
        })
      }
    } catch (error) {
      setUserTestResult({
        success: false,
        message: "Failed to test user operations",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      })

      const loginResult = await loginResponse.json()

      if (loginResponse.ok) {
        setUserTestResult({
          success: true,
          message: "Login successful! Database authentication working.",
          data: {
            user: loginResult.user,
            hasToken: !!loginResult.token,
          },
        })
      } else {
        setUserTestResult({
          success: false,
          message: "Login failed",
          error: loginResult.error,
        })
      }
    } catch (error) {
      setUserTestResult({
        success: false,
        message: "Failed to test login",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Test Page</h1>
          <p className="text-gray-600">Test MongoDB connection and database operations</p>
        </div>

        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              MongoDB Connection Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Test Database Connection
                </>
              )}
            </Button>

            {connectionResult && (
              <Alert variant={connectionResult.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {connectionResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">{connectionResult.message}</p>
                      {connectionResult.success && connectionResult.data && (
                        <div className="text-sm">
                          <p>Database: {connectionResult.data.database}</p>
                          <p>Collections: {connectionResult.data.collections}</p>
                        </div>
                      )}
                      {connectionResult.error && (
                        <p className="text-sm text-red-600">Error: {connectionResult.error}</p>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* User Operations Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Operations Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testPassword">Test Password</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="password123"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={testUserOperations} disabled={loading} variant="outline">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Test Registration
                  </>
                )}
              </Button>

              <Button onClick={testLogin} disabled={loading} variant="outline">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Test Login
                  </>
                )}
              </Button>
            </div>

            {userTestResult && (
              <Alert variant={userTestResult.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {userTestResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">{userTestResult.message}</p>
                      {userTestResult.success && userTestResult.data && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">User ID: {userTestResult.data.user?.id}</Badge>
                            <Badge variant="secondary">Email: {userTestResult.data.user?.email}</Badge>
                            <Badge variant="secondary">Balance: ${userTestResult.data.user?.balance || 0}</Badge>
                            <Badge variant="secondary">Bonus: ${userTestResult.data.user?.bonusBalance || 0}</Badge>
                            {userTestResult.data.hasToken && <Badge variant="secondary">✓ JWT Token</Badge>}
                          </div>
                        </div>
                      )}
                      {userTestResult.error && <p className="text-sm text-red-600">Error: {userTestResult.error}</p>}
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>MongoDB URI</Label>
                <Badge variant={process.env.MONGODB_URI ? "default" : "destructive"}>
                  {process.env.MONGODB_URI ? "✓ Configured" : "✗ Missing"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>JWT Secret</Label>
                <Badge variant={process.env.JWT_SECRET ? "default" : "destructive"}>
                  {process.env.JWT_SECRET ? "✓ Configured" : "✗ Missing"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. MongoDB URI</h4>
              <p className="text-sm text-gray-600">
                Make sure your MongoDB URI is correctly set in your .env.local file and replace{" "}
                <code>&lt;db_password&gt;</code> with your actual password.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Database Access</h4>
              <p className="text-sm text-gray-600">
                Ensure your MongoDB cluster allows connections from your IP address and the database user has proper
                permissions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Test Results</h4>
              <p className="text-sm text-gray-600">
                If tests fail, check the browser console and server logs for detailed error messages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
