"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface ModernBreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const ModernBreadcrumbs = ({ items }: ModernBreadcrumbsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Auto-generate breadcrumbs based on pathname if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard"
    });

    // Map path segments to readable labels
    const segmentLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'events': 'Eventos',
      'users': 'Usuarios', 
      'profile': 'Perfil',
      'analytics': 'Analytics',
      'settings': 'Configuración'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip the first dashboard segment as we already added it
      if (segment === 'dashboard' && index === 0) return;
      
      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  const handleNavigation = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {/* Home icon for first item */}
          {index === 0 && (
            <Home className="w-4 h-4 text-white/40 mr-2" />
          )}
          
          {/* Breadcrumb item */}
          <button
            onClick={() => handleNavigation(item.href)}
            disabled={!item.href}
            className={`transition-all duration-200 ${
              item.isActive || !item.href
                ? 'text-white font-medium cursor-default'
                : 'text-white/60 hover:text-white/90 cursor-pointer hover:underline'
            }`}
          >
            {item.label}
          </button>
          
          {/* Separator */}
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="w-4 h-4 text-white/30 mx-3" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default ModernBreadcrumbs;