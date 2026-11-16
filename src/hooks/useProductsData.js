import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { isConvexConfigured } from '../convexClient';
import { PRODUCTS } from '../data/products';

// 1. Hook used when Convex Cloud URL is connected via Vercel
export function useConvexStore(initialProducts = PRODUCTS, onToast) {
  const convexItems = useQuery(api.products?.list || 'products:list');
  const addMutation = useMutation(api.products?.add || 'products:add');
  const updateMutation = useMutation(api.products?.update || 'products:update');
  const removeMutation = useMutation(api.products?.remove || 'products:remove');
  const updateStockMutation = useMutation(api.products?.updateStock || 'products:updateStock');
  const seedMutation = useMutation(api.products?.seedDefault || 'products:seedDefault');
  const resetMutation = useMutation(api.products?.resetToDefaults || 'products:resetToDefaults');

  const hasSeededRef = useRef(false);
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState(() => new Set());

  // Auto-seed default products into Convex on very first deployment ONLY
  useEffect(() => {
    if (!convexItems || !Array.isArray(convexItems)) return;

    if (convexItems.length > 0) {
      try {
        localStorage.setItem('icon_catalog_initialized', 'true');
      } catch {}
      return;
    }

    // Database is empty (length === 0)
    let isInitialized = false;
    try {
      isInitialized = localStorage.getItem('icon_catalog_initialized') === 'true';
    } catch {}

    // Only seed if this is truly the first brand-new launch, never re-seed after intentional deletions
    if (!isInitialized && !hasSeededRef.current && typeof seedMutation === 'function') {
      hasSeededRef.current = true;
      try {
        localStorage.setItem('icon_catalog_initialized', 'true');
      } catch {}
      seedMutation({ initialProducts })
        .then(() => {
          onToast?.('Initialized Convex cloud database with Brisbane hire catalog', 'gold');
        })
        .catch((err) => console.warn('Convex seeding note:', err?.message || err));
    }
  }, [convexItems, initialProducts, seedMutation, onToast]);

  // Compute live products: when Convex items array is available (even if length is 0), respect it!
  const products = useMemo(() => {
    if (!Array.isArray(convexItems)) {
      // Still loading initial connection
      return initialProducts;
    }
    return convexItems.filter(p => !optimisticDeletedIds.has(p.id) && !optimisticDeletedIds.has(p._id));
  }, [convexItems, initialProducts, optimisticDeletedIds]);

  const handleAdd = async (newProd) => {
    try {
      const { _id, _creationTime, ...cleanProd } = newProd;
      await addMutation(cleanProd);
      if (cleanProd.id) {
        setOptimisticDeletedIds(prev => {
          const next = new Set(prev);
          next.delete(cleanProd.id);
          return next;
        });
      }
      onToast?.(`Added "${newProd.name}" to cloud database`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to add to Convex cloud', 'warning');
    }
  };

  const handleUpdate = async (updatedProd) => {
    try {
      await updateMutation({
        id: updatedProd.id || updatedProd._id,
        name: updatedProd.name,
        category: updatedProd.category,
        categoryLabel: updatedProd.categoryLabel,
        priceAUD: updatedProd.priceAUD,
        bondAUD: updatedProd.bondAUD,
        stock: updatedProd.stock,
        sku: updatedProd.sku,
        badge: updatedProd.badge,
        image: updatedProd.image,
        description: updatedProd.description,
        material: updatedProd.material,
        dimensions: updatedProd.dimensions,
        hirePeriod: updatedProd.hirePeriod
      });
      onToast?.(`Updated "${updatedProd.name}" in real-time`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to update in Convex cloud', 'warning');
    }
  };

  const handleDelete = async (prodId) => {
    if (!prodId) return;
    // 1. Instantly hide item from UI optimistically so deletion feels instantaneous
    setOptimisticDeletedIds(prev => new Set([...prev, prodId]));
    try {
      await removeMutation({ id: prodId });
      onToast?.('Removed equipment from cloud database', 'gold');
    } catch (e) {
      console.error(e);
      // Revert optimistic delete on error
      setOptimisticDeletedIds(prev => {
        const next = new Set(prev);
        next.delete(prodId);
        return next;
      });
      onToast?.('Failed to delete from Convex cloud', 'warning');
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await updateStockMutation({ id, stock: newStock });
      onToast?.('Cloud stock inventory updated', 'gold');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    try {
      setOptimisticDeletedIds(new Set());
      if (typeof resetMutation === 'function') {
        await resetMutation({ defaultProducts: initialProducts });
      } else {
        await seedMutation({ initialProducts });
      }
      try {
        localStorage.setItem('icon_catalog_initialized', 'true');
      } catch {}
      onToast?.('Reset Convex cloud catalog to official defaults', 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to reset catalog', 'warning');
    }
  };

  return {
    products,
    isRealtime: true,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleUpdateStock,
    handleReset
  };
}

// 2. Hook used when Convex URL is not configured yet (local state + localStorage)
export function useLocalStore(initialProducts = PRODUCTS, onToast) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('icon_products_inventory');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('icon_products_inventory', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const handleAdd = (newProd) => {
    setProducts(prev => [newProd, ...prev]);
    onToast?.(`Added "${newProd.name}" to Brisbane catalog`, 'gold');
  };

  const handleUpdate = (updatedProd) => {
    setProducts(prev =>
      prev.map(p => ((p.id === updatedProd.id || (p._id && p._id === updatedProd._id)) ? updatedProd : p))
    );
    onToast?.(`Updated "${updatedProd.name}" successfully`, 'gold');
  };

  const handleDelete = (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId && p._id !== prodId));
    onToast?.('Removed equipment from inventory', 'gold');
  };

  const handleUpdateStock = (id, newStock) => {
    setProducts(prev =>
      prev.map(p => ((p.id === id || p._id === id) ? { ...p, stock: newStock } : p))
    );
    onToast?.('Equipment inventory stock updated', 'gold');
  };

  const handleReset = () => {
    setProducts(initialProducts);
    try {
      localStorage.removeItem('icon_products_inventory');
    } catch {}
    onToast?.('Restored official Brisbane equipment catalog', 'gold');
  };

  return {
    products,
    isRealtime: false,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleUpdateStock,
    handleReset
  };
}
