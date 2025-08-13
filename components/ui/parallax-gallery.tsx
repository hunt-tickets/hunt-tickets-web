"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"

import Floating, {
  FloatingElement,
} from "@/components/ui/parallax-floating"

const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Aditya Chinchure",
    title: "Concert crowd with lights",
  },
  {
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "DJ mixing on stage",
    author: "Marcela Laskoski",
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Vishnu R Nair",
    title: "Stadium concert with crowd",
  },
  {
    url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "CHUTTERSNAP",
    title: "Music festival stage",
  },
  {
    url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Wendy Wei",
    title: "Theater performance",
  },
  {
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Bogdan Yukhymchuk",
    title: "Live music performance",
  },
  {
    url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Fireworks at stadium",
    author: "Andy Li",
  },
  {
    url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Anthony DELANOIX",
    title: "Concert hall interior",
  },
  {
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Rock Concert",
    title: "Stadium lights",
  },
  {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Freestocks",
    title: "Festival crowd",
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Josh Sorenson",
    title: "Music venue",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Yvette de Wit",
    title: "Concert lighting",
  },
  {
    url: "https://images.unsplash.com/photo-1485120750507-a3bf477acd63?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Event photographers",
    title: "Stage performance",
  },
  {
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Audio mixing",
    title: "Sound engineer",
  },
  {
    url: "https://images.unsplash.com/photo-1550985543-1b3b86019e4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Concert hall",
    title: "Classical venue",
  },
  {
    url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Concert vibes",
    title: "Live show",
  },
  {
    url: "https://images.unsplash.com/photo-1527224538127-2104bb997d51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Sports event",
    title: "Stadium atmosphere",
  },
  {
    url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Entertainment",
    title: "Event setup",
  }
]

const ParallaxGallery = () => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [])

  return (
    <div
      className="flex w-full h-full min-h-[600px] justify-center items-center bg-black overflow-hidden relative"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="text-5xl md:text-7xl z-50 text-white font-black italic">
          hunt.
        </p>
        <p className="text-xs z-50 hover:scale-110 transition-transform bg-white text-black rounded-full py-2 w-20 cursor-pointer">
          Explorar
        </p>
      </motion.div>

      <Floating sensitivity={-2.5} className="overflow-hidden">
        {/* Capa lejana - alrededor del texto central */}
        <FloatingElement depth={0.5} className="top-[35%] left-[25%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            onError={(e) => { e.currentTarget.src = exampleImages[1].url }}
            className="w-32 h-32 md:w-48 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-50"
          />
        </FloatingElement>
        <FloatingElement depth={0.3} className="top-[60%] left-[65%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].url}
            onError={(e) => { e.currentTarget.src = exampleImages[0].url }}
            className="w-28 h-28 md:w-40 md:h-40 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-40"
          />
        </FloatingElement>
        <FloatingElement depth={0.7} className="top-[25%] left-[65%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].url}
            onError={(e) => { e.currentTarget.src = exampleImages[0].url }}
            className="w-36 h-48 md:w-52 md:h-64 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-60"
          />
        </FloatingElement>

        {/* Capa media - círculo más cercano */}
        <FloatingElement depth={1.5} className="top-[20%] left-[35%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].url}
            onError={(e) => { e.currentTarget.src = exampleImages[1].url }}
            className="w-48 h-48 md:w-64 md:h-64 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-75"
          />
        </FloatingElement>
        <FloatingElement depth={1.8} className="top-[65%] left-[40%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].url}
            onError={(e) => { e.currentTarget.src = exampleImages[2].url }}
            className="w-52 h-64 md:w-68 md:h-80 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-80"
          />
        </FloatingElement>
        <FloatingElement depth={1.2} className="top-[40%] left-[70%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].url}
            onError={(e) => { e.currentTarget.src = exampleImages[3].url }}
            className="w-40 h-40 md:w-56 md:h-56 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-70"
          />
        </FloatingElement>
        <FloatingElement depth={1.6} className="top-[30%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].url}
            onError={(e) => { e.currentTarget.src = exampleImages[4].url }}
            className="w-44 h-44 md:w-60 md:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-75"
          />
        </FloatingElement>

        {/* Capa frontal - más cerca del texto */}
        <FloatingElement depth={3.0} className="top-[15%] left-[45%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            onError={(e) => { e.currentTarget.src = exampleImages[0].url }}
            className="w-64 h-80 md:w-80 md:h-96 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-90"
          />
        </FloatingElement>
        <FloatingElement depth={2.5} className="top-[55%] left-[20%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            onError={(e) => { e.currentTarget.src = exampleImages[1].url }}
            className="w-56 h-56 md:w-72 md:h-72 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-85"
          />
        </FloatingElement>
        <FloatingElement depth={3.5} className="top-[70%] left-[55%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].url}
            onError={(e) => { e.currentTarget.src = exampleImages[2].url }}
            className="w-68 h-88 md:w-84 md:h-108 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-95"
          />
        </FloatingElement>

        {/* Elementos adicionales en círculo */}
        <FloatingElement depth={2.0} className="top-[10%] left-[60%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].url}
            onError={(e) => { e.currentTarget.src = exampleImages[3].url }}
            className="w-48 h-48 md:w-64 md:h-64 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-80"
          />
        </FloatingElement>
        <FloatingElement depth={1.0} className="top-[45%] left-[10%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].url}
            onError={(e) => { e.currentTarget.src = exampleImages[4].url }}
            className="w-36 h-44 md:w-48 md:h-56 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-65"
          />
        </FloatingElement>
        <FloatingElement depth={2.8} className="top-[75%] left-[30%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].url}
            onError={(e) => { e.currentTarget.src = exampleImages[5].url }}
            className="w-60 h-60 md:w-76 md:h-76 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-90"
          />
        </FloatingElement>
        <FloatingElement depth={2.2} className="top-[80%] left-[70%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].url}
            onError={(e) => { e.currentTarget.src = exampleImages[6].url }}
            className="w-52 h-68 md:w-64 md:h-84 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-85"
          />
        </FloatingElement>
        <FloatingElement depth={1.4} className="top-[35%] left-[80%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].url}
            onError={(e) => { e.currentTarget.src = exampleImages[7].url }}
            className="w-40 h-52 md:w-56 md:h-68 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-75"
          />
        </FloatingElement>
        <FloatingElement depth={0.8} className="top-[85%] left-[45%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            onError={(e) => { e.currentTarget.src = exampleImages[0].url }}
            className="w-32 h-32 md:w-48 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-55"
          />
        </FloatingElement>
        <FloatingElement depth={2.6} className="top-[5%] left-[25%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            onError={(e) => { e.currentTarget.src = exampleImages[1].url }}
            className="w-56 h-72 md:w-72 md:h-88 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg opacity-90"
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

export { ParallaxGallery }