import { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { supabase } from '../lib/supabase'
import { Product } from '../types/product'
import ProductList from '../components/ProductList'

export default function HomeScreen() {

    const[products, setProducts] = useState<Product[]>([]) // ürünleri tutan liste
    const[loading, setLoading] = useState(true) // veri gelene kadar true

    useEffect(() => {
        fetchFeaturedProducts()
    }, [])

    async function fetchFeaturedProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_featured',true) //sadece öne cıkanlar

        if (error){
            console.log('HATA:', error.message)
        }
        else
            setProducts(data)

        setLoading(false) // veri geldi || hata cıktı durumları icin false yapılır

    }

    if(loading){
        return (
            <View style={styles.centered}>
                 <ActivityIndicator size="large" />
            </View>
        )
    }

    return <ProductList products={products} />
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})