import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { categories, InsertCategory } from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const categoriesRouter = router({
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const results = await db.select().from(categories);
    return results;
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }

      const category: InsertCategory = {
        name: input.name,
        slug: input.slug,
        description: input.description,
      };

      const result = await db.insert(categories).values(category);
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized: admin access required");
      }

      const updateData: Record<string, any> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;

      await db.update(categories).set(updateData).where(eq(categories.id, input.id));
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

      await db.delete(categories).where(eq(categories.id, input));
      return { success: true };
    }),
});
