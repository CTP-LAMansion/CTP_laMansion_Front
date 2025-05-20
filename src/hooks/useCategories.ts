import { useState, useEffect } from 'react';
import {
  getCategories,
  addCategory,
  getCategoryById,
  updateCategory,
  patchCategory,
  deleteCategory,
} from '../services/LandingPageServices';

const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryById = async (id: number) => {
    setLoading(true);
    try {
      const data = await getCategoryById(id);
      setCategory(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (newCategory: any) => {
    setLoading(true);
    try {
      const data = await addCategory(newCategory);
      setCategories([...categories, data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const modifyCategory = async (id: number, updatedCategory: any) => {
    setLoading(true);
    try {
      const data = await updateCategory(id, updatedCategory);
      setCategories(categories.map(cat => (cat.id === id ? data : cat)));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const partialUpdateCategory = async (id: number, updatedCategory: any) => {
    setLoading(true);
    try {
      const data = await patchCategory(id, updatedCategory);
      setCategories(categories.map(cat => (cat.id === id ? data : cat)));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: number, deleteImages: boolean = false) => {
    setLoading(true);
    try {
      await deleteCategory(id, deleteImages);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    category,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    modifyCategory,
    partialUpdateCategory,
    removeCategory,
  };
};

export default useCategories;