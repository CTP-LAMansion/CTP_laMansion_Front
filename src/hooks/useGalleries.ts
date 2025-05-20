import { useState, useEffect } from 'react';
import {
  getGalleries,
  addGallery,
  getGalleryById,
  updateGallery,
  patchGallery,
  deleteGallery,
  getGalleriesByCategory,
  getGalleriesWithoutCategory,
} from '../services/LandingPageServices';

const useGallery = () => {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const data = await getGalleries();
      setGalleries(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryById = async (id: number) => {
    setLoading(true);
    try {
      const data = await getGalleryById(id);
      setGallery(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createGallery = async (newGallery: any) => {
    setLoading(true);
    try {
      const data = await addGallery(newGallery);
      setGalleries([...galleries, data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const modifyGallery = async (id: number, updatedGallery: any) => {
    setLoading(true);
    try {
      const data = await updateGallery(id, updatedGallery);
      setGalleries(galleries.map(gal => (gal.id === id ? data : gal)));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const partialUpdateGallery = async (id: number, updatedGallery: any) => {
    setLoading(true);
    try {
      const data = await patchGallery(id, updatedGallery);
      setGalleries(galleries.map(gal => (gal.id === id ? data : gal)));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeGallery = async (id: number) => {
    setLoading(true);
    try {
      await deleteGallery(id);
      setGalleries(galleries.filter(gal => gal.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleriesByCategory = async (categoryId: number) => {
    setLoading(true);
    try {
      const data = await getGalleriesByCategory(categoryId);
      setGalleries(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleriesWithoutCategory = async () => {
    setLoading(true);
    try {
      const data = await getGalleriesWithoutCategory();
      setGalleries(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  return {
    galleries,
    gallery,
    loading,
    error,
    fetchGalleries,
    fetchGalleryById,
    createGallery,
    modifyGallery,
    partialUpdateGallery,
    removeGallery,
    fetchGalleriesByCategory,
    fetchGalleriesWithoutCategory,
  };
};

export default useGallery;