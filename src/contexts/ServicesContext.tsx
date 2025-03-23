import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Service, Category, Item, ServiceCategory, ServiceCategoryItem } from '../lib/supabase';

interface ServicesContextType {
  services: Service[];
  categories: Category[];
  items: Item[];
  loading: boolean;
  error: string | null;
  getServiceCategories: (serviceId: string) => Category[];
  getCategoryItems: (categoryId: string) => Item[];
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [serviceCategoryItems, setServiceCategoryItems] = useState<ServiceCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    fetchInitialData();
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      console.log('🔄 Fetching initial data...');
      setLoading(true);
      setError(null);

      const [
        { data: servicesData, error: servicesError },
        { data: categoriesData, error: categoriesError },
        { data: itemsData, error: itemsError },
        { data: serviceCategoriesData, error: serviceCategoriesError },
        { data: serviceCategoryItemsData, error: serviceCategoryItemsError }
      ] = await Promise.all([
        supabase.from('services').select('*').order('sequence'),
        supabase.from('categories').select('*').order('sequence'),
        supabase.from('items').select('*').order('sequence'),
        supabase.from('service_categories').select('*'),
        supabase.from('service_category_items').select('*')
      ]);

      console.log('📦 Services:', servicesData);
      console.log('📦 Categories:', categoriesData);
      console.log('📦 Items:', itemsData);

      if (servicesError || categoriesError || itemsError || serviceCategoriesError || serviceCategoryItemsError) {
        throw new Error('Failed to fetch data');
      }

      if (mounted.current) {
        setServices(servicesData || []);
        setCategories(categoriesData || []);
        setItems(itemsData || []);
        setServiceCategories(serviceCategoriesData || []);
        setServiceCategoryItems(serviceCategoryItemsData || []);
      }
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      if (mounted.current) {
        setError('Failed to load data');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const getServiceCategories = (serviceId: string): Category[] => {
    const serviceCategoryIds = serviceCategories
      .filter(sc => sc.service_id === serviceId)
      .map(sc => sc.category_id);
    
    return categories.filter(category => serviceCategoryIds.includes(category.id));
  };

  const getCategoryItems = (categoryId: string): Item[] => {
    const serviceCategoryIds = serviceCategories
      .filter(sc => sc.category_id === categoryId)
      .map(sc => sc.id);

    const itemIds = serviceCategoryItems
      .filter(sci => serviceCategoryIds.includes(sci.service_category_id))
      .map(sci => sci.item_id);

    return items.filter(item => itemIds.includes(item.id));
  };

  const value = {
    services,
    categories,
    items,
    loading,
    error,
    getServiceCategories,
    getCategoryItems
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};