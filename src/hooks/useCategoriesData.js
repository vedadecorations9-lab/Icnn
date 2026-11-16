import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { isConvexConfigured } from '../convexClient';
import { CATEGORIES } from '../data/products';

// 1. Hook used when Convex Cloud URL is connected via Vercel
export function useConvexCategoriesStore(initialCategories = CATEGORIES, onToast) {
  const convexItems = useQuery(api.categories?.list || 'categories:list');
  const addMutation = useMutation(api.categories?.add || 'categories:add');
  const updateMutation = useMutation(api.categories?.update || 'categories:update');
  const removeMutation = useMutation(api.categories?.remove || 'categories:remove');
  const seedMutation = useMutation(api.categories?.seedDefault || 'categories:seedDefault');
  const resetMutation = useMutation(api.categories?.resetToDefaults || 'categories:resetToDefaults');

  const hasSeededRef = useRef(false);
  const [optimisticDeletedCatIds, setOptimisticDeletedCatIds] = useState(() => new Set());

  // Auto-seed default categories into Convex on first launch ONLY
  useEffect(() => {
    if (!convexItems || !Array.isArray(convexItems)) return;

    if (convexItems.length > 0) {
      try {
        localStorage.setItem('icon_categories_initialized', 'true');
      } catch {}
      return;
    }

    // Database categories empty (length === 0)
    let isInitialized = false;
    try {
      isInitialized = localStorage.getItem('icon_categories_initialized') === 'true';
    } catch {}

    if (!isInitialized && !hasSeededRef.current && typeof seedMutation === 'function') {
      hasSeededRef.current = true;
      try {
        localStorage.setItem('icon_categories_initialized', 'true');
      } catch {}
      seedMutation({ initialCategories })
        .then(() => {
          onToast?.('Initialized Convex cloud database with Brisbane hire categories', 'gold');
        })
        .catch((err) => console.warn('Convex categories seeding note:', err?.message || err));
    }
  }, [convexItems, initialCategories, seedMutation, onToast]);

  const categories = useMemo(() => {
    if (!Array.isArray(convexItems)) {
      return initialCategories;
    }
    return convexItems.filter(c => !optimisticDeletedCatIds.has(c.id) && !optimisticDeletedCatIds.has(c._id));
  }, [convexItems, initialCategories, optimisticDeletedCatIds]);

  const handleAddCategory = async (newCat) => {
    try {
      const { _id, _creationTime, ...cleanCat } = newCat;
      await addMutation(cleanCat);
      if (cleanCat.id) {
        setOptimisticDeletedCatIds(prev => {
          const next = new Set(prev);
          next.delete(cleanCat.id);
          return next;
        });
      }
      onToast?.(`Added "${newCat.label}" category to cloud database`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to add category to Convex cloud', 'warning');
    }
  };

  const handleUpdateCategory = async (updatedCat) => {
    try {
      await updateMutation({
        id: updatedCat.id || updatedCat._id,
        label: updatedCat.label,
        shortLabel: updatedCat.shortLabel || updatedCat.label,
        tag: updatedCat.tag,
        startingPrice: updatedCat.startingPrice,
        itemCount: updatedCat.itemCount,
        pills: updatedCat.pills,
        image: updatedCat.image,
        description: updatedCat.description
      });
      onToast?.(`Updated "${updatedCat.label}" category card`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to update category in Convex cloud', 'warning');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!catId) return;
    setOptimisticDeletedCatIds(prev => new Set([...prev, catId]));
    try {
      await removeMutation({ id: catId });
      onToast?.('Removed category card from cloud database', 'gold');
    } catch (e) {
      console.error(e);
      setOptimisticDeletedCatIds(prev => {
        const next = new Set(prev);
        next.delete(catId);
        return next;
      });
      onToast?.('Failed to delete category from Convex cloud', 'warning');
    }
  };

  const handleResetCategories = async () => {
    try {
      setOptimisticDeletedCatIds(new Set());
      if (typeof resetMutation === 'function') {
        await resetMutation({ defaultCategories: initialCategories });
      } else {
        await seedMutation({ initialCategories });
      }
      try {
        localStorage.setItem('icon_categories_initialized', 'true');
      } catch {}
      onToast?.('Reset categories to default Brisbane catalog', 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to reset categories', 'warning');
    }
  };

  return {
    categories,
    isRealtime: true,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleResetCategories
  };
}

// 2. Hook used when Convex URL is not configured yet (local state + localStorage)
export function useLocalCategoriesStore(initialCategories = CATEGORIES, onToast) {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('icon_categories_inventory');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return initialCategories;
    } catch {
      return initialCategories;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('icon_categories_inventory', JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  const handleAddCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    onToast?.(`Added "${newCat.label}" category card`, 'gold');
  };

  const handleUpdateCategory = (updatedCat) => {
    setCategories(prev =>
      prev.map(c => ((c.id === updatedCat.id || (c._id && c._id === updatedCat._id)) ? updatedCat : c))
    );
    onToast?.(`Updated "${updatedCat.label}" category card`, 'gold');
  };

  const handleDeleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId && c._id !== catId));
    onToast?.('Removed category card from catalog', 'gold');
  };

  const handleResetCategories = () => {
    setCategories(initialCategories);
    try {
      localStorage.removeItem('icon_categories_inventory');
    } catch {}
    onToast?.('Restored official Brisbane categories', 'gold');
  };

  return {
    categories,
    isRealtime: false,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleResetCategories
  };
}
