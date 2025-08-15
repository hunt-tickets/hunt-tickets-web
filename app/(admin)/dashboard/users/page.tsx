"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { supabase } from "@/lib/supabaseBrowser";
import { User, Shield, Crown, UserCheck, Search, Filter, MoreVertical } from "lucide-react";
import MemberList from "@/components/ui/member-list";
import type { User as MemberUser } from "@/components/ui/member-list";

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'user';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  last_login?: string;
}

const ROLES = [
  { value: 'admin', label: 'Administrador', icon: Crown, color: 'text-yellow-400 bg-yellow-500/20' },
  { value: 'manager', label: 'Manager', icon: Shield, color: 'text-purple-400 bg-purple-500/20' },
  { value: 'staff', label: 'Staff', icon: UserCheck, color: 'text-blue-400 bg-blue-500/20' },
  { value: 'user', label: 'Usuario', icon: User, color: 'text-gray-400 bg-gray-500/20' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo', color: 'bg-green-500/20 text-green-400' },
  { value: 'inactive', label: 'Inactivo', color: 'bg-red-500/20 text-red-400' },
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
];

export default function UsersPage() {
  const { user, loading: userLoading } = useUser();
  const [users, setUsers] = useState<MemberUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<MemberUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("admins");

  // Tabs para la gestión de usuarios
  const tabs = [
    { id: "admins", name: "Admins", icon: "👑", count: 0 },
    { id: "vendedores", name: "Vendedores", icon: "💼", count: 0 },
    { id: "taquilla", name: "Taquilla", icon: "🎫", count: 0 },
  ];

  // Mock data - En producción esto vendría de Supabase
  const mockUsers: MemberUser[] = [
    // ADMINS
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@hunt.com',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-01-15T10:30:00Z',
      lastLogin: '2024-12-10T14:22:00Z',
      teamIds: ['ADMIN']
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@hunt.com',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-02-20T09:15:00Z',
      lastLogin: '2024-12-09T16:45:00Z',
      teamIds: ['ADMIN']
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos@hunt.com',
      role: 'admin',
      status: 'inactive',
      joinedDate: '2024-03-10T11:00:00Z',
      lastLogin: '2024-12-08T12:30:00Z',
      teamIds: ['ADMIN']
    },
    // VENDEDORES
    {
      id: '4',
      name: 'Ana López',
      email: 'ana@hunt.com',
      role: 'manager',
      status: 'active',
      joinedDate: '2024-04-05T14:20:00Z',
      lastLogin: '2024-11-15T09:10:00Z',
      teamIds: ['VENTAS']
    },
    {
      id: '5',
      name: 'Luis Martínez',
      email: 'luis@hunt.com',
      role: 'manager',
      status: 'active',
      joinedDate: '2024-12-01T08:45:00Z',
      lastLogin: '2024-12-10T14:22:00Z',
      teamIds: ['VENTAS']
    },
    {
      id: '6',
      name: 'Patricia Silva',
      email: 'patricia@hunt.com',
      role: 'manager',
      status: 'active',
      joinedDate: '2024-08-15T12:00:00Z',
      lastLogin: '2024-12-11T08:30:00Z',
      teamIds: ['VENTAS']
    },
    {
      id: '7',
      name: 'Roberto Vega',
      email: 'roberto@hunt.com',
      role: 'manager',
      status: 'pending',
      joinedDate: '2024-09-22T14:45:00Z',
      lastLogin: '2024-12-10T20:15:00Z',
      teamIds: ['VENTAS']
    },
    {
      id: '8',
      name: 'Carmen Torres',
      email: 'carmen@hunt.com',
      role: 'manager',
      status: 'inactive',
      joinedDate: '2024-05-30T09:20:00Z',
      lastLogin: '2024-12-11T16:40:00Z',
      teamIds: ['VENTAS']
    },
    // TAQUILLA
    {
      id: '9',
      name: 'Diego Morales',
      email: 'diego@hunt.com',
      role: 'staff',
      status: 'active',
      joinedDate: '2024-06-12T10:30:00Z',
      lastLogin: '2024-12-10T18:45:00Z',
      teamIds: ['TAQUILLA']
    },
    {
      id: '10',
      name: 'Laura Jiménez',
      email: 'laura@hunt.com',
      role: 'staff',
      status: 'active',
      joinedDate: '2024-07-20T14:15:00Z',
      lastLogin: '2024-12-11T12:30:00Z',
      teamIds: ['TAQUILLA']
    },
    {
      id: '11',
      name: 'Pedro Castillo',
      email: 'pedro@hunt.com',
      role: 'staff',
      status: 'active',
      joinedDate: '2024-08-05T09:00:00Z',
      lastLogin: '2024-12-10T22:10:00Z',
      teamIds: ['TAQUILLA']
    },
    {
      id: '12',
      name: 'Sofia Ramírez',
      email: 'sofia@hunt.com',
      role: 'staff',
      status: 'inactive',
      joinedDate: '2024-09-15T11:45:00Z',
      lastLogin: '2024-11-20T16:20:00Z',
      teamIds: ['TAQUILLA']
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    const loadUsers = async () => {
      setLoading(true);
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  // Función para obtener usuarios por tab
  const getUsersByTab = (tabId: string) => {
    switch (tabId) {
      case "admins":
        return users.filter(user => user.role === 'admin');
      case "vendedores":
        return users.filter(user => user.teamIds?.includes('VENTAS'));
      case "taquilla":
        return users.filter(user => user.teamIds?.includes('TAQUILLA'));
      default:
        return users;
    }
  };

  // Actualizar conteos de tabs
  const tabsWithCounts = tabs.map(tab => ({
    ...tab,
    count: getUsersByTab(tab.id).length
  }));

  useEffect(() => {
    let filtered = getUsersByTab(activeTab);

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filtrar por estado
    if (selectedStatus !== "all") {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus, activeTab]);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole as MemberUser['role'] } : user
    ));
    setEditingUser(null);
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus as MemberUser['status'] } : user
    ));
  };


  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-white text-lg">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a0a0a]">
      <div className="w-full px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ letterSpacing: '-5px', lineHeight: '130%' }}>
            Gestión de <span style={{ fontFamily: "'Amarante', 'Cinzel Decorative', serif", fontWeight: '400' }} className="italic">Usuarios</span>
          </h1>
          <p className="text-white/60 text-lg">Administra roles y permisos del personal</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-2 mb-8">
          {tabsWithCounts.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border-white/20 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl"></div>
              )}
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full h-12 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm font-medium placeholder-white/60 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm font-medium focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
          >
            <option value="all" className="bg-gray-900">Todos los roles</option>
            {ROLES.map(role => (
              <option key={role.value} value={role.value} className="bg-gray-900">
                {role.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white text-sm font-medium focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all duration-200"
          >
            <option value="all" className="bg-gray-900">Todos los estados</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value} className="bg-gray-900">
                {status.label}
              </option>
            ))}
          </select>

          {/* Add User Button */}
          <button className="h-12 px-6 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg">
            <User className="w-4 h-4 text-black" />
            <span className="text-black font-medium text-sm">Nuevo Usuario</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-white/60 text-sm">Total en {activeTab}</span>
            </div>
            <p className="text-2xl font-bold text-white">{getUsersByTab(activeTab).length}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white/60 text-sm">Activos</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {getUsersByTab(activeTab).filter(u => u.status === 'active').length}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-white/60 text-sm">Inactivos</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {getUsersByTab(activeTab).filter(u => u.status === 'inactive').length}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-white/60 text-sm">Pendientes</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {getUsersByTab(activeTab).filter(u => u.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <MemberList 
          users={filteredUsers} 
          onRoleChange={handleRoleChange}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />

        {/* Results info */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-white/60 text-sm">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </div>
        </div>

      </div>
    </div>
  );
}