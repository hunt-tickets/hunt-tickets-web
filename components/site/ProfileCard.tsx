import Link from "next/link";
import { Avatar } from "../sub/avatar";
import { Button } from "../sub/button";

type ProfileCardProps = {
  title: string;
  avatarLetter: string;
  id: string;
  image?: string;
};
const ProfileCard = ({ title, avatarLetter, id, image }: ProfileCardProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-between gap-6 p-6 rounded-2xl border-0 transition-all duration-300 hover:shadow-2xl group h-72 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'absolute rounded-full pointer-events-none animate-ping';
        ripple.style.cssText = `
          left: ${x}px;
          top: ${y}px;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
        `;
        
        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }}
    >
      {/* Logo Container */}
      <div className="relative">
        {image ? (
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div 
            className="w-20 h-20 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-300 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            }}
          >
            <span className="text-2xl font-bold text-white">
              {avatarLetter}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="text-center flex-1 flex items-center">
        <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
          {title}
        </h3>
      </div>

      {/* Button */}
      <Link href={`/producers/${id}`} className="w-full">
        <Button 
          className="w-full py-4 h-12 rounded-xl font-semibold transition-all duration-300 bg-neutral-700 text-white hover:bg-neutral-600"
          style={{ 
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          Ver perfil
        </Button>
      </Link>
    </div>
  );
};

export default ProfileCard;
