import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../sub/button";
import { BarChart } from "./BarChart";
import SellerTable from "./SellerTable";
import StatCard from "./StatCard";

interface ProfileAdminPanelProps {
  onAddSeller: () => void;
}

type AdminState = 'overview' | 'edit-profile' | 'view-profile' | 'upcoming-events' | 'roles' | 'producer-data' | 'certifications' | 'event-data';

const ProfileAdminPanel = ({ onAddSeller }: ProfileAdminPanelProps) => {
  const [adminState, setAdminState] = useState<AdminState>('overview');

  const transitionToState = (newState: AdminState) => {
    setAdminState(newState);
  };

  const handleBack = () => {
    setAdminState('overview');
  };

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      description: 'Modificar información del productor',
      icon: '✏️',
      color: '#3B82F6'
    },
    {
      id: 'view-profile',
      title: 'Mostrar Perfil',
      description: 'Ver información completa',
      icon: '👁️',
      color: '#10B981'
    },
    {
      id: 'upcoming-events',
      title: 'Próximos Eventos',
      description: 'Eventos programados',
      icon: '📅',
      color: '#F59E0B'
    },
    {
      id: 'roles',
      title: 'Roles',
      description: 'Gestionar permisos y accesos',
      icon: '👥',
      color: '#8B5CF6'
    },
    {
      id: 'producer-data',
      title: 'Datos del Productor',
      description: 'Información básica y contacto',
      icon: '📋',
      color: '#EF4444'
    },
    {
      id: 'certifications',
      title: 'PDF Certificaciones',
      description: 'Documentos y certificados',
      icon: '📄',
      color: '#06B6D4'
    },
    {
      id: 'event-data',
      title: 'Datos del Evento',
      description: 'Información de eventos',
      icon: '🎉',
      color: '#EC4899'
    }
  ];

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 p-4 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {adminState !== 'overview' && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors duration-200 bg-white/10 border border-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
          <h2 className="text-xl font-bold text-white">Panel de Administración</h2>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={adminState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {adminState === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => transitionToState(item.id as AdminState)}
                    className="text-left p-4 rounded-lg transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: hexToRgba(item.color, 0.2),
                          border: `1px solid ${hexToRgba(item.color, 0.3)}`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                        <p className="text-xs text-neutral-400">{item.description}</p>
                      </div>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className="text-neutral-500"
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          
          {adminState === 'edit-profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Editar Perfil</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Formulario de edición de perfil aquí</p>
              </div>
            </div>
          )}
          
          {adminState === 'view-profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Información del Perfil</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Información del perfil aquí</p>
              </div>
            </div>
          )}
          
          {adminState === 'upcoming-events' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Próximos Eventos</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Lista de próximos eventos aquí</p>
              </div>
            </div>
          )}
          
          {adminState === 'roles' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Gestión de Roles</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Sistema de roles y permisos aquí</p>
              </div>
            </div>
          )}
          
          {adminState === 'producer-data' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Datos del Productor</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Información básica del productor aquí</p>
              </div>
            </div>
          )}
          
          {adminState === 'certifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">PDF Certificaciones</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Documentos y certificaciones aquí</p>
              </div>
            </div>
          )}
          
          {adminState === 'event-data' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Datos del Evento</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-neutral-300">Información de eventos aquí</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProfileAdminPanel;
