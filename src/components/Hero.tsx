import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'
import Orb from '../ui/orb-background'

gsap.registerPlugin(ScrollToPlugin)

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.8 },
      })

      // Animate hero elements with subtle upward movement and stagger
      tl.from(['.hero-title', '.hero-subtitle', '.hero-btn'], {
        y: 20, // small vertical offset
        opacity: 0,
        stagger: 0.25, // stagger between elements
      })
    },
    { scope: containerRef }
  )

  const handleClick = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: '#uploader', offsetY: 20 },
      ease: 'power2.inOut',
    })
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[100vh] flex justify-center items-center relative"
    >
      <Orb
        hoverIntensity={1.2}
        rotateOnHover={true}
        hue={110}
        forceHoverState={false}
      />

      <div className="absolute text-center text-white z-10">
        <h1 className="hero-title text-5xl font-bold mb-4">Modelia</h1>
        <p className="hero-subtitle text-xl text-gray-300">
          AI-Powered Asset Generator
        </p>
        <button
          className="hero-btn px-6 py-3 rounded-xl border border-neutral-600 text-black bg-white cursor-pointer mt-10"
          onClick={handleClick}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Hero
