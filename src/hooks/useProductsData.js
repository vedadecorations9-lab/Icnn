import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { isConvexConfigured } from '../convexClient';
import { PRODUCTS } from '../data/products';

// 1. Hook used when Convex Cloud URL is connected via Vercel
export function useConvexStore(initialProducts = PRODUCTS, onToast) {
  const convexItems = useQuery(api.products.list);
  const addMutation = useMutation(api.products.add);
  const updateMutation = useMutation(api.products.update);
  const removeMutation = useMutation(api.products.remove);
  const updateStockMutation = useMutation(api.products.updateStock);
  const seedMutation = useMutation(api.products.seedDefault);

  const hasSeededRef = useRef(false);

  // Auto-seed default 22 products into Convex if database is empty on first run
  useEffect(() => {
    if (convexItems && convexItems.length === 0 && !hasSeededRef.current) {
      hasSeededRef.current = true;
      seedMutation({ initialProducts })
        .then(() => {
          onToast?.('Initialized Convex cloud database with Brisbane hire catalog', 'gold');
        })
        .catch((err) => console.error('Convex seeding error:', err));
    }
  }, [convexItems, initialProducts, seedMutation, onToast]);

  // If Convex has loaded items, use them; otherwise fallback while loading
  const products = convexItems && convexItems.length > 0 ? convexItems : initialProducts;

  const handleAdd = async (newProd) => {
    try {
      await addMutation(newProd);
      onToast?.(`Added "${newProd.name}" to cloud database`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to add to Convex cloud', 'warning');
    }
  };

  const handleUpdate = async (updatedProd) => {
    try {
      await updateMutation({
        id: updatedProd.id,
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
    try {
      await removeMutation({ id: prodId });
      onToast?.('Removed equipment from cloud database', 'gold');
    } catch (e) {
      console.error(e);
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
      for (const p of products) {
        await removeMutation({ id: p.id }).catch(() => {});
      }
      await seedMutation({ initialProducts });
      onToast?.('Reset Convex cloud catalog to official defaults', 'gold');
    } catch (e) {
      console.error(e);
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
      return saved ? JSON.parse(saved) : initialProducts;
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
      prev.map(p => (p.id === updatedProd.id ? updatedProd : p))
    );
    onToast?.(`Updated "${updatedProd.name}" successfully`, 'gold');
  };

  const handleDelete = (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
    onToast?.('Removed equipment from inventory', 'gold');
  };

  const handleUpdateStock = (id, newStock) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stock: newStock } : p))
    );
    onToast?.('Equipment inventory stock updated', 'gold');
  };

  const handleReset = () => {
    setProducts(initialProducts);
    localStorage.removeItem('icon_products_inventory');
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

