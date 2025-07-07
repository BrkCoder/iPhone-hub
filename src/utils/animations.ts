import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger);

// Type definitions for animation functions
interface AnimationProps {
  [key: string]: any;
}

interface ScrollProps {
  [key: string]: any;
}

interface TimelineAnimationProps {
  transform?: string;
  duration?: number;
  [key: string]: any;
}

export const animateWithGsap = (
  target: string | Element, 
  animationProps: AnimationProps, 
  scrollProps?: ScrollProps
): void => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: 'restart reverse restart reverse',
      start: 'top 85%',
      ...scrollProps,
    }
  })
}

export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline, 
  rotationRef: React.RefObject<THREE.Group>, 
  rotationState: number, 
  firstTarget: string, 
  secondTarget: string, 
  animationProps: TimelineAnimationProps
): void => {
  // Animate the 3D model rotation
  timeline.to(rotationRef.current?.rotation || {}, {
    y: rotationState,
    duration: 1,
    ease: 'power2.inOut'
  })

  // Animate the first target element
  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
    },
    '<'
  )

  // Animate the second target element
  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: 'power2.inOut'
    },
    '<'
  )
}