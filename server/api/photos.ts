import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { photos, categories, Photo, InsertPhoto } from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { storagePut } from "../storage";

export const photosRouter = router({
  list: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        limit: z.number().default(12),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (input.categoryId) {
        const results = await db
          .select()
          .from(photos)
          .where(eq(photos.categoryId, input.categoryId))
          .orderBy(desc(photos.createdAt))
          .limit(input.limit)
          .offset(input.offset);
        return results;
      }

      const results = await db
        .select()
        .from(photos)
        .orderBy(desc(photos.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  featured: publicProcedure
    .input(z.object({ limit: z.number().default(6) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(photos)
        .where(eq(photos.featured, 1))
        .orderBy(desc(photos.createdAt))
        .limit(input.limit);

      return results;
    }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(photos)
        .where(eq(photos.id, input))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        categoryId: z.number(),
        imageUrl: z.string(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }

      const photo: InsertPhoto = {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        imageUrl: input.imageUrl,
        uploadedById: ctx.user.id,
        featured: input.featured ? 1 : 0,
      };

      const result = await db.insert(photos).values(photo);
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }

      const updateData: Record<string, any> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
      if (input.featured !== undefined) updateData.featured = input.featured ? 1 : 0;

      await db.update(photos).set(updateData).where(eq(photos.id, input.id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }

      await db.delete(photos).where(eq(photos.id, input));
      return { success: true };
    }),
});
