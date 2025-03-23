import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Shirt, Wind, Scissors, ArrowRight, ArrowLeft } from 'lucide-react';

const services = [
  {
    id: 'easy-bag',
    name: 'Eazyy Bag',
    description: 'Our signature laundry service perfect for your regular washing needs. Simply fill the bag with your clothes and we\'ll take care of the rest.',
    short_description: 'Weight-based washing perfect for regular laundry',
    icon: 'package',
    price_starts_at: 24.99,
    price_unit: 'per bag',
    color_scheme: { primary: 'blue-600', secondary: 'blue-50' },
    is_popular: true,
    service_identifier: 'easy-bag'
  },
  {
    id: 'wash-iron',
    name: 'Wash & Iron',
    description: 'Professional washing and ironing service for your garments that need that extra care and attention.',
    short_description: 'Professional cleaning and pressing for individual items',
    icon: 'shirt',
    price_starts_at: 4.99,
    price_unit: 'per item',
    color_scheme: { primary: 'purple-600', secondary: 'purple-50' },
    is_popular: true,
    service_identifier: 'wash-iron'
  },
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    description: 'Expert dry cleaning service for your delicate and special care items.',
    short_description: 'Specialized cleaning for delicate garments',
    icon: 'wind',
    price_starts_at: 9.99,
    price_unit: 'per item',
    color_scheme: { primary: 'emerald-600', secondary: 'emerald-50' },
    is_popular: false,
    service_identifier: 'dry-cleaning'
  },
  {
    id: 'repairs',
    name: 'Repairs & Alterations',
    description: 'Professional clothing repair and alteration services to give your favorite garments a new lease of life.',
    short_description: 'Expert mending and alterations services',
    icon: 'scissors',
    price_starts_at: 3.99,
    price_unit: 'per repair',
    color_scheme: { primary: 'amber-600', secondary: 'amber-50' },
    is_popular: false,
    service_identifier: 'repairs'
  }
];

const ServiceSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (serviceIdentifier: string) => {
    setSelectedService(serviceIdentifier);
    setTimeout(() => {
      navigate(`/order/items/${serviceIdentifier}`);
    }, 300);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose a Service
          </h1>
          <p className="text-lg text-gray-600">
            Select the service that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <motion.button
              key={service.id}
              onClick={() => handleServiceSelect(service.service_identifier)}
              className={`w-full p-6 rounded-2xl text-left transition-all duration-300 ${
                selectedService === service.service_identifier
                  ? `bg-${service.color_scheme.primary} text-white shadow-lg`
                  : `bg-${service.color_scheme.secondary} hover:scale-[1.02] text-gray-900 shadow-md hover:shadow-lg`
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-xl ${
                  selectedService === service.service_identifier 
                    ? 'bg-white/20' 
                    : `bg-${service.color_scheme.primary}`
                } flex items-center justify-center`}>
                  {service.icon === 'package' && <Package size={24} className={selectedService === service.service_identifier ? 'text-white' : 'text-white'} />}
                  {service.icon === 'shirt' && <Shirt size={24} className={selectedService === service.service_identifier ? 'text-white' : 'text-white'} />}
                  {service.icon === 'wind' && <Wind size={24} className={selectedService === service.service_identifier ? 'text-white' : 'text-white'} />}
                  {service.icon === 'scissors' && <Scissors size={24} className={selectedService === service.service_identifier ? 'text-white' : 'text-white'} />}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  {service.is_popular && (
                    <span className={`text-sm ${
                      selectedService === service.service_identifier ? 'text-white/80' : `text-${service.color_scheme.primary}`
                    }`}>
                      Popular Choice
                    </span>
                  )}
                </div>
              </div>
              
              <p className={`text-base mb-4 ${
                selectedService === service.service_identifier ? 'text-white/90' : 'text-gray-600'
              }`}>
                {service.short_description}
              </p>

              <div className="flex items-baseline">
                <span className={`text-lg font-bold ${
                  selectedService === service.service_identifier ? 'text-white' : 'text-gray-900'
                }`}>
                  From €{service.price_starts_at.toFixed(2)}
                </span>
                <span className={`ml-2 text-sm ${
                  selectedService === service.service_identifier ? 'text-white/80' : 'text-gray-600'
                }`}>
                  {service.price_unit}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 flex justify-between">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>

          <motion.button
            onClick={() => selectedService && navigate(`/order/items/${selectedService}`)}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              selectedService
                ? 'bg-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={selectedService ? { scale: 1.05 } : {}}
            whileTap={selectedService ? { scale: 0.95 } : {}}
            disabled={!selectedService}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceSelection;