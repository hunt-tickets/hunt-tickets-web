import { Avatar } from "@/components/sub/avatar";

interface ProfileHeaderProps {
  name: string;
  image?: string;
  banner?: string;
}

const ProfileHeader = ({ name, image, banner }: ProfileHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 relative">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Banner con overlay gradiente */}
        <div className="relative h-60 w-full flex-none rounded-2xl overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={
              banner ||
              "https://res.cloudinary.com/subframe/image/upload/v1723777918/uploads/302/udfgpsjpnbdrvmk0y7r4.png"
            }
            alt="Producer Banner"
          />
          {/* Overlay gradiente para mejorar la legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-purple-600/30"></div>
          
          {/* Partículas decorativas */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-pulse delay-700"></div>
        </div>
        
        {/* Avatar con marco moderno */}
        <div className="flex flex-col items-start gap-4 absolute left-6 -bottom-6">
          <div className="relative">
            {/* Anillo de gradiente animado */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-black"></div>
            </div>
            
            {/* Avatar principal */}
            <div className="relative z-10 p-1">
              <Avatar
                variant="brand"
                size="x-large"
                image={
                  image ||
                  "https://res.cloudinary.com/subframe/image/upload/v1733344439/uploads/4760/wcdzkpojxc9er3fqocwc.png"
                }
                square={false}
                className="shadow-2xl border-4 border-white/20 backdrop-blur-sm"
              >
                {name[0]}
              </Avatar>
            </div>
            
            {/* Indicador de estado online */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse z-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
