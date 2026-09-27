import { categories as rawCategories, serviceById, services } from "./services";
import { specialists } from "./specialists";
import type { Category, CategoryId } from "./types";

/** شمارش‌ها از خودِ داده محاسبه می‌شوند تا هیچ عددی در UI دروغگو نباشد. */
export const categories: Category[] = rawCategories.map((c) => {
  const serviceCount = services.filter((s) => s.categoryId === c.id).length;
  const specialistCount = specialists.filter(
    (sp) =>
      sp.categoryId === c.id ||
      sp.serviceIds.some((id) => serviceById[id]?.categoryId === c.id),
  ).length;
  return { ...c, serviceCount, specialistCount };
});

export const categoryById: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const popularServices = services.filter((s) => s.popular);

export const priceRange = {
  min: Math.min(...services.map((s) => s.price)),
  max: Math.max(...services.map((s) => s.price)),
};
