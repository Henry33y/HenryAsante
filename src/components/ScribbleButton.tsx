import React, { useRef, useEffect, useId } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'

// Register GSAP plugins
gsap.registerPlugin(DrawSVGPlugin, CustomEase)

try {
  CustomEase.create('button-007-ease', '0.78, 0.18, 0.18, 1')
} catch {}

export interface ScribbleButtonProps {
  children: React.ReactNode
  variant?: 'ink-black' | 'dark-blue' | 'light-silver' | 'white' | 'dark' | 'blue'
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  icon?: React.ReactNode
  ariaLabel?: string
}

// Authentic hand-drawn vector scribble path from alejandroha.com
const SCRIBBLE_PATH =
  'M16.332 39.1765C25.6381 35.2853 34.9441 31.3941 40.6554 29.173C50.662 25.2814 21.2379 53.1954 17.526 58.4408C14.8321 62.2478 16.2337 62.0854 17.6851 61.7242C19.1364 61.363 20.5951 60.8079 30.413 55.6381C40.231 50.4684 58.3639 40.7009 68.2847 35.2711C78.2055 29.8412 79.3646 29.0451 79.7292 28.7446C80.0938 28.4441 79.6289 28.6635 73.9175 35.9463C68.2062 43.2292 57.2628 57.5688 51.5744 65.2375C45.886 72.9063 45.7844 73.4697 46.1047 73.6339C46.6385 73.9077 67.9122 61.8313 68.2066 61.6541C82.3093 53.1624 107.339 37.7974 121.861 29.1143C136.382 20.4312 139.637 18.8959 142.043 17.8274C142.799 17.4917 148.024 14.9173 147.361 16.5225C147.121 17.1044 146.542 18.1091 138.743 26.8865C130.945 35.6639 93.8491 65.9527 86.0769 74.6334C78.305 83.3141 78.216 83.6554 78.3741 83.9179C78.5321 84.1803 78.94 84.3537 93.1516 75.4023C107.363 66.451 157.462 34.6003 162.031 35.1974C166.6 35.7944 144.497 73.6977 144.599 78.2813C144.701 82.8649 173.88 53.6113 184.999 47.6105'

export const ScribbleButton: React.FC<ScribbleButtonProps> = ({
  children,
  variant = 'ink-black',
  onClick,
  href,
  target,
  rel,
  className = '',
  size = 'md',
  weight = 'bold',
  icon,
  ariaLabel,
}) => {
  const rawId = useId()
  const maskId = `button-007-mask-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`

  const rootRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const maskSvgRef = useRef<SVGSVGElement>(null)
  const maskPathRef = useRef<SVGPathElement>(null)
  const overlayPathRef = useRef<SVGPathElement>(null)
  const maskObjectRef = useRef<SVGForeignObjectElement>(null)

  const animRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null)
  const isHoveredRef = useRef(false)
  const isQueuedRef = useRef(false)

  // Normalize variant name to match authentic data-wf--button--variant attribute
  const normalizedVariant =
    variant === 'dark' ? 'ink-black' : variant === 'blue' ? 'dark-blue' : variant

  // Weight styling
  const weightConfig = {
    normal: { className: 'font-normal', num: 400 },
    medium: { className: 'font-medium', num: 500 },
    semibold: { className: 'font-semibold', num: 600 },
    bold: { className: 'font-bold', num: 700 },
  }[weight]

  // Dynamic sizing: Increased sizes for clean legibility and modern presence
  const sizeClasses = {
    sm: 'text-[13.5px] sm:text-[14px] [--button-007-padding:0.65em_1.25em]',
    md: 'text-[14px] sm:text-[15px] [--button-007-padding:0.75em_1.35em]',
    lg: 'text-[15px] sm:text-[16px] [--button-007-padding:0.85em_1.75em]',
  }[size]

  // Height syncing for SVG foreignObject
  const updateMaskHeight = () => {
    if (maskSvgRef.current && maskObjectRef.current) {
      const parentSvg = maskSvgRef.current.parentNode?.parentNode as HTMLElement | null
      if (parentSvg) {
        const h = parentSvg.getBoundingClientRect().height
        if (h > 0) {
          maskObjectRef.current.setAttribute('height', h.toString())
        }
      }
    }
  }

  useEffect(() => {
    const paths = [maskPathRef.current, overlayPathRef.current].filter(Boolean) as SVGPathElement[]
    gsap.set(paths, { drawSVG: '0% 0%', strokeWidth: 0 })
    updateMaskHeight()

    const el = rootRef.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      updateMaskHeight()
    })
    ro.observe(el)

    window.addEventListener('resize', updateMaskHeight)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateMaskHeight)
      if (animRef.current) animRef.current.kill()
    }
  }, [])

  // Authentic pointerenter animation: both paths draw in while expanding to strokeWidth 60
  const handlePointerEnter = () => {
    const paths = [maskPathRef.current, overlayPathRef.current].filter(Boolean) as SVGPathElement[]
    if (paths.length === 0) return

    if (isHoveredRef.current) {
      isQueuedRef.current = true
    } else {
      isHoveredRef.current = true
      if (animRef.current) animRef.current.kill()

      gsap.set(paths, { drawSVG: '0% 0%', strokeWidth: 0 })
      animRef.current = gsap.to(paths, {
        strokeWidth: 60,
        drawSVG: '100% 0%',
        duration: 0.8,
        ease: 'button-007-ease',
        overwrite: true,
      })
    }
  }

  // Authentic pointerleave animation: both paths thin to 4 and whisk out to 100% 100%
  const handlePointerLeave = () => {
    const paths = [maskPathRef.current, overlayPathRef.current].filter(Boolean) as SVGPathElement[]
    if (paths.length === 0) return

    if (animRef.current) animRef.current.kill()
    isQueuedRef.current = false

    const tl = gsap.timeline({ overwrite: true })
    animRef.current = tl

    tl.to(paths, { strokeWidth: 4, duration: 0.8, ease: 'button-007-ease' }, 0)
    tl.to(paths, { drawSVG: '100% 100%', duration: 0.8, ease: 'button-007-ease' }, 0)
    tl.call(
      () => {
        isHoveredRef.current = false
        if (isQueuedRef.current) {
          isQueuedRef.current = false
          handlePointerEnter()
        }
      },
      undefined,
      '-=0.2'
    )
  }

  const handleFocus = () => {
    handlePointerEnter()
  }

  const handleBlur = () => {
    handlePointerLeave()
  }

  const innerContent = (
    <>
      <span className="button-007__inner">
        {/* 1. Masked Hover Text Layer */}
        <span className="button-007__text is--hover" aria-hidden="true">
          <svg aria-hidden="true" className="button-007__svg">
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              style={{ maskType: 'alpha' }}
              data-button-007-mask=""
            >
              <svg
                ref={maskSvgRef}
                aria-hidden="true"
                data-button-007-svg=""
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 201 100"
                preserveAspectRatio="none"
                className="w-full h-full block"
              >
                <path
                  ref={maskPathRef}
                  d={SCRIBBLE_PATH}
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                />
              </svg>
            </mask>
            <foreignObject
              ref={maskObjectRef}
              width="100%"
              height="100%"
              mask={`url(#${maskId})`}
              data-button-007-mask-object=""
              className="button-007__svg-object"
            >
              <div className="button-007__svg-inner">
                <div className="button-007__svg-text-wrap">
                  <span
                    className="button-007__svg-text flex items-center justify-center gap-2"
                    style={{ fontWeight: weightConfig.num }}
                  >
                    <span>{children}</span>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                  </span>
                </div>
              </div>
            </foreignObject>
          </svg>
        </span>

        {/* 2. Visual Scribble Path Overlay */}
        <svg
          aria-hidden="true"
          data-button-007-svg=""
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 201 100"
          preserveAspectRatio="none"
          className="button-007__svg-overlay"
        >
          <path
            ref={overlayPathRef}
            d={SCRIBBLE_PATH}
            stroke="currentColor"
            strokeWidth="0"
            strokeLinecap="round"
          />
        </svg>

        {/* 3. Default (Resting) Text Layer */}
        <span
          className="button-007__text is--default flex items-center justify-center gap-2"
          style={{ fontWeight: weightConfig.num }}
        >
          <span>{children}</span>
          {icon && <span className="flex-shrink-0">{icon}</span>}
        </span>
      </span>

      {/* 4. Background Pill */}
      <span className="button-007__bg" />
    </>
  )

  const commonProps = {
    ref: rootRef as any,
    'data-button-007': '',
    'data-wf--button--variant': normalizedVariant,
    'data-wf--button-link--variant': normalizedVariant,
    'data-button-variant': normalizedVariant,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'aria-label': ariaLabel,
    style: {
      '--button-007-font-weight': weightConfig.num,
      fontWeight: weightConfig.num,
    } as unknown as React.CSSProperties,
    className: `button-007 ${href ? 'w-inline-block ' : ''}${sizeClasses} ${weightConfig.className} ${className}`,
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} {...commonProps}>
        {innerContent}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} {...commonProps}>
      {innerContent}
    </button>
  )
}

export default ScribbleButton
