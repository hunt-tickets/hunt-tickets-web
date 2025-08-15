'use client';

import React from 'react';
import { format } from 'date-fns';
import { Users } from 'lucide-react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export interface User {
   id: string;
   name: string;
   avatarUrl?: string;
   email: string;
   status: 'active' | 'inactive' | 'pending';
   role: 'admin' | 'manager' | 'staff' | 'user';
   joinedDate: string;
   lastLogin?: string;
   teamIds: string[];
}

export const statusUserColors = {
   active: '#00cc66',
   inactive: '#969696',
   pending: '#ffcc00',
};

export const roleConfig = {
   admin: { label: 'Admin', color: 'text-yellow-400 bg-yellow-500/20' },
   manager: { label: 'Manager', color: 'text-purple-400 bg-purple-500/20' },
   staff: { label: 'Staff', color: 'text-blue-400 bg-blue-500/20' },
   user: { label: 'Usuario', color: 'text-gray-400 bg-gray-500/20' },
};

export interface Team {
   id: string;
   name: string;
   icon: string;
   color: string;
}

export const teams: Team[] = [
   { id: 'EVENTOS', name: 'Gestión de Eventos', icon: '🎪', color: '#FF6B6B' },
   { id: 'VENTAS', name: 'Ventas y Marketing', icon: '💰', color: '#4ECDC4' },
   { id: 'SOPORTE', name: 'Soporte al Cliente', icon: '🎧', color: '#45B7D1' },
   { id: 'TECH', name: 'Tecnología', icon: '⚡', color: '#96CEB4' },
   { id: 'FINANZAS', name: 'Finanzas', icon: '📊', color: '#FFEAA7' },
];

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
   return (
      <AvatarPrimitive.Root
         data-slot="avatar"
         className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
         {...props}
      />
   );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
   return (
      <AvatarPrimitive.Image
         data-slot="avatar-image"
         className={cn('aspect-square size-full', className)}
         {...props}
      />
   );
}

function AvatarFallback({
   className,
   ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
   return (
      <AvatarPrimitive.Fallback
         data-slot="avatar-fallback"
         className={cn(
            'bg-white/10 flex size-full items-center justify-center rounded-full text-white font-medium text-sm',
            className
         )}
         {...props}
      />
   );
}

function TooltipProvider({
   delayDuration = 0,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
   return (
      <TooltipPrimitive.Provider
         data-slot="tooltip-provider"
         delayDuration={delayDuration}
         {...props}
      />
   );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
   return (
      <TooltipProvider>
         <TooltipPrimitive.Root data-slot="tooltip" {...props} />
      </TooltipProvider>
   );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
   return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
   className,
   sideOffset = 8,
   children,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
   return (
      <TooltipPrimitive.Portal>
         <TooltipPrimitive.Content
            data-slot="tooltip-content"
            sideOffset={sideOffset}
            className={cn(
               'bg-gray-900 border border-white/20 text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
               className
            )}
            {...props}
         >
            {children}
         </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
   );
}

interface TeamsTooltipProps {
   teamIds: string[];
}

function TeamsTooltip({ teamIds }: TeamsTooltipProps) {
   return (
      <Tooltip delayDuration={0}>
         <TooltipTrigger className="flex items-center gap-0.5 truncate">
            <Users className="text-white/60 size-4 mr-1 shrink-0" />
            {teamIds.slice(0, 2).map((teamId, index) => (
               <span key={teamId} className="mt-0.5 text-white/70">
                  {teamId}
                  {index < Math.min(teamIds.length, 2) - 1 && ', '}
               </span>
            ))}
            {teamIds.length > 2 && <span className="mt-0.5 text-white/70">+ {teamIds.length - 2}</span>}
         </TooltipTrigger>
         <TooltipContent className="p-2">
            <div className="flex flex-col gap-1">
               {teams
                  .filter((team) => teamIds.includes(team.id))
                  .map((team) => (
                     <div key={team.id} className="text-xs flex items-center gap-2">
                        <div className="inline-flex size-6 bg-white/10 items-center justify-center rounded shrink-0">
                           <div className="text-sm">{team.icon}</div>
                        </div>
                        <span className="font-medium text-white">{team.name}</span>
                     </div>
                  ))}
            </div>
         </TooltipContent>
      </Tooltip>
   );
}

interface MemberLineProps {
   user: User;
   onRoleChange?: (userId: string, newRole: string) => void;
   editingUser?: string | null;
   setEditingUser?: (userId: string | null) => void;
}

function MemberLine({ user, onRoleChange, editingUser, setEditingUser }: MemberLineProps) {
   const roleInfo = roleConfig[user.role];
   const statusColor = statusUserColors[user.status];

   const getStatusLabel = (status: string) => {
      switch (status) {
         case 'active': return 'Activo';
         case 'inactive': return 'Inactivo';
         case 'pending': return 'Pendiente';
         default: return status;
      }
   };

   return (
      <div className="w-full flex items-center py-4 px-6 border-b border-white/5 hover:bg-white/5 text-sm last:border-b-0 transition-colors">
         <div className="flex-grow flex items-center gap-3 overflow-hidden">
            <div className="relative">
               <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                     {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <span
                  className="absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-[#0a0a0a]"
                  style={{ backgroundColor: statusColor }}
               >
                  <span className="sr-only">{user.status}</span>
               </span>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
               <span className="font-medium truncate w-full text-white">{user.name || 'Sin nombre'}</span>
               <span className="text-xs text-white/60 truncate w-full">{user.email}</span>
            </div>
         </div>
         
         <div className="w-32 shrink-0">
            {editingUser === user.id && onRoleChange && setEditingUser ? (
               <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-white/20 w-full"
                  autoFocus
                  onBlur={() => setEditingUser(null)}
               >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="user">Usuario</option>
               </select>
            ) : (
               <div 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${roleInfo.color}`}
                  onClick={() => setEditingUser?.(user.id)}
               >
                  {roleInfo.label}
               </div>
            )}
         </div>
         
         <div className="w-32 shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
               user.status === 'active' ? 'bg-green-500/20 text-green-400' :
               user.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
               'bg-yellow-500/20 text-yellow-400'
            }`}>
              {getStatusLabel(user.status)}
            </span>
         </div>
         
         <div className="w-32 shrink-0 text-xs text-white/60">
            {format(new Date(user.joinedDate), 'MMM yyyy')}
         </div>
         
         <div className="w-32 shrink-0 text-xs text-white/60">
            {user.lastLogin ? format(new Date(user.lastLogin), 'MMM dd') : 'Nunca'}
         </div>
         
         <div className="w-40 shrink-0 flex text-xs">
            <TeamsTooltip teamIds={user.teamIds} />
         </div>
      </div>
   );
}

interface MemberListProps {
   users: User[];
   onRoleChange?: (userId: string, newRole: string) => void;
   editingUser?: string | null;
   setEditingUser?: (userId: string | null) => void;
   className?: string;
}

const MemberList = React.forwardRef<HTMLDivElement, MemberListProps>(
   ({ users, onRoleChange, editingUser, setEditingUser, className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(
            'w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white transition-colors duration-300 overflow-hidden',
            className
         )}
         {...props}
      >
         <div className="bg-white/5 px-6 py-4 text-sm flex items-center text-white/80 border-b border-white/10 sticky top-0 z-10 font-medium">
            <div className="flex-grow">Usuario</div>
            <div className="w-32 shrink-0">Rol</div>
            <div className="w-32 shrink-0">Estado</div>
            <div className="w-32 shrink-0">Creado</div>
            <div className="w-32 shrink-0">Último acceso</div>
            <div className="w-40 shrink-0">Equipos</div>
         </div>
         <div className="w-full overflow-y-auto">
            {users.map((user) => (
               <MemberLine 
                  key={user.id} 
                  user={user} 
                  onRoleChange={onRoleChange}
                  editingUser={editingUser}
                  setEditingUser={setEditingUser}
               />
            ))}
         </div>
         
         {users.length === 0 && (
            <div className="py-12 text-center">
               <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
               <p className="text-white/60">No se encontraron usuarios</p>
            </div>
         )}
      </div>
   )
);

MemberList.displayName = 'MemberList';

export default MemberList;