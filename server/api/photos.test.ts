import { describe, it, expect, vi, beforeEach } from "vitest";
import { photosRouter } from "./photos";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";

vi.mock("../db");
vi.mock("../storage");

describe("Photos Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("should return photos without category filter", async () => {
      const mockPhotos = [
        {
          id: 1,
          title: "Wedding Photo",
          description: "Beautiful wedding",
          categoryId: 1,
          imageUrl: "https://example.com/photo1.jpg",
          uploadedById: 1,
          featured: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(mockPhotos),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = photosRouter.createCaller({
        user: { id: 1, role: "user" } as any,
      } as any);

      const result = await caller.list({ limit: 12, offset: 0 });
      expect(result).toEqual(mockPhotos);
    });

    it("should filter photos by category", async () => {
      const mockPhotos = [
        {
          id: 1,
          title: "Wedding Photo",
          categoryId: 1,
          imageUrl: "https://example.com/photo1.jpg",
          uploadedById: 1,
          featured: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue(mockPhotos),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = photosRouter.createCaller({
        user: { id: 1, role: "user" } as any,
      } as any);

      const result = await caller.list({ categoryId: 1, limit: 12, offset: 0 });
      expect(result).toEqual(mockPhotos);
    });
  });

  describe("featured", () => {
    it("should return featured photos", async () => {
      const mockPhotos = [
        {
          id: 1,
          title: "Featured Wedding",
          categoryId: 1,
          imageUrl: "https://example.com/photo1.jpg",
          uploadedById: 1,
          featured: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockPhotos),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = photosRouter.createCaller({
        user: { id: 1, role: "user" } as any,
      } as any);

      const result = await caller.featured({ limit: 6 });
      expect(result).toEqual(mockPhotos);
    });
  });

  describe("create", () => {
    it("should require admin role", async () => {
      const mockDb = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue({ insertId: 1 }),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = photosRouter.createCaller({
        user: { id: 1, role: "user" } as any,
      } as any);

      await expect(
        caller.create({
          title: "Test Photo",
          categoryId: 1,
          imageUrl: "https://example.com/photo.jpg",
        })
      ).rejects.toThrow("Unauthorized: admin access required");
    });

    it("should create photo for admin users", async () => {
      const mockDb = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockResolvedValue({ insertId: 1 }),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = photosRouter.createCaller({
        user: { id: 1, role: "admin" } as any,
      } as any);

      const result = await caller.create({
        title: "Test Photo",
        categoryId: 1,
        imageUrl: "https://example.com/photo.jpg",
      });

      expect(result).toBeDefined();
    });
  });
});
