import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoUpload from "@/components/admin/PhotoUpload";
import PhotoManagement from "@/components/admin/PhotoManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/");
    return null;
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
