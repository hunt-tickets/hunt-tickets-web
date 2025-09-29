import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { cn } from "@/lib/utils"

interface HuntGridMotionProps {
  className?: string
}

export function HuntGridMotion({ className }: HuntGridMotionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseXRef = useRef(window.innerWidth / 2)

  // Imágenes de eventos de Hunt con diferentes tipos de eventos
  const eventImages = [
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Concert crowd
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // DJ
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Stadium
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Festival stage
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Theater
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Live music
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Fireworks
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Concert hall
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Stadium lights
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Festival crowd
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Music venue
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Concert lighting
    "https://images.unsplash.com/photo-1485120750507-a3bf477acd63?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Stage performance
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Audio mixing
    "https://images.unsplash.com/photo-1550985543-1b3b86019e4f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Classical venue
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Live show
    "https://images.unsplash.com/photo-1527224538127-2104bb997d51?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Stadium atmosphere
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3", // Event setup
  ];

  // Textos relacionados con Hunt y eventos
  const eventTexts = [
    <div key="hunt-1" className="text-center">
      <div className="text-2xl font-black">HUNT</div>
      <div className="text-sm opacity-80">Eventos</div>
    </div>,
    <div key="concerts" className="text-center">
      <div className="text-lg font-bold">🎵</div>
      <div className="text-xs">Conciertos</div>
    </div>,
    <div key="theater" className="text-center">
      <div className="text-lg font-bold">🎭</div>
      <div className="text-xs">Teatro</div>
    </div>,
    <div key="sports" className="text-center">
      <div className="text-lg font-bold">⚽</div>
      <div className="text-xs">Deportes</div>
    </div>,
    <div key="festivals" className="text-center">
      <div className="text-lg font-bold">🎪</div>
      <div className="text-xs">Festivales</div>
    </div>,
    <div key="hunt-2" className="text-center">
      <div className="text-xl font-black">EXPERIENCIAS</div>
      <div className="text-xs opacity-80">Únicas</div>
    </div>,
    <div key="tickets" className="text-center">
      <div className="text-lg font-bold">🎟️</div>
      <div className="text-xs">Tickets</div>
    </div>,
    <div key="live" className="text-center">
      <div className="text-lg font-bold">🔴</div>
      <div className="text-xs">En Vivo</div>
    </div>,
    <div key="hunt-3" className="text-center">
      <div className="text-2xl font-black">VIVE</div>
      <div className="text-sm opacity-80">El Momento</div>
    </div>,
    <div key="exclusive" className="text-center">
      <div className="text-lg font-bold">⭐</div>
      <div className="text-xs">Exclusivos</div>
    </div>,
  ];

  // Combinar imágenes y textos alternadamente
  const combinedItems: (string | any)[] = [];
  for (let i = 0; i < 28; i++) {
    if (i % 3 === 0) {
      // Cada 3 elementos, usar texto
      combinedItems.push(eventTexts[i % eventTexts.length]);
    } else {
      // Usar imagen
      combinedItems.push(eventImages[i % eventImages.length]);
    }
  }

  useEffect(() => {
    gsap.ticker.lagSmoothing(0)

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
    }

    const updateMotion = () => {
      const maxMoveAmount = 300
      const baseDuration = 0.8
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2]

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      })
    }

    const removeAnimationLoop = gsap.ticker.add(updateMotion)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      removeAnimationLoop()
    }
  }, [])

  return (
    <div className={cn("h-full w-full overflow-hidden", className)} ref={gridRef}>
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        
        {/* Texto central flotante */}
        <div className="absolute z-50 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
            hunt.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light">
            Descubre eventos únicos
          </p>
        </div>

        {/* Grid con movimiento */}
        <div className="relative z-10 flex-none grid h-[150vh] w-[150vw] gap-4 grid-rows-[repeat(4,1fr)] grid-cols-[100%] -rotate-15 origin-center">
          {[...Array(4)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 grid-cols-[repeat(7,1fr)] will-change-transform will-change-filter"
              ref={(el) => { rowRefs.current[rowIndex] = el; }}
            >
              {[...Array(7)].map((_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex]
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-900/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white shadow-2xl hover:bg-gray-800/60 transition-all duration-300">
                      {typeof content === 'string' ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-80 hover:opacity-100 transition-opacity duration-300"
                          style={{
                            backgroundImage: `url(${content})`,
                          }}
                        />
                      ) : (
                        <div className="p-2 text-center z-10 relative">
                          {content}
                        </div>
                      )}
                      {/* Overlay para mejor legibilidad */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}