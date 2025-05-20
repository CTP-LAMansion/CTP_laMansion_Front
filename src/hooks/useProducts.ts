import { useState, useEffect, useRef } from 'react';
import { 
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  patchProduct,
  deleteProduct,
  searchProductsByName,
  getProductByExactName
} from '../services/productService';
import { Product } from '../types/OrderTypes';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  
  // Registrar el último término de búsqueda para evitar búsquedas duplicadas
  const lastSearchTerm = useRef<string>('');
  // Registrar si el componente está montado para evitar actualizaciones de estado después de desmontar
  const isMounted = useRef<boolean>(true);
  // Registrar si hay una búsqueda en progreso
  const searchInProgress = useRef<boolean>(false);

  // Obtener todos los productos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener los productos:', err);
      setError('Error al obtener los productos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener producto por ID
  const handleGetProductById = async (id: number) => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      setSelectedProduct(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error al obtener el producto:', err);
      setError('Error al obtener el producto');
      setSelectedProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const handleCreateProduct = async (product: Omit<Product, 'id_Product'>) => {
    setLoading(true);
    try {
      const newProduct = await createProduct(product);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setError(null);
      return newProduct;
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError('Error al crear el producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar producto
  const handleUpdateProduct = async (id: number, product: Omit<Product, 'id_Product'>) => {
    setLoading(true);
    try {
      const updatedProduct = await updateProduct(id, product);
      setProducts(products.map(p => p.id_Product === id ? updatedProduct : p));
      if (selectedProduct?.id_Product === id) {
        setSelectedProduct(updatedProduct);
      }
      setError(null);
      return updatedProduct;
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      setError('Error al actualizar el producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar parcialmente un producto
  const handlePatchProduct = async (id: number, partialProduct: Partial<Product>) => {
    setLoading(true);
    try {
      const updatedProduct = await patchProduct(id, partialProduct);
      setProducts(products.map(p => p.id_Product === id ? updatedProduct : p));
      if (selectedProduct?.id_Product === id) {
        setSelectedProduct(updatedProduct);
      }
      setError(null);
      return updatedProduct;
    } catch (err) {
      console.error('Error al actualizar parcialmente el producto:', err);
      setError('Error al actualizar parcialmente el producto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id: number) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id_Product !== id));
      if (selectedProduct?.id_Product === id) {
        setSelectedProduct(null);
      }
      setError(null);
      return true;
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
      setError('Error al eliminar el producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar productos por nombre 
const handleSearchProducts = async (name: string) => {
  // No buscar si el término está vacío
  if (name.length === 0) {
    setSearchResults([]);
    setSearchLoading(false);
    return [];
  }
  
  // No buscar si es el mismo término que acabamos de buscar
  if (name === lastSearchTerm.current) {
    return searchResults;
  }
  
  // No iniciar una nueva búsqueda si hay una en progreso
  if (searchInProgress.current) {
    return searchResults;
  }
  
  // Actualizar el estado de carga de la búsqueda
  setSearchLoading(true);
  searchInProgress.current = true;
  
  try {
    // Almacenar el término de búsqueda actual
    lastSearchTerm.current = name;
    
    console.log("Buscando productos con término:", name);
    const results = await searchProductsByName(name);
    console.log("Resultados de la búsqueda:", results);
    
    // Solo actualizar el estado si el componente sigue montado
    if (isMounted.current) {
      setSearchResults(results);
      setError(null);
    }
    
    searchInProgress.current = false;
    setSearchLoading(false);
    return results;
  } catch (err) {
    console.error('Error al buscar productos:', err);
    
    // Solo actualizar el estado si el componente sigue montado
    if (isMounted.current) {
      setError('Error al buscar productos');
      setSearchResults([]);
      setSearchLoading(false);
    }
    
    searchInProgress.current = false;
    return [];
  }
};

  // Obtener producto por nombre exacto
  const handleGetProductByName = async (name: string) => {
    setLoading(true);
    try {
      const product = await getProductByExactName(name);
      setError(null);
      return product;
    } catch (err) {
      console.error('Error al obtener el producto por nombre:', err);
      setError('Error al obtener el producto por nombre');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    selectedProduct,
    loading,
    error,
    searchResults,
    searchLoading,
    fetchProducts,
    handleGetProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handlePatchProduct,
    handleDeleteProduct,
    handleSearchProducts,
    handleGetProductByName
  };
};

export default useProducts;