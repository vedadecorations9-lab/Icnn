import { useState, useEffect, useRef } from 'react';
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

  const hasSeededRef = useRef(false);

  // Auto-seed default 10 categories into Convex if database is empty on first run
  useEffect(() => {
    if (convexItems && convexItems.length === 0 && !hasSeededRef.current && seedMutation) {
      hasSeededRef.current = true;
      seedMutation({ initialCategories })
        .then(() => {
          onToast?.('Initialized Convex cloud database with Brisbane hire categories', 'gold');
        })
        .catch((err) => console.error('Convex categories seeding error:', err));
    }
  }, [convexItems, initialCategories, seedMutation, onToast]);

  const categories = convexItems && convexItems.length > 0 ? convexItems : initialCategories;

  const handleAddCategory = async (newCat) => {
    try {
      await addMutation(newCat);
      onToast?.(`Added "${newCat.label}" category to cloud database`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to add category to Convex cloud', 'warning');
    }
  };

  const handleUpdateCategory = async (updatedCat) => {
    try {
      await updateMutation({
        id: updatedCat.id,
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
    try {
      await removeMutation({ id: catId });
      onToast?.('Removed category card from cloud database', 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to delete category from Convex cloud', 'warning');
    }
  };

  const handleResetCategories = async () => {
    try {
      for (const c of categories) {
        await removeMutation({ id: c.id }).catch(() => {});
      }
      await seedMutation({ initialCategories });
      onToast?.('Reset categories to default Brisbane catalog', 'gold');
    } catch (e) {
      console.error(e);
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
      return saved ? JSON.parse(saved) : initialCategories;
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
      prev.map(c => (c.id === updatedCat.id ? updatedCat : c))
    );
    onToast?.(`Updated "${updatedCat.label}" category card`, 'gold');
  };

  const handleDeleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    onToast?.('Removed category card from catalog', 'gold');
  };

  const handleResetCategories = () => {
    setCategories(initialCategories);
    localStorage.removeItem('icon_categories_inventory');
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

