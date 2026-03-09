import { useState, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "@/_core/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoUpload from "@/components/admin/PhotoUpload";
import PhotoManagement from "@/components/admin/PhotoManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";

export default function Admin() {
  const { user, isAuthenticated, loading, refetchAuth } = useAuth();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await axios.post("/api/admin/login", { password });
      refetchAuth(); // Re-fetch auth status after successful login
    } catch (error) {
      setLoginError("Invalid password");
    }
  };
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your photography portfolio</p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
            <TabsTrigger value="photos">Manage Photos</TabsTrigger>
            <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <PhotoUpload />
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <PhotoManagement />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
