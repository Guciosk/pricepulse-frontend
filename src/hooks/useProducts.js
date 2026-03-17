import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await api.getProducts()
      setProducts(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const addProduct = async (body) => {
    const product = await api.createProduct(body)
    setProducts(prev => [product, ...prev])
    return product
  }

  const updateProduct = async (id, body) => {
    const updated = await api.updateProduct(id, body)
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }

  const deleteProduct = async (id) => {
    await api.deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const scrapeNow = async (id) => {
    const result = await api.scrapeNow(id)
    await fetchProducts()
    return result
  }

  return { products, loading, error, refetch: fetchProducts, addProduct, updateProduct, deleteProduct, scrapeNow }
}
