import { GlowCard } from "@/components/ui/spotlight-card";
import { Calendar, MapPin, Star, Users } from "lucide-react";

export function SpotlightDemo() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-10 p-8 bg-black">
      {/* Demo Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Spotlight Cards Demo</h1>
        <p className="text-white/60 text-lg">Interactive cards with mouse-following spotlight effects</p>
      </div>

      {/* Default Cards */}
      <div className="flex flex-row items-center justify-center gap-10 flex-wrap">
        <GlowCard glowColor="blue">
          <div className="flex flex-col justify-between h-full text-white">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold">Próximos Eventos</h3>
              <p className="text-white/80 text-sm">Descubre los mejores eventos cerca de ti</p>
            </div>
            <div className="text-3xl font-bold text-blue-400">24</div>
          </div>
        </GlowCard>

        <GlowCard glowColor="purple">
          <div className="flex flex-col justify-between h-full text-white">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Usuarios Activos</h3>
              <p className="text-white/80 text-sm">Personas conectadas en tiempo real</p>
            </div>
            <div className="text-3xl font-bold text-purple-400">1.2K</div>
          </div>
        </GlowCard>

        <GlowCard glowColor="green">
          <div className="flex flex-col justify-between h-full text-white">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold">Rating Promedio</h3>
              <p className="text-white/80 text-sm">Calificación de nuestros eventos</p>
            </div>
            <div className="text-3xl font-bold text-green-400">4.8</div>
          </div>
        </GlowCard>
      </div>

      {/* Custom Sized Cards */}
      <div className="flex flex-row items-center justify-center gap-10 flex-wrap">
        <GlowCard 
          glowColor="red" 
          customSize={true}
          className="w-80 h-48"
        >
          <div className="flex items-center justify-between h-full text-white p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Custom Size</h3>
              <p className="text-white/80">Cards can be any size</p>
            </div>
            <MapPin className="w-12 h-12 text-red-400" />
          </div>
        </GlowCard>

        <GlowCard 
          glowColor="orange" 
          size="lg"
        >
          <div className="flex flex-col justify-between h-full text-white">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Large Card</h3>
              <p className="text-white/80 text-sm">Using the large preset size</p>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400">Special Content</div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Instructions */}
      <div className="text-center mt-8 max-w-2xl">
        <p className="text-white/60 text-sm">
          Move your mouse around to see the spotlight effect follow your cursor. 
          Each card has a different glow color and responds to mouse movement.
        </p>
      </div>
    </div>
  );
}

export default SpotlightDemo;