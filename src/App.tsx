import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { ScribbleButton } from './components/ScribbleButton'

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin)

// Exact winding screen-fill transition scribble path from alejandroha.com
const SCROLL_DRAW_PATH =
  'M299.654 453.865C505.574 319.225 711.494 184.585 836.054 109.945C960.614 35.3048 997.574 24.7448 944.014 110.385C890.454 196.025 745.254 378.185 571.454 634.385C397.654 890.585 199.654 1215.3 110.854 1382.58C22.0544 1549.86 48.4544 1549.86 77.8944 1540.62C107.334 1531.38 139.014 1512.9 367.854 1319.9C596.694 1126.9 1021.73 759.945 1255.21 555.065C1488.69 350.185 1517.73 318.505 1527.41 306.145C1537.09 293.785 1526.53 301.705 1346.85 618.625C1167.17 935.545 818.694 1561.22 635.214 1896.74C451.734 2232.26 443.814 2258.66 447.654 2268.3C451.494 2277.94 467.334 2270.02 511.134 2236.9C554.934 2203.78 626.214 2145.7 966.534 1817.46C1306.85 1489.22 1914.05 892.585 2263.81 557.505C2613.57 222.425 2687.49 166.985 2741.41 129.185C2795.33 91.3848 2827.01 72.9048 2843.33 67.3448C2859.65 61.7848 2859.65 69.7048 2849.09 96.2248C2838.53 122.745 2817.41 167.625 2584.77 544.505C2352.13 921.385 1370.37 2165.43 1139.25 2537.83C908.134 2910.23 902.854 2926.07 902.774 2939.51C902.694 2952.95 907.974 2963.51 1255.21 2613.87C1602.45 2264.23 2829.73 1017.54 2903.53 1071.46C2977.33 1125.38 2176.12 2817.04 2128 3037C2079.88 3256.96 2911.24 2018.56 3172 1793'

// Authentic Services items from alejandroha.com
const servicesData = [
  {
    number: '[01]',
    title: { en: 'Webflow development', es: 'Desarrollo Webflow' },
    description: {
      en: 'Custom Webflow websites built for complete design freedom and advanced interactions, with a clean, easy to manage CMS. Update your content anytime without relying on a developer.',
      es: 'Sitios en Webflow pensados para libertad de diseño y animación avanzada, con estructuras simples de administrar. Actualiza contenido cuando quieras, sin depender de un desarrollador.',
    },
    image: '/images/aha-img__02.avif',
    imageAlt: 'Torre Agency Webflow Website Design',
  },
  {
    number: '[02]',
    title: { en: 'Shopify / Ecommerce', es: 'Shopify / Ecommerce' },
    description: {
      en: 'Custom Shopify stores designed around your brand, creating shopping experiences that feel unique instead of generic.',
      es: 'Shopify es la plataforma de ecommerce elegida por marcas de todo el mundo, y la personalizo a fondo, para una experiencia de compra que no se siente genérica.',
    },
    image: '/images/aha-img__04.avif',
    imageAlt: '1957 Studio Shopify Store Design',
  },
  {
    number: '[03]',
    title: { en: 'Animations & Microinteractions', es: 'Animaciones y micro-interacciones' },
    description: {
      en: 'Motion has a purpose. I design animations that guide users, reinforce your brand identity, and turn every scroll into a memorable experience.',
      es: 'El movimiento comunica. Diseño animaciones que guían al usuario, refuerzan la identidad de la marca y convierten cada scroll en una experiencia memorable.',
    },
    image: '/images/aha-img__03.avif',
    imageAlt: 'Laptop Animation and Interactive Interface',
  },
  {
    number: '[04]',
    title: { en: 'Custom code', es: 'Código personalizado' },
    description: {
      en: 'Webflow and Shopify are incredibly powerful, but some projects demand more. That\'s where custom code makes the difference, creating the kind of polished experiences often seen on <a href="https://www.awwwards.com/" data-underline-link="" target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">Awwwards</a>.',
      es: 'Webflow y Shopify son plataformas increíbles, pero hay proyectos que piden ir más allá. Ahí entra el código personalizado, el detalle que separa un sitio bueno de uno digno de un reconocimiento como <a href="https://www.awwwards.com/" data-underline-link="" target="_blank" rel="noopener noreferrer" class="underline hover:text-white transition-colors">Awwwards</a>.',
    },
    image: '/images/aha-img__05.avif',
    imageAlt: 'Developer working with custom code and animations',
  },
]

// Authentic Portfolio projects from alejandroha.com
const portfolioProjects = [
  {
    title: 'Cinetica Studio',
    url: 'https://www.cinetica.studio/',
    placeholder: '/images/cinetica-placeholder.avif',
    video: '/videos/cinetica-video.mp4',
    description: {
      en: 'An immersive portfolio experience showcasing how Cinética Studio transforms bold ideas into digital realities through CGI, XR, real-time technology, and interactive design.',
      es: 'Una experiencia de portafolio inmersiva que muestra cómo Cinética Studio transforma ideas audaces en realidades digitales a través de CGI, XR, tecnología en tiempo real y diseño interactivo.',
    },
  },
  {
    title: 'Luan Studio',
    url: 'https://www.luanstudio.com/',
    placeholder: '/images/luanstudio-placeholder.avif',
    video: '/videos/luanstudio-video.mp4',
    description: {
      en: 'A digital portfolio for Luan Studio that translates their identity as a branding studio into seamless navigation and a memorable visual experience.',
      es: 'Un portafolio digital para Luan Studio que traduce su identidad como estudio de branding en una navegación fluida y una experiencia visual memorable.',
    },
  },
  {
    title: 'Casa Aranzazu',
    url: 'https://www.casaranzazuslp.com/',
    placeholder: '/images/aranzazu-placeholder.avif',
    video: '/videos/aranzazu-video.mp4',
    description: {
      en: 'Landing Page with booking engine integration, designed to guide the user from the first scroll to effortless reservation without friction.',
      es: 'Landing Page con integración de motor de reservas, pensada para llevar al usuario del primer scroll a la reservación sin fricción.',
    },
  },
  {
    title: 'Contraste',
    url: 'https://contraste-mx.webflow.io/',
    placeholder: '/images/contraste-placeholder.avif',
    video: '/videos/contraste-video.mp4',
    description: {
      en: 'A website that transforms more than 35 years of experience in experiential marketing and event production into a dynamic and memorable digital journey.',
      es: 'Un sitio web que transforma más de 35 años de experiencia en marketing experiencial y producción de eventos en una experiencia digital dinámica y memorable.',
    },
  },
  {
    title: 'Altapets',
    url: 'https://altapetscare.com/',
    placeholder: '/images/altapets-placeholder.avif',
    video: '/videos/altapets-video.mp4',
    description: {
      en: 'An e-commerce experience for Altapets where every key component (header, footer, cart, and subscriptions) was custom-built with code, taking the site far beyond standard Shopify.',
      es: 'Un e-commerce para Altapets donde cada pieza clave (header, footer, carrito y suscripciones) fue construida a medida con código, llevando el sitio mucho más allá de un Shopify.',
    },
  },
]

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLButtonElement>(null)
  const bgWrapRef = useRef<HTMLDivElement>(null)
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null)
  const bracketLeftRef = useRef<HTMLSpanElement>(null)
  const bracketRightRef = useRef<HTMLSpanElement>(null)
  const scrollDrawTransitionRef = useRef<HTMLDivElement>(null)
  const scrollDrawSectionRef = useRef<HTMLElement>(null)
  const scrollDrawOverlayRef = useRef<HTMLDivElement>(null)
  const scrollDrawPathRef = useRef<SVGPathElement>(null)
  const servicesHeadingRef = useRef<HTMLHeadingElement>(null)
  const servicesBracketLeftRef = useRef<HTMLSpanElement>(null)
  const servicesBracketRightRef = useRef<HTMLSpanElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const servicesListRef = useRef<HTMLDivElement>(null)
  const drawTlRef = useRef<gsap.core.Timeline | null>(null)
  const [isBrandWhite, setIsBrandWhite] = useState(false)
  const isBrandWhiteRef = useRef(false)

  // Portfolio Orbit Refs & State
  const portfolioRef = useRef<HTMLElement>(null)
  const portfolioHeadingRef = useRef<HTMLHeadingElement>(null)
  const portfolioBracketLeftRef = useRef<HTMLSpanElement>(null)
  const portfolioBracketRightRef = useRef<HTMLSpanElement>(null)
  const portfolioOrbitRef = useRef<HTMLDivElement>(null)
  const portfolioListRef = useRef<HTMLDivElement>(null)
  const currentCountRef = useRef<HTMLParagraphElement>(null)
  const [activeOrbitIndex, setActiveOrbitIndex] = useState(0)

  const orbitStepRef = useRef<{ step: number }>({ step: 0 })
  const orbitActiveIndexRef = useRef<number>(0)
  const orbitCardsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const orbitItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const orbitVideosRef = useRef<(HTMLVideoElement | null)[]>([])
  const isOrbitInViewRef = useRef(false)
  const orbitWidthRef = useRef<number>(360)
  const orbitStepTweenRef = useRef<gsap.core.Tween | null>(null)
  const orbitRotationRef = useRef<{ rotation: number }>({ rotation: 0 })

  // Certifications Section Refs
  const certificationRef = useRef<HTMLElement>(null)
  const certifiedHeadingRef = useRef<HTMLHeadingElement>(null)

  // Contact & Footer Section Refs
  const contactRef = useRef<HTMLElement>(null)
  const contactContentRef = useRef<HTMLDivElement>(null)
  const contactWordsRef = useRef<HTMLDivElement>(null)
  const footerWrapRef = useRef<HTMLDivElement>(null)
  const footerInnerRef = useRef<HTMLElement>(null)

  const lenisRef = useRef<Lenis | null>(null)
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Continuous real-time detection of section background under header
  const checkTheme = useCallback(() => {
    const navY = 50 // Vertical center checkpoint of the fixed header

    // 1. If footer is reached -> dark blue background -> white text
    if (footerWrapRef.current) {
      const footRect = footerWrapRef.current.getBoundingClientRect()
      if (footRect.top <= navY) {
        if (!isBrandWhiteRef.current) {
          isBrandWhiteRef.current = true
          setIsBrandWhite(true)
        }
        return
      }
    }

    // 2. If contact is active under the header -> ink-black background -> white text
    if (contactRef.current) {
      const contactRect = contactRef.current.getBoundingClientRect()
      if (contactRect.top <= navY && contactRect.bottom >= 0) {
        if (!isBrandWhiteRef.current) {
          isBrandWhiteRef.current = true
          setIsBrandWhite(true)
        }
        return
      }
    }

    // 3. If certifications section is reaching or has reached the header -> background is light silver -> black text
    if (certificationRef.current) {
      const certRect = certificationRef.current.getBoundingClientRect()
      if (certRect.top <= navY && certRect.bottom >= 0) {
        if (isBrandWhiteRef.current) {
          isBrandWhiteRef.current = false
          setIsBrandWhite(false)
        }
        return
      }
    }

    // 4. If portfolio is reaching or has reached the header -> background is light silver -> black text
    if (portfolioRef.current) {
      const portRect = portfolioRef.current.getBoundingClientRect()
      if (portRect.top <= navY && portRect.bottom >= 0) {
        if (isBrandWhiteRef.current) {
          isBrandWhiteRef.current = false
          setIsBrandWhite(false)
        }
        return
      }
    }

    // 5. If services showcase is active under the header -> background is 100% purple -> white text
    if (servicesRef.current) {
      const servRect = servicesRef.current.getBoundingClientRect()
      if (servRect.top <= navY && servRect.bottom >= 0) {
        if (!isBrandWhiteRef.current) {
          isBrandWhiteRef.current = true
          setIsBrandWhite(true)
        }
        return
      }
    }

    // 6. If scroll draw transition is active under the header
    if (scrollDrawTransitionRef.current) {
      const transRect = scrollDrawTransitionRef.current.getBoundingClientRect()
      if (transRect.top <= navY && transRect.bottom >= 0) {
        // The header text should ONLY turn white once the purple ink scribble has expanded and covered the header
        const isScribbleCoveringHeader = drawTlRef.current ? drawTlRef.current.progress() >= 0.35 : false
        if (isScribbleCoveringHeader) {
          if (!isBrandWhiteRef.current) {
            isBrandWhiteRef.current = true
            setIsBrandWhite(true)
          }
        } else {
          if (isBrandWhiteRef.current) {
            isBrandWhiteRef.current = false
            setIsBrandWhite(false)
          }
        }
        return
      }
    }

    // 7. Fallback (Hero or About section) -> background is light silver -> black text
    if (isBrandWhiteRef.current) {
      isBrandWhiteRef.current = false
      setIsBrandWhite(false)
    }
  }, [])

  // Initialize Lenis Smooth Scrolling and link to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    const handleScroll = () => {
      ScrollTrigger.update()
      checkTheme()
    }

    lenis.on('scroll', handleScroll)
    window.addEventListener('scroll', checkTheme, { passive: true })
    window.addEventListener('resize', checkTheme)
    ScrollTrigger.addEventListener('refresh', checkTheme)

    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerHandler)
    gsap.ticker.lagSmoothing(0)

    // Initial check
    checkTheme()

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerHandler)
      window.removeEventListener('scroll', checkTheme)
      window.removeEventListener('resize', checkTheme)
      ScrollTrigger.removeEventListener('refresh', checkTheme)
    }
  }, [checkTheme])

  const showNotification = (msg: string) => {
    setCopiedNotification(msg)
    setTimeout(() => setCopiedNotification(null), 2500)
  }

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Portfolio Orbit calculation helpers & handlers
  const wrapIndex = (val: number) => {
    const count = portfolioProjects.length
    return ((Math.round(val) % count) + count) % count
  }

  const updateOrbitPositions = () => {
    const count = portfolioProjects.length
    const yWidth = orbitWidthRef.current || 360
    const spreadX = 0.72 * yWidth
    const blurFactor = 0.04 * yWidth
    const currentStep = orbitStepRef.current?.step ?? 0
    const rot = orbitRotationRef.current?.rotation ?? 0

    if (portfolioListRef.current) {
      gsap.set(portfolioListRef.current, { rotation: rot })
    }

    const activeIdx = wrapIndex(currentStep)

    orbitItemsRef.current.forEach((item, a) => {
      if (!item) return
      const card = orbitCardsRef.current[a]
      const isActive = a === activeIdx

      if (card) {
        if (isActive) {
          card.style.pointerEvents = 'auto'
          card.style.cursor = 'pointer'
          card.setAttribute('tabindex', '0')
          card.removeAttribute('aria-disabled')
        } else {
          card.style.pointerEvents = 'auto'
          card.style.cursor = 'pointer'
          card.setAttribute('tabindex', '-1')
          card.setAttribute('aria-disabled', 'true')
        }
      }

      const angle = ((a - currentStep) / count) * Math.PI * 2
      const cosVal = (Math.cos(angle) + 1) / 2
      const depth = Math.pow(cosVal, 1.3)
      const x = Math.sin(angle) * spreadX
      const scale = gsap.utils.interpolate(0.32, 1, depth)
      const blur = gsap.utils.interpolate(blurFactor, 0, depth)
      const zIndex = Math.round(1000 * depth)

      gsap.set(item, {
        x,
        y: 0,
        scale,
        opacity: 1,
        rotation: -rot,
        filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none',
        zIndex,
      })
    })
  }

  const measureOrbit = () => {
    const firstCard = orbitCardsRef.current[0]
    if (firstCard) {
      const cardW = firstCard.offsetWidth || 360
      orbitWidthRef.current = cardW * 1.15
    }
    updateOrbitPositions()
  }

  const handleOrbitStep = (delta: number) => {
    const currentH = Math.round(orbitStepRef.current?.step ?? 0)
    const targetH = currentH + delta
    const nextActiveIndex = wrapIndex(targetH)

    // Pause all videos during step transition
    orbitVideosRef.current.forEach((v) => {
      if (v) v.pause()
    })

    // Animate counter
    if (currentCountRef.current) {
      gsap.timeline()
        .to(currentCountRef.current, {
          yPercent: delta > 0 ? -100 : 100,
          opacity: 0,
          duration: 0.22,
          ease: 'power3.in',
        })
        .call(() => {
          setActiveOrbitIndex(nextActiveIndex)
        })
        .set(currentCountRef.current, {
          yPercent: delta > 0 ? 100 : -100,
          opacity: 0,
        })
        .to(currentCountRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.32,
          ease: 'power3.out',
        })
    } else {
      setActiveOrbitIndex(nextActiveIndex)
    }

    orbitActiveIndexRef.current = nextActiveIndex

    orbitStepTweenRef.current?.kill()
    orbitStepTweenRef.current = gsap.to(orbitStepRef.current, {
      step: targetH,
      duration: 0.75,
      ease: 'power2.out',
      onUpdate: updateOrbitPositions,
      onComplete: () => {
        const activeVideo = orbitVideosRef.current[nextActiveIndex]
        if (activeVideo && isOrbitInViewRef.current) {
          activeVideo.play().catch(() => {})
        }
      },
    })
  }

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    const count = portfolioProjects.length
    if (index !== orbitActiveIndexRef.current) {
      e.preventDefault()
      let delta = (index - orbitActiveIndexRef.current) % count
      if (delta > count / 2) delta -= count
      if (delta < -count / 2) delta += count
      handleOrbitStep(delta)
    }
  }

  // Keyboard navigation & resize handler for Portfolio Orbit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOrbitInViewRef.current) return
      const activeEl = document.activeElement
      if (activeEl?.matches('input, textarea, select, [contenteditable="true"]')) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleOrbitStep(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleOrbitStep(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', measureOrbit)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', measureOrbit)
    }
  }, [])

  // GSAP Animations: Scroll transition of brand into header + Window/Curtain Parallax
  useGSAP(
    () => {
      // 1. Initial entrance timeline for hero items
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      gsap.set(['.nav-button-item', '.partner-wrap', '.locate-wrap'], {
        opacity: 0,
        y: 20,
      })
      gsap.set(bgWrapRef.current, {
        opacity: 0,
        scale: 1.04,
      })

      introTl
        .to(bgWrapRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
        })
        .to(
          '.nav-button-item',
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.8'
        )
        .to(
          ['.partner-wrap', '.locate-wrap'],
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          '-=0.6'
        )

      // 2. Window / Curtain Parallax on the oversized background canvas
      if (bgWrapRef.current && heroRef.current) {
        gsap.to(bgWrapRef.current, {
          yPercent: 32,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // 3. BRAND LOGO TRANSITION:
      // Hero size (spanning screen) -> Fixed Header size (compact top-left navbar logo)
      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 1025px)',
          isTablet: '(min-width: 641px) and (max-width: 1024px)',
          isMobile: '(max-width: 640px)',
        },
        (context) => {
          const { isTablet, isMobile } = context.conditions as {
            isDesktop: boolean
            isTablet: boolean
            isMobile: boolean
          }

          if (!brandRef.current || !heroRef.current) return

          // Hero initial state
          const heroWidth = isMobile ? 'calc(100vw - 3rem)' : 'calc(100vw - 5rem)'
          const heroMaxW = isMobile ? '100%' : '1400px'
          const heroY = isMobile ? '10vh' : isTablet ? '12vh' : '13.5vh'

          // Header final docked state - increased to better match reference image
          const headerWidth = isMobile ? '150px' : isTablet ? '185px' : '225px'

          gsap.set(brandRef.current, {
            width: heroWidth,
            maxWidth: heroMaxW,
            y: heroY,
            x: 0,
          })

          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
              onUpdate: (self) => {
                setIsScrolled(self.progress > 0.65)
              },
            },
          })

          scrollTl.to(brandRef.current, {
            width: headerWidth,
            maxWidth: headerWidth,
            y: 0,
            x: 0,
            ease: 'sine.inOut',
          })
        }
      )

      // 4. Bracket Closing Parallax Scrub ([ About me ])
      if (bracketLeftRef.current && bracketRightRef.current && aboutHeadingRef.current) {
        const mmBracket = gsap.matchMedia()

        mmBracket.add(
          {
            isMobile: '(max-width: 640px)',
            isTablet: '(min-width: 641px) and (max-width: 1024px)',
            isDesktop: '(min-width: 1025px)',
          },
          (context) => {
            const { isMobile, isTablet } = context.conditions as {
              isMobile: boolean
              isTablet: boolean
              isDesktop: boolean
            }
            // Subtle, tasteful starting separation so the braces don't fly in from too far
            const offset = isMobile ? 18 : isTablet ? 26 : 36

            gsap.fromTo(
              bracketLeftRef.current,
              { x: -offset },
              {
                x: 0,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: aboutHeadingRef.current,
                  start: 'top 92%',
                  end: 'top 52%',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            )

            gsap.fromTo(
              bracketRightRef.current,
              { x: offset },
              {
                x: 0,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: aboutHeadingRef.current,
                  start: 'top 92%',
                  end: 'top 52%',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            )
          }
        )
      }

      // 5. Reveal animation for About Header content
      gsap.from('.about-header-item', {
        y: 45,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      // 6. Reveal animation for Bio & Action items
      gsap.from('.about-bio-item', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutHeadingRef.current || '#about',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // 7. Bracket Closing Parallax Scrub ([ Services ])
      if (
        servicesBracketLeftRef.current &&
        servicesBracketRightRef.current &&
        scrollDrawTransitionRef.current
      ) {
        const mmServicesBracket = gsap.matchMedia()
        mmServicesBracket.add(
          {
            isMobile: '(max-width: 640px)',
            isTablet: '(min-width: 641px) and (max-width: 1024px)',
            isDesktop: '(min-width: 1025px)',
          },
          (context) => {
            const { isMobile, isTablet } = context.conditions as {
              isMobile: boolean
              isTablet: boolean
              isDesktop: boolean
            }
            const offset = isMobile ? 22 : isTablet ? 32 : 44

            gsap.fromTo(
              servicesBracketLeftRef.current,
              { x: -offset },
              {
                x: 0,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: scrollDrawTransitionRef.current,
                  start: 'top 85%',
                  end: 'top 15%',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            )

            gsap.fromTo(
              servicesBracketRightRef.current,
              { x: offset },
              {
                x: 0,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: scrollDrawTransitionRef.current,
                  start: 'top 85%',
                  end: 'top 15%',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            )
          }
        )
      }

      // 8. Signature Scribble Draw Screen-Fill Transition from alejandroha.com
      if (scrollDrawTransitionRef.current && scrollDrawPathRef.current && scrollDrawSectionRef.current) {
        const transitionEl = scrollDrawTransitionRef.current
        const sectionEl = scrollDrawSectionRef.current
        const pathEl = scrollDrawPathRef.current

        const updateHeight = () => {
          gsap.set(transitionEl, { height: Math.max(sectionEl.scrollHeight, window.innerHeight) })
        }
        updateHeight()

        gsap.set(pathEl, { strokeWidth: 0, drawSVG: '0% 0%' })

        const drawTl = gsap.timeline({
          scrollTrigger: {
            trigger: transitionEl,
            start: 'top top',
            end: '+=200%',
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: updateHeight,
            onUpdate: checkTheme,
          },
        })
        drawTlRef.current = drawTl

        drawTl
          .to(pathEl, { strokeWidth: '5%', duration: 0.05, ease: 'none' }, 0)
          .to(pathEl, { drawSVG: '0% 85%', duration: 1, ease: 'none' }, 0)
          .to(pathEl, { strokeWidth: '80%', duration: 0.75, ease: 'none' }, 0.25)
      }

      // 10. Services Section Fullscreen Scroll-Pinned Showcase (from alejandroha.com)
      if (servicesRef.current && servicesListRef.current) {
        const servicesEl = servicesRef.current
        const listEl = servicesListRef.current
        const rows = Array.from(servicesEl.querySelectorAll<HTMLElement>('[data-services-row]'))
        const visuals = Array.from(servicesEl.querySelectorAll<HTMLElement>('[data-services-visual]'))
        const imageWraps = Array.from(servicesEl.querySelectorAll<HTMLElement>('[data-services-image-wrap]'))

        const mmServices = gsap.matchMedia()
        mmServices.add('(min-width: 992px)', () => {
          if (!rows.length || !visuals.length || !imageWraps.length) return

          const updateHeights = () => {
            visuals.forEach((visual, a) => {
              const rowH = rows[a]?.offsetHeight || 60
              const prevRowHeight = a > 0 ? (rows[a - 1]?.offsetHeight || 60) : 0
              const visualHeight = window.innerHeight - rowH - prevRowHeight
              gsap.set(visual, { height: Math.max(visualHeight, 0) })
            })
          }
          updateHeights()

          gsap.set(listEl, { y: 0 })
          visuals.forEach((visual, a) => {
            gsap.set(visual, { overflow: 'hidden' })
            gsap.set(imageWraps[a], { left: '29%', width: a === 0 ? '71%' : '0%' })
          })

          const servicesTl = gsap.timeline({
            scrollTrigger: {
              trigger: servicesEl,
              start: 'top top',
              end: () => `+=${window.innerHeight * servicesData.length}`,
              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: updateHeights,
              onUpdate: checkTheme,
            },
          })

          for (let i = 0; i < servicesData.length - 1; i++) {
            const nextIdx = i + 1
            servicesTl
              .to(visuals[i], { height: 0, duration: 1, ease: 'none' }, i)
              .to(imageWraps[i], { left: '100%', width: '0%', duration: 1, ease: 'none' }, i)
              .to(imageWraps[nextIdx], { left: '29%', width: '71%', duration: 1, ease: 'none' }, i)
              .to(
                listEl,
                {
                  y: () => {
                    if (nextIdx < 2) return 0
                    let sum = 0
                    for (let r = 0; r <= nextIdx - 2; r++) {
                      sum += (rows[r]?.offsetHeight || 0)
                    }
                    return -sum
                  },
                  duration: 1,
                  ease: 'none',
                },
                i
              )
          }

          return () => {
            gsap.set([listEl, ...visuals, ...imageWraps], {
              clearProps: 'transform,height,width,left,top,zIndex,overflow,opacity',
            })
          }
        })

        mmServices.add('(min-width: 768px) and (max-width: 991px)', () => {
          let scrollHeights: number[] = []
          const calcHeights = () => {
            scrollHeights = visuals.map((v) => v.scrollHeight)
          }
          const resetStates = () => {
            gsap.set(listEl, { y: 0 })
            visuals.forEach((visual, o) => {
              gsap.set(visual, { height: o === 0 ? scrollHeights[o] : 0, overflow: 'hidden' })
              gsap.set(imageWraps[o], { clearProps: 'transform,width,left,top,clipPath,opacity,visibility' })
            })
          }
          calcHeights()

          const tabletTl = gsap.timeline({
            scrollTrigger: {
              trigger: servicesEl,
              start: 'top top',
              end: () => `+=${window.innerHeight * (servicesData.length - 1)}`,
              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: () => {
                calcHeights()
                resetStates()
              },
              onUpdate: checkTheme,
            },
          })
          resetStates()

          for (let i = 0; i < servicesData.length - 1; i++) {
            const nextIdx = i + 1
            tabletTl
              .to(visuals[i], { height: 0, duration: 1, ease: 'none' }, i)
              .to(visuals[nextIdx], { height: () => scrollHeights[nextIdx], duration: 1, ease: 'none' }, i)
          }

          return () => {
            gsap.set([listEl, ...visuals, ...imageWraps], {
              clearProps: 'transform,height,width,left,top,zIndex,overflow,opacity',
            })
          }
        })

        mmServices.add('(max-width: 767px)', () => {
          gsap.set([listEl, ...visuals, ...imageWraps], {
            clearProps: 'transform,height,width,left,top,zIndex,overflow,opacity',
          })
        })
      }



      // 11. Bracket Closing Parallax ([ Portfolio ] / [ Proyectos ])
      if (portfolioHeadingRef.current && portfolioBracketLeftRef.current && portfolioBracketRightRef.current) {
        const mmPortfolioBracket = gsap.matchMedia()
        mmPortfolioBracket.add(
          {
            isMobile: '(max-width: 640px)',
            isTablet: '(min-width: 641px) and (max-width: 1024px)',
            isDesktop: '(min-width: 1025px)',
          },
          (context) => {
            const { isMobile, isTablet } = context.conditions as {
              isMobile: boolean
              isTablet: boolean
              isDesktop: boolean
            }
            const offset = isMobile ? 18 : isTablet ? 26 : 36

            gsap.fromTo(
              portfolioBracketLeftRef.current,
              { x: -offset },
              {
                x: 0,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: portfolioHeadingRef.current,
                  start: 'top 92%',
                  end: 'top 52%',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            )

            gsap.fromTo(
              portfolioBracketRightRef.current,
              { x: offset },
              {
                x: 0,
                ease: 'sine.out',
                scrollTrigger: {
                  trigger: portfolioHeadingRef.current,
                  start: 'top 92%',
                  end: 'top 52%',
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            )
          }
        )
      }

      // 12. 3D Elliptical Orbit Carousel (initPortfolioOrbit)
      if (portfolioOrbitRef.current && portfolioListRef.current) {
        measureOrbit()

        // Gyro continuous gentle orbit tilt/rotation
        const gyroTween = gsap.to(orbitRotationRef.current, {
          rotation: 360,
          duration: 36,
          ease: 'none',
          repeat: -1,
          onUpdate: updateOrbitPositions,
        })

        // Viewport intersection trigger for video playback & gyro tween
        ScrollTrigger.create({
          trigger: portfolioOrbitRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: ({ isActive }) => {
            isOrbitInViewRef.current = isActive
            if (isActive) {
              gyroTween.play()
              const activeVideo = orbitVideosRef.current[orbitActiveIndexRef.current]
              if (activeVideo) activeVideo.play().catch(() => {})
            } else {
              gyroTween.pause()
              orbitVideosRef.current.forEach((v) => {
                if (v) v.pause()
              })
            }
          },
        })
      }
    },
    { scope: containerRef }
  )

  // Authentic Random Scatter & Assemble Scroll Animation for Certifications Heading (initSplitRandom)
  useGSAP(
    () => {
      if (!certifiedHeadingRef.current) return
      const headingEl = certifiedHeadingRef.current
      const chars = Array.from(headingEl.querySelectorAll<HTMLElement>('.split-char'))
      if (!chars.length) return

      const fontSize = parseFloat(window.getComputedStyle(headingEl).fontSize) || 48
      const maxDist = Math.min(3 * fontSize, 0.2 * Math.min(window.innerWidth, window.innerHeight))

      chars.forEach((ch) => {
        gsap.set(ch, {
          x: gsap.utils.random(-maxDist, maxDist),
          y: gsap.utils.random(-maxDist, maxDist),
          rotation: gsap.utils.random(-90, 90),
          scale: gsap.utils.random(0.5, 1.4),
          filter: 'blur(8px)',
        })
      })

      gsap.to(chars, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        filter: 'blur(0px)',
        stagger: { each: 0.03, from: 'random' },
        scrollTrigger: {
          trigger: headingEl,
          start: 'top bottom',
          end: 'top 20%',
          scrub: true,
        },
      })
    },
    { scope: containerRef, dependencies: [language] }
  )

  // Authentic 3D Floating Multilingual Word Cloud (initContactSection) & Footer Curtain Parallax (initFooterParallax)
  useGSAP(
    () => {
      // 1. Contact Section
      if (contactRef.current && contactContentRef.current && contactWordsRef.current) {
        const contactEl = contactRef.current
        const contentEl = contactContentRef.current
        const wordsEl = contactWordsRef.current

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const wordList = [
          'CONTACTO',
          'CONTACT',
          'CONTACTEZ',
          'CONTATTO',
          'KONTAKT',
          'CONTATO',
          'CONTACT',
          'ΕΠΙΚΟΙΝΩΝΙΑ',
          '連絡',
          '연락',
          'تواصل',
        ]
        const baseCoords = [
          { x: -38, y: -38 }, { x: -14, y: -40 }, { x: 14, y: -40 }, { x: 38, y: -38 },
          { x: -42, y: -14 }, { x: -18, y: -18 }, { x: 18, y: -18 }, { x: 42, y: -14 },
          { x: -42, y: 14 },  { x: -18, y: 18 },  { x: 18, y: 18 },  { x: 42, y: 14 },
          { x: -38, y: 38 },  { x: -14, y: 40 },  { x: 14, y: 40 },  { x: 38, y: 38 },
        ]

        // Content entrance reveal
        gsap.set(contentEl, { autoAlpha: 0, yPercent: 25, scale: 0.96, filter: 'blur(0.5rem)' })
        gsap.to(contentEl, {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          filter: 'blur(0rem)',
          ease: 'none',
          scrollTrigger: {
            trigger: contactEl,
            start: 'top 60%',
            end: 'top 25%',
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: checkTheme,
          },
        })

        if (!reducedMotion) {
          wordsEl.innerHTML = ''
          const wordSpans: HTMLElement[] = []
          for (let i = 0; i < 50; i++) {
            const span = document.createElement('span')
            span.setAttribute('data-contact-word', '')
            span.textContent = wordList[i % wordList.length]
            wordsEl.appendChild(span)
            wordSpans.push(span)
          }

          const contactTl = gsap.timeline({
            scrollTrigger: {
              trigger: contactEl,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: checkTheme,
            },
          })

          wordSpans.forEach((span, i) => {
            const coord = baseCoords[i % baseCoords.length]
            const tierOffset = 0.12 * Math.floor(i / baseCoords.length)
            const startTime = gsap.utils.random(0, 0.52) + tierOffset
            const dur1 = gsap.utils.random(0.12, 0.18)
            const dur2 = gsap.utils.random(0.12, 0.18)

            const initX = coord.x * gsap.utils.random(0.08, 0.22)
            const initY = coord.y * gsap.utils.random(0.08, 0.22)
            const midX = coord.x + gsap.utils.random(-4, 4)
            const midY = coord.y + gsap.utils.random(-4, 4)
            const endX = midX + gsap.utils.random(-3, 3)
            const endY = midY + gsap.utils.random(-3, 3)
            const scaleM = gsap.utils.random(0.7, 1.3)
            const maxAlpha = gsap.utils.random(0.25, 0.62)

            gsap.set(span, {
              position: 'absolute',
              left: '50%',
              top: '50%',
              xPercent: -50,
              yPercent: -50,
              x: `${initX}vw`,
              y: `${initY}vh`,
              z: gsap.utils.random(-1600, -1100),
              scale: 0.35 * scaleM,
              autoAlpha: 0,
              filter: 'blur(0.65rem)',
            })

            contactTl
              .to(
                span,
                {
                  x: `${midX}vw`,
                  y: `${midY}vh`,
                  z: 0,
                  scale: scaleM,
                  autoAlpha: maxAlpha,
                  filter: 'blur(0rem)',
                  duration: dur1,
                  ease: 'power1.inOut',
                },
                startTime
              )
              .to(
                span,
                {
                  x: `${endX}vw`,
                  y: `${endY}vh`,
                  z: gsap.utils.random(800, 1200),
                  scale: scaleM * gsap.utils.random(1.3, 1.65),
                  autoAlpha: 0,
                  filter: 'blur(0.5rem)',
                  duration: dur2,
                  ease: 'power1.in',
                },
                startTime + dur1
              )
          })
        }
      }

      // 2. Footer Curtain Parallax Reveal
      if (footerWrapRef.current && footerInnerRef.current) {
        const wrapEl = footerWrapRef.current
        const innerEl = footerInnerRef.current

        const mmFooter = gsap.matchMedia()
        mmFooter.add('(min-width: 768px)', () => {
          gsap.from(innerEl, {
            yPercent: -100,
            ease: 'linear',
            scrollTrigger: {
              trigger: wrapEl,
              start: 'clamp(top bottom)',
              end: 'clamp(top top)',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: checkTheme,
            },
          })
        })
      }
    },
    { scope: containerRef, dependencies: [language] }
  )

  // Subtle interactive mouse parallax in hero
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bgWrapRef.current) return
    const { clientX, clientY, currentTarget } = e
    const rect = currentTarget.getBoundingClientRect()
    const xPos = (clientX - rect.left) / rect.width - 0.5
    const yPos = (clientY - rect.top) / rect.height - 0.5

    gsap.to(bgWrapRef.current, {
      x: xPos * 12,
      y: yPos * 8,
      duration: 0.8,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (!bgWrapRef.current) return
    gsap.to(bgWrapRef.current, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full overflow-x-clip bg-[#e2e1e1] text-[#080912] font-sans selection:bg-[#080912] selection:text-white"
    >
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#080912] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase shadow-xl transition-all animate-bounce pointer-events-none">
          {copiedNotification}
        </div>
      )}

      {/* Persistent Fixed Header with ultra-subtle backdrop blur and compact padding */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full px-6 sm:px-10 py-3 sm:py-3.5 flex items-center justify-end pointer-events-none backdrop-blur-[3px] transition-all duration-300">
        {/* Brand Container: Absolutely positioned so it does NOT displace header buttons or overflow the flex row */}
        <div className="absolute top-3.5 sm:top-4 left-6 sm:left-10 pointer-events-none flex items-center">
          <button
            ref={brandRef}
            onClick={scrollToTop}
            aria-label="Alejandro HA - Scroll to top"
            className={`pointer-events-auto block origin-top-left text-left bg-transparent border-none p-0 cursor-pointer transition-opacity duration-300 ${isScrolled ? 'hover:opacity-75' : ''
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1376 165"
              className={`w-full h-auto block transition-colors duration-500 ${
                isBrandWhite ? 'text-white' : 'text-[#080912]'
              }`}
              fill="none"
            >
              {/* Letter A */}
              <path
                d="M107.404 138.328H90.0567L87.187 123.847L81.6411 110.559H24.0861L18.3789 123.847L15.5092 138.328H0L44.5931 33.7676L41.0462 26.5109H60.07L107.372 138.328H107.404ZM77.4494 100.755L52.8797 42.3143L28.1488 100.755H77.4817H77.4494Z"
                fill="currentColor"
              />
              {/* Letter L */}
              <path
                d="M202.652 124.847L200.62 138.328H125.88L128.233 123.008V41.8305L125.88 26.5109H143.549L141.356 41.8305V128.362H187.143L202.62 124.814L202.652 124.847Z"
                fill="currentColor"
              />
              {/* Letter E */}
              <path
                d="M308.217 125.169L306.186 138.296H224.223L226.576 122.976V41.8305L224.223 26.5109H305.541L307.572 39.6374L292.096 36.0897H239.571V76.1787H278.972L292.257 74.5016V87.3055L278.972 85.6284H239.571V128.717H292.773L308.25 125.169H308.217Z"
                fill="currentColor"
              />
              {/* Letter J */}
              <path
                d="M323.663 131.426V115.268L340.171 128.072C343.202 129.265 346.556 129.942 349.587 129.942C362.871 129.942 370.126 122.363 370.126 107.882V41.8305L367.772 26.5109H385.442L383.249 41.8305L383.088 105.979C383.088 127.04 371.319 139.811 350.586 139.811C341.171 139.811 333.4 137.296 323.663 131.394V131.426Z"
                fill="currentColor"
              />
              {/* Letter A */}
              <path
                d="M507 138.328H489.653L486.783 123.847L481.237 110.559H423.65L417.943 123.847L415.073 138.328H399.596L444.189 33.7676L440.643 26.5109H459.666L506.968 138.328H507ZM477.013 100.755L452.444 42.3143L427.713 100.755H477.046H477.013Z"
                fill="currentColor"
              />
              {/* Letter N */}
              <path
                d="M625.657 26.5109L623.303 41.8305V138.328H605.118L539.115 37.1218V123.008L541.308 138.328H525.476L527.83 123.008V41.8305L525.476 26.5109H546.338L611.986 127.362V41.8305L609.793 26.5109H625.625H625.657Z"
                fill="currentColor"
              />
              {/* Letter D */}
              <path
                d="M656.964 123.008V41.8305L654.611 26.5109H696.012C735.059 26.5109 754.76 44.1849 754.76 82.242C754.76 120.299 735.059 138.328 696.012 138.328H654.611L656.964 123.008ZM696.495 128.556C725.966 128.556 741.088 114.591 741.088 82.242C741.088 49.8935 726.095 36.2832 696.657 36.2832H669.894V128.556H696.495Z"
                fill="currentColor"
              />
              {/* Letter R */}
              <path
                d="M875.772 138.328H855.071L850.364 126.201L822.924 91.853H795.84V123.008L798.709 138.328H780.363L782.716 123.008V41.8305L780.363 26.5109H830.179C856.103 26.5109 868.742 38.1216 868.742 58.8272C868.742 76.1787 857.457 87.628 836.757 89.9824L875.804 138.296L875.772 138.328ZM826.116 81.9195C844.302 81.9195 855.587 73.8243 855.587 58.8595C855.587 43.8946 846.656 35.7995 828.47 35.7995H795.485V81.9195H826.116Z"
                fill="currentColor"
              />
              {/* Letter O */}
              <path
                d="M893.763 82.242C893.763 45.3782 916.14 23.4793 949.319 23.4793C982.498 23.4793 1004.87 45.3782 1004.87 82.242C1004.87 119.106 982.143 141.521 949.319 141.521C916.495 141.521 893.763 119.138 893.763 82.242ZM991.075 82.242C991.075 50.9255 973.728 33.5741 949.319 33.5741C924.911 33.5741 907.563 50.9255 907.563 82.242C907.563 113.558 924.749 131.232 949.158 131.232C973.566 131.232 991.075 113.72 991.075 82.242Z"
                fill="currentColor"
              />
              {/* Left Bracket [ */}
              <path
                d="M1079.17 156.679C1085.58 158.13 1091.16 156.679 1097.38 157.389C1098.09 159.549 1097.8 162.065 1098.29 164.807L1070.27 164.968L1070.33 0.0645027H1097.54C1098 2.77365 1098.22 5.09578 1097.29 7.09539L1079.23 7.48241V156.679H1079.17Z"
                fill="currentColor"
              />
              {/* Letter H */}
              <path
                d="M1120.86 123.169V41.8628L1118.5 26.5109H1136.2L1134.01 41.8628V76.1142H1200.43V41.8628L1198.24 26.5109H1215.94L1213.59 41.8628V123.169L1215.94 138.521H1198.24L1200.43 123.169V86.0477H1134.01V123.169L1136.2 138.521H1118.5L1120.86 123.169Z"
                fill="currentColor"
              />
              {/* Letter A */}
              <path
                d="M1342.08 138.521H1324.7L1321.83 124.008L1316.25 110.688H1258.57L1252.83 124.008L1249.96 138.521H1234.45L1279.14 33.7676L1275.59 26.5109H1294.65L1342.05 138.521H1342.08ZM1312.06 100.884L1287.43 42.3466L1262.63 100.884H1312.03H1312.06Z"
                fill="currentColor"
              />
              {/* Right Bracket ] */}
              <path
                d="M1349.5 157.518L1367.07 156.937V7.51466L1349.27 6.86963C1349.11 4.57975 1348.53 1.12881 1349.98 0.193511L1376.03 0L1375.9 164.839L1349.66 165C1348.75 162.71 1348.91 160.42 1349.53 157.55L1349.5 157.518Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Top-Right Pill Action Buttons with Authentic Scribble Animation */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <ScribbleButton
            variant="dark"
            size="sm"
            weight="normal"
            onClick={() => showNotification(language === 'en' ? 'Book a Call opened' : 'Reunión agendada')}
            className="nav-button-item shadow-sm"
          >
            {language === 'en' ? 'BOOK A CALL' : 'AGENDAR LLAMADA'}
          </ScribbleButton>

          <ScribbleButton
            variant="blue"
            size="sm"
            weight="normal"
            onClick={() => showNotification(language === 'en' ? 'Quote Request opened' : 'Cotización solicitada')}
            className="nav-button-item shadow-sm"
          >
            {language === 'en' ? 'GET A QUOTE' : 'COTIZAR AHORA'}
          </ScribbleButton>
        </div>
      </header>

      {/* Hero Section Container (100vh / 100svh) */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-screen min-h-screen flex flex-col justify-between p-6 sm:p-10 overflow-hidden"
      >
        {/* Full-Bleed Oversized Canvas for Window/Curtain Parallax */}
        <div
          ref={bgWrapRef}
          className="absolute top-0 left-0 w-full h-[135%] pointer-events-none z-0 overflow-hidden will-change-transform"
        >
          <img
            src="/aha-img__01-1600.avif"
            onError={(e) => {
              e.currentTarget.src = '/hero-reference.jpg'
            }}
            alt="Alejandro HA - Creative Web Developer"
            className="w-full h-full object-cover object-[center_bottom] sm:object-[center_32%] pointer-events-none select-none"
          />
        </div>

        {/* Bottom Bar Content in Hero */}
        <div className="relative z-30 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mt-auto">
          {/* Bottom Left: Partner Pill */}
          <div className="partner-wrap inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#080912] bg-[#e2e1e1]/80 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#080912] shadow-sm">
            <span>WEBFLOW PARTNER</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#080912]" />
            <span>SHOPIFY PARTNER</span>
          </div>

          {/* Bottom Right: Location & Language Switch */}
          <div className="locate-wrap flex items-center gap-3 sm:gap-4 self-end">
            <div className="text-right text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#080912] leading-tight">
              {language === 'en' ? (
                <>
                  BASED IN MEXICO,
                  <span className="block">WORKING GLOBALLY.</span>
                </>
              ) : (
                <>
                  EN MÉXICO,
                  <span className="block">TRABAJANDO GLOBALMENTE.</span>
                </>
              )}
            </div>

            {/* Language Switch Button with Tooltip and 3D Rotating Globe */}
            <div className="relative group cursor-pointer">
              {/* Tooltip */}
              <div className="absolute bottom-[calc(100%+0.6rem)] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="backdrop-blur-md bg-white/70 border border-white/80 rounded-lg px-2.5 py-1 shadow-sm whitespace-nowrap">
                  <span className="text-[10px] font-semibold text-[#080912]">
                    {language === 'en' ? 'Cambiar idioma' : 'Switch Language'}
                  </span>
                </div>
                {/* Tooltip Tip Arrow */}
                <div className="w-3 text-white/80 -mt-0.5">
                  <svg viewBox="0 0 124 30" fill="none" className="w-full h-auto">
                    <path
                      d="M103.284 3L121 3C122.657 3 124 1.65685 124 0L0 0C0 1.65685 1.34315 3 3 3L20.7157 3C26.0201 3 31.1071 5.10713 34.8579 8.85786L51.3934 25.3934C57.2513 31.2513 66.7487 31.2513 72.6066 25.3934L89.1421 8.85786C92.8929 5.10714 97.9799 3 103.284 3Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {/* Rotating 3D Globe */}
              <button
                onClick={() => setLanguage((prev) => (prev === 'en' ? 'es' : 'en'))}
                aria-label="Switch Language"
                className="rotating-globe cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
              >
                <div className="globe">
                  <div className="globe-wrap">
                    <div className="circle" />
                    <div className="circle" />
                    <div className="circle" />
                    <div className="circle-hor" />
                    <div className="circle-hor-middle" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Next Section: About / Creative Web Development */}
      <section
        id="about"
        className="relative z-20 w-full min-h-screen bg-[#e2e1e1] px-6 sm:px-12 md:px-16 lg:px-20 pt-24 sm:pt-32 md:pt-36 pb-28 sm:pb-36 flex flex-col justify-start overflow-x-clip"
      >
        <div className="w-full max-w-[1400px] mx-auto">
          {/* Top Left Header Wrap */}
          <div className="w-full max-w-[38rem] flex flex-col">
            <h1 className="about-header-item text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-extrabold uppercase tracking-tight leading-[1.0] text-[#080912]">
              {language === 'en' ? (
                <>
                  Creative Web
                  <span className="block mt-1 sm:mt-1.5">Development</span>
                </>
              ) : (
                <>
                  Desarrollo Web
                  <span className="block mt-1 sm:mt-1.5">Creativo</span>
                </>
              )}
            </h1>

            <p className="about-header-item text-sm sm:text-base md:text-lg text-[#080912]/80 mt-5 sm:mt-6 max-w-[24rem] sm:max-w-[28rem] font-medium leading-relaxed">
              {language === 'en'
                ? 'Modern, custom-built websites enhanced with animations that make an impact.'
                : 'Sitios modernos, funcionales y hechos a medida con animaciones que marcan la diferencia.'}
            </p>
          </div>

          {/* Right Content Wrap: Staggered down into the right column */}
          <div className="w-full lg:w-[50%] lg:ml-auto mt-16 sm:mt-24 lg:mt-28 flex flex-col items-start">
            {/* Dynamic Bracket Heading */}
            <h2
              ref={aboutHeadingRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.65rem] font-extrabold text-[#080912] flex items-center tracking-tight select-none"
            >
              <span
                ref={bracketLeftRef}
                className="inline-block will-change-transform mr-1.5 sm:mr-3 font-bold"
              >
                [
              </span>
              <span className="whitespace-nowrap">
                {language === 'en' ? 'About me' : 'Sobre mí'}
              </span>
              <span
                ref={bracketRightRef}
                className="inline-block will-change-transform ml-1.5 sm:ml-3 font-bold"
              >
                ]
              </span>
            </h2>

            {/* Bio Paragraphs */}
            <div className="about-bio-item space-y-6 sm:space-y-7 mt-8 sm:mt-10 text-base sm:text-lg md:text-[1.125rem] text-[#080912]/85 leading-relaxed font-normal">
              <p>
                {language === 'en'
                  ? "I'm Alejandro, a freelance web developer specializing in websites that not only look great but feel intuitive. I focus on Webflow, Shopify, and custom code to build digital experiences that reflect the unique identity of every brand."
                  : 'Soy Alejandro, desarrollador web freelance especializado en crear sitios que no solo se ven bien, sino que se sienten bien. Me enfoco en Webflow, Shopify y código personalizado para construir experiencias digitales que reflejan la identidad de cada marca.'}
              </p>
              <p>
                {language === 'en'
                  ? 'Every website I build is fully custom, never based on generic templates or one-size-fits-all solutions. Whether it’s an emerging startup or an established brand, I approach every project with the same commitment to craftsmanship, precision, and attention to detail.'
                  : 'Cada sitio que construyo es 100% a medida, nada de plantillas genéricas ni soluciones prefabricadas. Trabajo con clientes de todo el mundo, desde startups que están arrancando hasta marcas ya consolidadas, y le pongo la misma atención a cada detalle sin importar el tamaño del proyecto.'}
              </p>
            </div>

            {/* Interactive Call to Action Scribble Button */}
            <div className="about-bio-item mt-10 sm:mt-12">
              <ScribbleButton
                variant="dark"
                size="lg"
                onClick={() =>
                  showNotification(language === 'en' ? 'Opening contact channel...' : 'Abriendo canal de contacto...')
                }
                icon={
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                }
                className="shadow-lg"
              >
                {language === 'en' ? "LET'S TALK" : 'COTIZA AQUÍ'}
              </ScribbleButton>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          4. Transition Section: Anchor & Signature Liquid Ink Screen-Fill
          ========================================================================== */}
      <div id="services" className="anchor" />

      <div
        ref={scrollDrawTransitionRef}
        data-theme-section="light"
        data-scroll-draw-transition=""
        className="scroll-draw-transition"
      >
        <section
          ref={scrollDrawSectionRef}
          data-scroll-draw-section=""
          className="services-header__w"
        >
          <p className="services-big-txt text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.25rem] font-bold uppercase text-[#080912] tracking-tight leading-[0.95]">
            {language === 'en' ? 'Small details.' : 'Pequeños detalles.'}
            <span className="services-big-txt__span text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.75rem] font-bold text-[#080912] tracking-tight leading-[0.92] mt-1 sm:mt-2">
              {language === 'en' ? 'Big impact.' : 'Gran impacto.'}
            </span>
          </p>

          <h2
            ref={servicesHeadingRef}
            data-bracket-heading=""
            style={{ fontFamily: 'var(--body-font)' }}
            className="heading-h2 txt-color-blue text-3xl sm:text-4xl md:text-5xl lg:text-[3.85rem] xl:text-[4.35rem] font-bold mt-6 sm:mt-8 tracking-tight text-[#2a4093] flex items-center justify-center select-none"
          >
            <span
              ref={servicesBracketLeftRef}
              data-bracket-left=""
              className="heading-bracket is--left inline-block will-change-transform font-bold mr-2 sm:mr-3"
            >
              [
            </span>
            <span className="services-title-txt font-bold">
              {language === 'en' ? 'Services' : 'Servicios'}
            </span>
            <span
              ref={servicesBracketRightRef}
              data-bracket-right=""
              className="heading-bracket is--right inline-block will-change-transform font-bold ml-2 sm:ml-3"
            >
              ]
            </span>
          </h2>
        </section>

        {/* Liquid Ink Scribble SVG Overlay (Pin & Scrub screen-fill into Services) */}
        <div
          ref={scrollDrawOverlayRef}
          data-scroll-draw-overlay=""
          className="scroll-draw-transition__overlay"
        >
          <div className="scroll-draw-transition__shape">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 3222 3114"
              fill="none"
              preserveAspectRatio="none"
              className="transition__svg"
            >
              <path
                ref={scrollDrawPathRef}
                d={SCROLL_DRAW_PATH}
                stroke="currentColor"
                strokeWidth="0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          5. Services Showcase Section (Authentic Scroll-Pinned Showcase)
          ========================================================================== */}
      <section
        id="services-showcase"
        ref={servicesRef}
        data-theme-section="light"
        data-services=""
        className="services"
      >
        <div data-services-wrapper="" className="services-wrapper">
          <div data-services-sticky="" className="services-sticky">
            <div ref={servicesListRef} data-services-list="" className="services-list">
              {servicesData.map((service, index) => (
                <div key={index} data-services-item="" className="service-item">
                  <div data-services-row="" className="service-row">
                    <div className="service-number">{service.number}</div>
                    <h3 className="service-title">{service.title[language]}</h3>
                  </div>
                  <div data-services-visual="" className="service-visual">
                    <div className="service-description">
                      <p dangerouslySetInnerHTML={{ __html: service.description[language] }} />
                    </div>
                    <div data-services-image-wrap="" className="service-image-wrap">
                      <img
                        src={service.image}
                        alt={service.imageAlt}
                        className="service-image"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          6. Portfolio Showcase Section (Authentic 3D Orbit Carousel)
          ========================================================================== */}
      <section
        id="portfolio"
        ref={portfolioRef}
        data-theme-section="dark"
        className="portfolio"
      >
        <div className="portfolio-header-w">
          <h2
            ref={portfolioHeadingRef}
            data-bracket-heading=""
            style={{ fontFamily: 'var(--body-font)' }}
            className="heading-h2 text-3xl sm:text-4xl md:text-5xl lg:text-[3.85rem] font-bold text-[#080912] flex items-center justify-center tracking-tight select-none"
          >
            <span
              ref={portfolioBracketLeftRef}
              data-bracket-left=""
              className="heading-bracket is--left inline-block will-change-transform mr-2 sm:mr-3 font-bold"
            >
              [
            </span>
            <span>{language === 'en' ? 'Portfolio' : 'Proyectos'}</span>
            <span
              ref={portfolioBracketRightRef}
              data-bracket-right=""
              className="heading-bracket is--right inline-block will-change-transform ml-2 sm:ml-3 font-bold"
            >
              ]
            </span>
          </h2>
          <p className="portfolio-header__p">
            {language === 'en' ? (
              <>
                Crafting digital experiences that
                <span className="block">bring ideas to life.</span>
              </>
            ) : (
              <>
                Diseñando experiencias digitales que
                <span className="block">dan vida a las ideas.</span>
              </>
            )}
          </p>
        </div>

        <div
          ref={portfolioOrbitRef}
          data-portfolio-orbit-init=""
          className="portfolio-orbit"
        >
          <div className="portfolio-orbit__content">
            {/* Orbit Counter & Details */}
            <div className="portfolio-orbit__info">
              <div className="portfolio-orbit__count">
                <div className="portfolio-orbit__count-col overflow-hidden">
                  <p ref={currentCountRef} className="portfolio-orbit__count-txt">
                    {String(activeOrbitIndex + 1).padStart(2, '0')}
                  </p>
                </div>
                <div className="portfolio-orbit__count-divider" />
                <div className="portfolio-orbit__count-col">
                  <p className="portfolio-orbit__count-txt">
                    {String(portfolioProjects.length).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="portfolio-orbit__info-bottom">
                <div className="portfolio-orbit__description relative">
                  {portfolioProjects.map((project, index) => {
                    const isActive = index === activeOrbitIndex
                    return (
                      <div
                        key={index}
                        className={`portfolio-orbit__content-item ${
                          isActive ? 'active' : ''
                        }`}
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                          pointerEvents: isActive ? 'auto' : 'none',
                          position: isActive ? 'relative' : 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transition: 'opacity 0.4s ease, transform 0.4s ease',
                        }}
                      >
                        <h3 className="portfolio-orbit__heading font-bold uppercase tracking-tight text-[#080912]">
                          {project.title}
                        </h3>
                        <p className="portfolio-orbit__paragraph text-[#080912] leading-relaxed">
                          {project.description[language]}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Interactive Prev/Next Navigation with scale(1.4) corner borders on hover */}
                <div className="portfolio-orbit__overlay-nav">
                  <button
                    onClick={() => handleOrbitStep(-1)}
                    aria-label={language === 'en' ? 'Previous project' : 'Proyecto anterior'}
                    className="portfolio-orbit__btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 17 12"
                      fill="none"
                      className="portfolio-orbit__btn-arrow"
                    >
                      <path
                        d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="portfolio-orbit__btn-overlay">
                      <div className="portfolio-orbit__btn-overlay-corner" />
                      <div className="portfolio-orbit__btn-overlay-corner top-right" />
                      <div className="portfolio-orbit__btn-overlay-corner bottom-left" />
                      <div className="portfolio-orbit__btn-overlay-corner bottom-right" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleOrbitStep(1)}
                    aria-label={language === 'en' ? 'Next project' : 'Proyecto siguiente'}
                    className="portfolio-orbit__btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 17 12"
                      fill="none"
                      className="portfolio-orbit__btn-arrow next"
                    >
                      <path
                        d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="portfolio-orbit__btn-overlay">
                      <div className="portfolio-orbit__btn-overlay-corner" />
                      <div className="portfolio-orbit__btn-overlay-corner top-right" />
                      <div className="portfolio-orbit__btn-overlay-corner bottom-left" />
                      <div className="portfolio-orbit__btn-overlay-corner bottom-right" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Orbit Carousel Tiles */}
            <div className="portfolio-orbit__collection">
              <div ref={portfolioListRef} className="portfolio-orbit__list">
                {portfolioProjects.map((project, index) => {
                  const isActive = index === activeOrbitIndex
                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        orbitItemsRef.current[index] = el
                      }}
                      className="portfolio-orbit__item"
                      data-orbit-tiles-item-status={isActive ? 'active' : 'not-active'}
                    >
                      <a
                        ref={(el) => {
                          orbitCardsRef.current[index] = el
                        }}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleCardClick(e, index)}
                        className="portfolio-orbit__card"
                        aria-label={project.title}
                      >
                        <div className="portfolio-orbit__image-mask">
                          <img
                            src={project.placeholder}
                            alt={project.title}
                            className="portfolio-orbit__placeholder"
                            draggable="false"
                            loading="lazy"
                          />
                          <video
                            ref={(el) => {
                              orbitVideosRef.current[index] = el
                            }}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="portfolio-orbit__video"
                          >
                            <source src={project.video} type="video/mp4" />
                          </video>
                        </div>
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Authentic Call to Action */}
        <div className="portfolio-cta">
          <ScribbleButton
            variant="dark"
            size="lg"
            weight="medium"
            onClick={() =>
              showNotification(
                language === 'en' ? 'Quote Request opened' : 'Cotización solicitada'
              )
            }
            className="shadow-sm"
          >
            {language === 'en' ? 'QUOTE YOUR PROJECT' : 'COTIZA TU PROYECTO'}
          </ScribbleButton>
        </div>
      </section>

      {/* ==========================================================================
          7. Certifications & Partnerships Section (Authentic alejandroha.com)
          ========================================================================== */}
      <section
        id="certifications"
        ref={certificationRef}
        data-theme-section="dark"
        className="certification"
      >
        <div className="certification-header-w">
          <h2
            ref={certifiedHeadingRef}
            data-split-random=""
            className="certified-big-txt select-none"
          >
            {(language === 'en'
              ? 'Certifications & Partnerships'
              : 'Certificaciones & Partnerships'
            )
              .split('')
              .map((char, index) => (
                <span
                  key={index}
                  className="split-char"
                  style={char === ' ' ? { width: '0.28em' } : undefined}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
          </h2>
        </div>

        <div className="certification-content-w">
          <p>
            {language === 'en'
              ? 'I am an Official Webflow and Shopify Partner in Mexico, ensuring that every project meets the highest standards of quality, performance, and support.'
              : 'Soy Partner Oficial de Webflow y Shopify en México, lo que garantiza que cada proyecto cumple con los más altos estándares de calidad, rendimiento y soporte.'}
          </p>
        </div>

        <div className="certifications-logos">
          {/* Webflow Partner / Expert SVG */}
          <div className="certifications-logo" aria-label="Webflow Certified Partner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 400 45"
              fill="none"
              className="w-full h-auto"
            >
              <g clipPath="url(#clip0_webflow_cert)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M71.9788 0L49.0123 45H27.4358L37.0479 26.3527H36.6202C28.6868 36.673 16.8614 43.4675 0 45V26.6099C0 26.6099 10.7883 25.9669 17.1287 19.2903H0V0H19.2457V15.8716H19.6734L27.5427 0H42.0946V15.7645H42.5223L50.691 0H71.9788Z"
                  fill="currentColor"
                />
                <path
                  d="M98.6448 37.0052C95.9718 37.0052 93.5874 36.3944 91.4918 35.1834C89.3961 33.9509 87.7603 32.2255 86.5841 30.0071C85.408 27.7887 84.8306 25.2488 84.8413 22.3767C84.8306 19.4939 85.408 16.9433 86.5841 14.7249C87.7603 12.4958 89.3961 10.7704 91.4918 9.54868C93.5874 8.31624 95.9718 7.70538 98.6448 7.70538C100.965 7.70538 103.061 8.14477 104.932 9.03427C106.824 9.90233 108.375 11.1669 109.572 12.8173C110.77 14.457 111.539 16.3753 111.86 18.5615H106.257C105.979 17.3184 105.466 16.236 104.739 15.3143C104.023 14.382 103.135 13.6639 102.088 13.1603C101.05 12.6566 99.9171 12.4101 98.6768 12.4101C97.041 12.4101 95.5868 12.8173 94.3252 13.6425C93.0635 14.4463 92.0692 15.6144 91.3528 17.1255C90.6471 18.6258 90.2943 20.3727 90.2943 22.3767C90.2943 24.3808 90.6471 26.1062 91.3528 27.6065C92.0692 29.1069 93.0635 30.2643 94.3252 31.0895C95.5868 31.8933 97.041 32.3005 98.6768 32.3005C99.9706 32.3005 101.147 32.054 102.205 31.5718C103.264 31.0681 104.14 30.3715 104.835 29.4713C105.541 28.5711 106.001 27.5208 106.236 26.2991H111.839C111.539 28.3889 110.812 30.2429 109.636 31.8611C108.46 33.4794 106.92 34.744 105.028 35.6442C103.135 36.5551 101.008 37.0052 98.6448 37.0052ZM125.546 37.0481C123.408 37.0481 121.526 36.5873 119.89 35.6656C118.265 34.744 117.003 33.4365 116.094 31.7432C115.185 30.05 114.736 28.0995 114.736 25.8811C114.736 23.6628 115.196 21.8409 116.116 20.1476C117.035 18.4437 118.307 17.1148 119.911 16.1717C121.536 15.2072 123.365 14.7249 125.396 14.7249C127.556 14.7249 129.47 15.2072 131.138 16.1717C132.806 17.1362 134.067 18.5508 134.934 20.437C135.8 22.3124 136.142 24.5415 135.949 27.1457H116.917V23.7378L132.089 23.6842L130.71 24.2843C130.689 23.2126 130.454 22.2481 130.015 21.4229C129.577 20.587 128.967 19.944 128.176 19.4832C127.396 19.0224 126.498 18.7866 125.492 18.7866C124.434 18.7866 123.482 19.0438 122.638 19.5582C121.793 20.0726 121.13 20.7906 120.638 21.7123C120.168 22.6339 119.933 23.6735 119.943 24.8309V26.7385C119.933 27.9816 120.157 29.0748 120.638 30.0286C121.119 30.9609 121.793 31.7004 122.648 32.2255C123.504 32.7399 124.477 32.9971 125.567 32.9971C126.359 32.9864 127.086 32.8471 127.749 32.5899C128.422 32.322 128.999 31.9469 129.459 31.4753C129.919 30.9931 130.25 30.4358 130.454 29.8035H135.714C135.415 31.2288 134.795 32.4934 133.854 33.5865C132.923 34.6904 131.726 35.5477 130.283 36.1586C128.839 36.7587 127.257 37.0588 125.546 37.0588V37.0481ZM139.659 15.1321H144.535V19.4939L143.829 19.5904C144.054 18.6044 144.471 17.7471 145.059 17.0183C145.658 16.2789 146.374 15.7109 147.208 15.3251C148.053 14.9285 148.962 14.7249 149.934 14.7249C150.106 14.7249 150.266 14.7249 150.416 14.7463C150.587 14.7571 150.726 14.7785 150.854 14.7999V19.6118C150.736 19.5689 150.555 19.5368 150.298 19.5153C150.041 19.4725 149.795 19.4618 149.55 19.4618C148.577 19.451 147.732 19.6332 146.994 20.019C146.267 20.3941 145.7 20.9514 145.283 21.6909C144.888 22.4196 144.685 23.2984 144.685 24.3272V36.5765H139.659V15.1321ZM157.43 9.91305H162.498V36.5658H157.43V9.91305ZM153.548 15.1321H166.379V19.3224H153.548V15.1321ZM169.447 15.1321H174.526V36.5765H169.447V15.1321ZM169.341 6.93377H174.772V12.2172H169.341V6.93377ZM181.112 13.9211C181.112 12.4851 181.444 11.2205 182.096 10.1381C182.748 9.04499 183.657 8.20907 184.844 7.61965C186.02 7.0195 187.399 6.71943 188.971 6.71943C189.345 6.70872 189.688 6.71943 190.008 6.77302C190.329 6.81588 190.596 6.85875 190.81 6.92305V11.2527L190.714 11.1991C190.543 11.1455 190.35 11.1133 190.115 11.0812C189.901 11.0383 189.688 11.0276 189.484 11.0276C188.768 11.0276 188.169 11.1562 187.677 11.4134C187.196 11.6706 186.822 12.0457 186.587 12.5494C186.341 13.0531 186.223 13.6425 186.223 14.3391V36.5873H181.123V13.9211H181.112ZM177.627 15.1321H190.521V19.301H177.627V15.1321ZM194.082 15.1321H199.161V36.5765H194.082V15.1321ZM193.964 6.93377H199.396V12.2172H193.964V6.93377ZM213.787 37.0481C211.649 37.0481 209.767 36.5873 208.131 35.6656C206.506 34.744 205.244 33.4365 204.336 31.7432C203.427 30.05 202.978 28.0995 202.978 25.8811C202.978 23.6628 203.437 21.8409 204.357 20.1476C205.277 18.4437 206.549 17.1148 208.153 16.1717C209.778 15.2072 211.606 14.7249 213.638 14.7249C215.797 14.7249 217.711 15.2072 219.379 16.1717C221.047 17.1362 222.309 18.5508 223.175 20.437C224.041 22.3124 224.383 24.5415 224.191 27.1457H205.159V23.7378L220.331 23.6842L218.952 24.2843C218.93 23.2126 218.695 22.2481 218.257 21.4229C217.818 20.587 217.209 19.944 216.418 19.4832C215.637 19.0224 214.739 18.7866 213.734 18.7866C212.675 18.7866 211.724 19.0438 210.879 19.5582C210.034 20.0726 209.372 20.7906 208.88 21.7123C208.409 22.6339 208.174 23.6735 208.185 24.8309V26.7385C208.174 27.9816 208.399 29.0748 208.88 30.0286C209.361 30.9609 210.034 31.7004 210.89 32.2255C211.745 32.7399 212.718 32.9971 213.809 32.9971C214.6 32.9864 215.327 32.8471 216.001 32.5899C216.674 32.322 217.252 31.9469 217.711 31.4753C218.171 30.9931 218.503 30.4358 218.706 29.8035H223.966C223.667 31.2288 223.047 32.4934 222.106 33.5865C221.176 34.6904 219.978 35.5477 218.535 36.1586C217.091 36.7587 215.509 37.0588 213.798 37.0588L213.787 37.0481ZM236.593 36.9731C234.744 36.9731 233.087 36.5015 231.622 35.5692C230.178 34.6368 229.045 33.3293 228.222 31.6468C227.398 29.9535 226.992 28.0138 226.992 25.8168C226.992 23.6199 227.409 21.648 228.243 19.9762C229.077 18.2829 230.221 16.9862 231.675 16.0752C233.129 15.1643 234.797 14.7142 236.679 14.7249C237.855 14.7142 238.978 14.9392 240.058 15.4001C241.148 15.8609 242.057 16.4932 242.784 17.3077C243.522 18.1114 244.003 19.0009 244.206 19.9762L243.287 19.9547V6.85875H248.408V36.5658H243.34V31.7432L244.302 31.6682C244.024 32.6863 243.49 33.5865 242.709 34.401C241.94 35.1941 241.02 35.8264 239.929 36.2872C238.839 36.748 237.727 36.9838 236.593 36.9838V36.9731ZM237.748 32.5899C238.807 32.5899 239.769 32.3005 240.624 31.7218C241.49 31.1324 242.175 30.3286 242.656 29.2998C243.158 28.271 243.404 27.1029 243.404 25.7954C243.415 24.4772 243.18 23.2984 242.699 22.2803C242.228 21.2407 241.555 20.4477 240.689 19.9011C239.833 19.3331 238.85 19.0545 237.748 19.0545C236.647 19.0545 235.685 19.3331 234.872 19.9011C234.059 20.4691 233.418 21.2622 232.958 22.2803C232.509 23.3091 232.285 24.4772 232.285 25.7954C232.285 27.1136 232.509 28.3031 232.958 29.332C233.418 30.3393 234.059 31.1431 234.872 31.7111C235.706 32.2898 236.658 32.5792 237.748 32.5792V32.5899ZM262.607 8.14477H273.674C275.63 8.14477 277.352 8.5413 278.838 9.33434C280.335 10.1274 281.479 11.2419 282.291 12.6566C283.115 14.0819 283.521 15.6894 283.521 17.5006C283.521 19.3117 283.115 20.9407 282.291 22.366C281.489 23.7806 280.335 24.8845 278.838 25.6882C277.341 26.4813 275.609 26.8778 273.641 26.8778H266.082V22.3982H272.925C273.973 22.3982 274.871 22.1945 275.63 21.7873C276.4 21.3801 276.977 20.8121 277.373 20.0726C277.779 19.3439 277.993 18.4972 278.004 17.5542C278.004 16.5896 277.801 15.743 277.394 15.0143C276.999 14.2748 276.411 13.6961 275.63 13.2996C274.86 12.8923 273.952 12.6887 272.904 12.6887H267.878V36.5551H262.607V8.14477ZM295.336 36.9731C293.475 36.9731 291.829 36.5015 290.364 35.5692C288.91 34.6261 287.766 33.3079 286.932 31.6254C286.098 29.9321 285.691 27.9924 285.702 25.7954C285.702 23.5877 286.119 21.648 286.953 19.9654C287.798 18.2829 288.952 16.9862 290.428 16.0859C291.903 15.1643 293.571 14.7035 295.432 14.7249C296.672 14.7142 297.827 14.9392 298.885 15.4215C299.944 15.8823 300.821 16.5146 301.516 17.3077C302.221 18.1007 302.67 18.9688 302.873 19.9011L301.954 19.8583V15.1321H307.054V36.5765H302.007V32.3863L302.948 31.829C302.638 32.7828 302.114 33.6401 301.377 34.4225C300.639 35.2048 299.73 35.8264 298.671 36.2872C297.624 36.748 296.512 36.9838 295.336 36.9838V36.9731ZM296.405 32.6113C297.506 32.6113 298.49 32.3327 299.356 31.7647C300.222 31.186 300.895 30.3822 301.366 29.3641C301.847 28.3246 302.093 27.135 302.093 25.8061C302.093 24.4772 301.868 23.2984 301.387 22.2696C300.906 21.2407 300.222 20.4477 299.356 19.8904C298.5 19.3224 297.517 19.0438 296.405 19.0438C295.293 19.0438 294.363 19.3224 293.55 19.8904C292.727 20.4584 292.096 21.2515 291.647 22.291C291.198 23.3198 290.973 24.4879 290.973 25.8061C290.973 27.1243 291.198 28.3139 291.647 29.3427C292.096 30.3715 292.727 31.1645 293.55 31.7432C294.384 32.322 295.336 32.6113 296.405 32.6113ZM311.737 15.1321H316.613V19.4939L315.907 19.5904C316.142 18.6044 316.549 17.7471 317.137 17.0183C317.735 16.2789 318.452 15.7109 319.286 15.3251C320.13 14.9285 321.039 14.7249 322.012 14.7249C322.173 14.7249 322.333 14.7249 322.493 14.7463C322.654 14.7571 322.803 14.7785 322.932 14.7999V19.6118C322.814 19.5689 322.632 19.5368 322.376 19.5153C322.119 19.4725 321.873 19.4618 321.627 19.4618C320.654 19.451 319.81 19.6332 319.072 20.019C318.345 20.3941 317.778 20.9514 317.361 21.6909C316.966 22.4196 316.773 23.2984 316.773 24.3272V36.5765H311.748V15.1321H311.737ZM329.497 9.91305H334.554V36.5658H329.497V9.91305ZM325.626 15.1321H338.457V19.3224H325.626V15.1321ZM346.55 36.5658H341.429V15.1321H346.433V19.5582L345.588 19.8904C345.834 18.883 346.294 17.9721 346.989 17.1791C347.684 16.386 348.529 15.7752 349.544 15.3572C350.549 14.9178 351.629 14.7142 352.773 14.7249C354.281 14.7249 355.607 15.0571 356.74 15.7109C357.873 16.3539 358.75 17.2862 359.37 18.4972C360.001 19.719 360.311 21.1443 360.311 22.784V36.5873H355.19V23.8021C355.19 22.8376 355.029 22.0124 354.708 21.3265C354.388 20.6299 353.928 20.1048 353.329 19.7511C352.73 19.3975 352.003 19.2153 351.159 19.2153C350.314 19.2153 349.512 19.4296 348.817 19.8476C348.122 20.2655 347.577 20.8764 347.171 21.6587C346.764 22.4303 346.561 23.3091 346.561 24.295V36.598L346.55 36.5658ZM374.692 37.0481C372.554 37.0481 370.672 36.5873 369.036 35.6656C367.411 34.744 366.149 33.4365 365.24 31.7432C364.331 30.05 363.882 28.0995 363.882 25.8811C363.882 23.6628 364.342 21.8409 365.262 20.1476C366.181 18.4437 367.453 17.1148 369.057 16.1717C370.682 15.2072 372.511 14.7249 374.542 14.7249C376.702 14.7249 378.616 15.2072 380.273 16.1717C381.941 17.1362 383.203 18.5508 384.069 20.437C384.935 22.3124 385.277 24.5415 385.085 27.1457H366.053V23.7378L381.225 23.6842L379.846 24.2843C379.824 23.2126 379.589 22.2481 379.151 21.4229C378.712 20.587 378.103 19.944 377.312 19.4832C376.531 19.0224 375.633 18.7866 374.628 18.7866C373.559 18.7866 372.618 19.0438 371.773 19.5582C370.928 20.0726 370.265 20.7906 369.774 21.7123C369.303 22.6339 369.068 23.6735 369.079 24.8309V26.7385C369.068 27.9816 369.292 29.0748 369.774 30.0286C370.255 30.9609 370.928 31.7004 371.784 32.2255C372.639 32.7399 373.612 32.9971 374.703 32.9971C375.494 32.9864 376.221 32.8471 376.884 32.5899C377.568 32.322 378.135 31.9469 378.595 31.4753C379.054 30.9931 379.386 30.4358 379.589 29.8035H384.849C384.55 31.2288 383.93 32.4934 382.989 33.5865C382.059 34.6904 380.872 35.5477 379.418 36.1586C377.974 36.7587 376.392 37.0588 374.681 37.0588L374.692 37.0481ZM388.816 15.1321H393.692V19.4939L392.986 19.5904C393.211 18.6044 393.628 17.7471 394.216 17.0183C394.814 16.2789 395.531 15.7109 396.365 15.3251C397.209 14.9285 398.118 14.7249 399.091 14.7249C399.252 14.7249 399.412 14.7249 399.572 14.7463C399.743 14.7571 399.882 14.7785 400.021 14.7999V19.6118C399.904 19.5689 399.722 19.5368 399.465 19.5153C399.209 19.4725 398.963 19.4618 398.717 19.4618C397.744 19.451 396.889 19.6332 396.162 20.019C395.434 20.3941 394.857 20.9514 394.451 21.6909C394.055 22.4196 393.852 23.2984 393.852 24.3272V36.5765H388.827V15.1321H388.816Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_webflow_cert">
                  <rect width="400" height="45" fill="currentColor" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Shopify Partner SVG */}
          <div className="certifications-logo" aria-label="Shopify Partner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 400 66"
              fill="none"
              className="w-full h-auto"
            >
              <g clipPath="url(#clip0_shopify_cert)">
                <path
                  d="M57.5034 60.2717C50.2073 60.787 43.5625 64.6259 36.9076 64.04C24.4117 62.9489 12.6587 59.4433 0 57.6855L5.19983 18.0026C7.96764 16.8105 10.6235 16.6085 13.0759 15.1537C14.3784 10.0923 16.5051 5.33403 20.321 2.14163C23.6689 -0.666884 26.9658 -0.444627 30.4968 1.33342C33.3053 2.74778 36.1647 3.68732 36.9381 7.54649L41.0084 7.74855C43.013 10.9005 45.8928 12.4058 50.1361 11.6986L57.5034 60.2818V60.2717ZM23.0889 53.6141C27.0371 51.5532 28.0343 47.2697 27.7595 43.5318C27.2304 36.359 18.6522 35.6316 19.1712 31.7421C19.6901 27.8526 25.2767 29.7216 27.6273 29.8125C29.347 28.2466 29.52 25.5189 30.2831 22.8418C24.6254 20.8819 17.9094 22.1043 14.3682 26.8121C10.2775 32.2472 11.7327 38.8644 17.3701 42.1781C18.3673 42.764 18.9168 44.1481 19.1 44.9563C19.3238 45.9463 18.9677 47.1889 17.7873 47.694C15.3756 48.7245 13.3812 46.3302 11.1221 46.0271C9.63647 45.8251 8.35432 50.2702 9.44313 51.3512C12.8825 54.786 18.6319 55.9377 23.0787 53.6141H23.0889Z"
                  fill="currentColor"
                />
                <path
                  d="M150.378 64.4644L142.186 64.6967L149.493 25.6605C151.752 25.3372 154.245 24.8927 156.27 25.7312C156.789 25.9433 156.504 27.4991 156.89 27.5193C157.399 27.5496 158.172 27.3173 158.783 26.8526C162.629 23.943 169.213 23.943 171.462 28.8933C174.464 35.5205 172.337 43.4612 167.931 49.0378C164.268 53.6748 158.691 54.6851 152.728 53.5334L150.388 64.4644H150.378ZM159.058 47.2395C164.573 43.2793 166.456 32.1968 161.459 31.6816C155.628 31.0855 153.085 46.2394 154.926 47.3405C155.873 47.8962 157.633 48.27 159.058 47.2395Z"
                  fill="currentColor"
                />
                <path
                  d="M104.149 53.3213L107.314 34.9347C107.517 33.7729 107.059 32.5404 106.459 32.0757C103.406 29.7016 99.7736 35.0458 99.0104 39.0161C98.0742 43.8249 96.9142 48.1993 96.3545 53.7153C94.0141 53.5234 91.4702 52.9476 87.9799 53.8366L95.5405 13.2445L103.681 13.5274L101.605 27.3679C105.503 25.4585 109.095 23.7714 112.748 25.7414C119.403 29.3278 112.687 46.2193 112.137 53.2809C109.43 53.6345 107.059 53.5234 104.149 53.3415V53.3213Z"
                  fill="currentColor"
                />
                <path
                  d="M223.674 47.1487C220.184 54.3518 214.333 64.3735 206.039 66C204.991 63.9189 203.974 61.7368 203.943 59.3728C206.395 57.5341 212.216 55.6853 212.135 51.7655C211.962 42.8349 208.644 34.4801 208.034 25.7616C210.659 25.4383 213.569 25.4282 216.225 25.7818L218.413 42.6732L225.292 25.8323C228.009 25.1655 230.573 25.8323 234.125 25.5797L223.664 47.1487H223.674Z"
                  fill="currentColor"
                />
                <path
                  d="M141.443 46.8758C137.302 53.7254 128.164 56.2813 121.621 51.8968C117.988 49.4621 117.418 44.8553 117.764 40.8446C118.477 32.6919 123.9 25.812 132.041 24.9331C138.208 24.2663 143.407 27.6002 144.201 33.6617C144.791 38.1472 143.998 42.6429 141.433 46.8758H141.443ZM135.928 34.2679C135.745 32.6211 134.361 31.4796 133.099 31.2169C131.838 30.9542 130.24 31.5705 129.253 32.8535C125.651 37.5108 124.277 46.8051 128.876 47.6335C134.025 48.563 136.518 39.4303 135.928 34.2679Z"
                  fill="currentColor"
                />
                <path
                  d="M199.842 32.0958L195.803 53.2809C193.086 53.5537 190.664 53.5537 187.703 53.2809L191.58 32.1766C190.318 31.328 189.087 31.8736 187.774 31.8938L189.524 25.5797C190.074 25.1453 191.803 25.5898 192.465 25.2362C193.167 24.8523 193.411 23.8319 193.594 22.8116C195.009 15.1336 202.183 10.9209 209.754 13.3253C209.55 15.1336 209.713 18.023 208.054 19.2656C206.803 20.0031 204.34 18.9827 203.455 20.1647C202.366 21.5993 200.392 23.8925 201.878 25.1251C202.936 26.004 204.951 24.822 206.365 25.6706C206.294 27.5598 205.877 29.3479 205.388 31.3381L199.832 32.1059L199.842 32.0958Z"
                  fill="currentColor"
                />
                <path
                  d="M82.0271 52.2505C76.9392 54.7761 70.9456 54.5538 66.3767 51.9676C67.1501 49.6844 68.015 48.0882 67.842 45.896C70.7523 47.4012 74.0391 48.8257 77.1732 47.28C78.3027 46.7244 78.3333 45.0777 77.9669 44.421C76.2981 41.4104 70.2028 40.7234 69.8161 35.0054C69.5923 31.6615 71.3018 28.166 74.6496 26.5092C78.8624 24.428 83.818 24.4886 88.102 26.1253C87.756 27.9538 87.6645 30.8937 86.1279 31.4594C85.1002 31.8332 78.8217 29.3682 78.0178 33.1263C77.336 36.3288 86.1991 37.2684 86.5858 43.4814C86.7995 46.8759 85.5479 50.5027 82.0271 52.2505Z"
                  fill="currentColor"
                />
                <path
                  d="M243.334 52.7454C241.695 56.1399 242.703 66.3435 238.348 64.7776L245.247 26.9536C245.389 26.1858 245.359 25.5696 245.939 25.4079C246.315 25.2968 247.211 25.216 247.76 25.7716C248.096 26.1151 247.689 26.5697 247.74 27.6507C247.455 28.6912 247.862 29.4994 248.829 28.762C251.729 25.8625 255.687 23.9127 259.747 25.5494C266.392 28.2265 264.947 42.4004 257.193 50.0582C253.438 53.7658 248.564 54.281 243.334 52.7656V52.7454ZM255.361 47.8457C261.599 41.2285 263.461 29.3075 257.62 27.4183C251.973 25.5898 247.027 33.4091 245.806 39.0666C245.053 42.5722 244.249 45.8454 243.965 49.5025C247.689 51.8059 252.237 51.1593 255.361 47.8457Z"
                  fill="currentColor"
                />
                <path
                  d="M281.961 53.594C282.46 51.7958 283.09 49.8864 282.195 47.9164C279.987 51.0381 277.697 52.9879 274.278 53.5233C270.605 54.0991 267.125 52.0483 266.423 48.1892C265.069 40.6931 268.051 32.8737 274.064 28.0548C278.318 24.6502 283.864 24.0845 289.033 25.6099L285.655 44.138C285.034 47.5729 284.647 50.8057 285.36 53.8668C283.966 53.2101 283.497 53.3819 281.941 53.6041L281.961 53.594ZM285.797 27.5193C282.531 26.5899 279.407 27.196 276.761 29.0448C270.941 33.1363 267.898 40.1879 269.139 47.2092C269.669 50.1794 273.088 51.7756 275.672 50.24C283.66 45.5019 284.546 36.0661 285.787 27.5092L285.797 27.5193Z"
                  fill="currentColor"
                />
                <path
                  d="M181.088 53.2202C178.29 53.6445 175.868 53.5031 172.866 53.2809L178.117 25.9029C180.692 25.2564 183.286 25.4988 186.227 25.7514L181.099 53.2202H181.088Z"
                  fill="currentColor"
                />
                <path
                  d="M353.395 49.3813C358.371 53.4122 363.174 47.8154 364.191 49.9975C365.341 52.4524 357.689 54.0789 353.405 52.5838C345.865 49.9571 346.648 35.5206 354.586 27.7012C357.526 24.8017 362.36 23.741 365.86 25.913C368.221 27.3779 368.425 30.2672 367.997 32.6514C366.725 39.6828 355.644 38.8039 351.685 40.3597C349.905 42.1175 351.278 47.6537 353.405 49.3813H353.395ZM363.51 34.7831C365.667 33.3081 365.83 30.5097 364.843 28.8529C363.866 27.2062 361.21 26.6 359.083 27.5698C355.277 29.3075 352.927 33.005 352.021 37.1067C356.193 37.3794 360.101 37.1067 363.51 34.7831Z"
                  fill="currentColor"
                />
                <path
                  d="M327.671 38.2584L325.076 52.2504C324.852 53.4728 324.048 53.291 322.125 53.786L326.836 27.6103C326.968 26.8627 326.867 26.1757 327.111 25.7211C327.416 25.1352 328.729 25.2059 329.329 25.7211C330.031 26.3172 328.19 30.3582 330.438 28.762C333.196 26.0545 336.829 24.0138 340.808 25.3069C343.83 26.2868 345.203 29.6106 344.654 32.7626L341.276 52.1696C341.072 53.3718 340.156 53.5638 339.312 53.4425C338.467 53.3213 338.569 52.2605 338.732 51.22C339.77 44.9261 341.306 38.9858 341.968 32.6818C342.171 30.7724 341.408 28.863 340.227 28.0447C335.628 24.8523 328.861 31.8736 327.681 38.2685L327.671 38.2584Z"
                  fill="currentColor"
                />
                <path
                  d="M390.364 29.7924C386.324 36.8238 400.315 37.2885 397.375 47.2395C395.991 51.9372 391.3 53.9577 386.395 52.9171C385.408 52.705 383.943 52.3413 383.495 51.4826C383.159 50.8562 383.281 49.4419 384.075 48.4821C386.1 50.8663 388.379 51.1795 391.025 50.4723C393.019 49.9369 394.698 48.1184 394.912 45.5928C395.472 38.814 383.861 38.1876 387.606 29.5398C390.506 22.8418 399.359 24.7209 399.837 26.0948C401.313 30.3884 393.65 24.0945 390.384 29.7924H390.364Z"
                  fill="currentColor"
                />
                <path
                  d="M314.045 50.6037C315.744 50.9674 316.559 50.4825 317.383 52.9576C316.263 53.2102 314.615 53.1597 313.017 53.0385C310.046 52.796 309.039 49.9875 309.497 47.3406L312.651 28.9742C312.865 27.7518 310.158 27.9134 309.547 27.4891C309.1 27.1759 309.446 26.196 309.598 25.8828C309.802 25.4787 310.657 25.408 311.562 25.4383C316.131 25.5797 311.46 21.6599 317.281 18.8817L316.569 25.2968C319.235 25.6302 321.28 25.0544 323.315 25.5696C321.942 30.0551 316.335 25.9838 315.683 28.9237C314.289 35.2378 313.251 41.2286 312.203 47.4719C312.01 48.6539 312.407 50.2501 314.045 50.6037Z"
                  fill="currentColor"
                />
                <path
                  d="M293.429 53.8972C292.32 53.1395 291.811 53.5032 291.404 53.4123C290.997 53.3213 290.804 52.5536 290.946 51.7656L295.729 25.4686C296.522 25.1554 297.866 25.3979 297.805 26.0849C297.754 26.6809 297.855 27.4285 298.425 28.4994C300.756 27.1355 302.465 24.6705 305.538 25.1655C306.149 25.2666 306.016 26.5597 305.813 26.9739C305.579 27.4487 298.69 28.1458 296.41 37.8341C295.098 43.4006 294.202 48.6742 293.439 53.8972H293.429Z"
                  fill="currentColor"
                />
                <path
                  d="M381.938 28.1458C371.315 33.49 375.822 55.8167 369.564 53.8265L374.265 27.5901C374.398 26.8324 374.316 26.2162 374.479 25.8323C374.784 25.0948 376.087 25.1857 376.698 25.7616C377.247 26.2768 375.782 30.1663 377.817 28.7721C379.791 26.0848 382.661 24.7816 385.51 24.913C384.787 27.8932 383.454 27.3881 381.938 28.1458Z"
                  fill="currentColor"
                />
                <path
                  d="M183.744 22.3367C186.178 22.3367 188.15 20.3873 188.15 17.9825C188.15 15.5777 186.178 13.6283 183.744 13.6283C181.311 13.6283 179.338 15.5777 179.338 17.9825C179.338 20.3873 181.311 22.3367 183.744 22.3367Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_shopify_cert">
                  <rect width="400" height="66" fill="currentColor" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          7. Contact Section (Authentic Dynamic 3D Multilingual Floating Word Cloud)
          ========================================================================== */}
      <section
        id="contact"
        ref={contactRef}
        data-theme-section="light"
        data-contact=""
        className="contact"
      >
        <div data-contact-sticky="" className="contact-sticky">
          <div
            ref={contactWordsRef}
            aria-hidden="true"
            data-contact-words=""
            className="contact-words"
          />
          <div
            ref={contactContentRef}
            data-contact-content=""
            className="contact-content"
          >
            <h2 className="contact-heading">
              {language === 'en' ? 'Contact' : 'Contacto'}
            </h2>
            <p className="contact-text">
              {language === 'en'
                ? "Have a project in mind? I'd love to hear from you. Tell me what you need and I'll get back to you shortly."
                : '¿Tienes un proyecto en mente? Me encantaría escucharte. Cuéntame qué necesitas y te respondo a la brevedad.'}
            </p>
            <div className="button-group">
              <ScribbleButton
                variant="light-silver"
                size="md"
                weight="normal"
                href="https://cal.com/alejandroha/reunion-pagina-web"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  showNotification(
                    language === 'en' ? 'Opening Cal.com booking...' : 'Abriendo agenda Cal.com...'
                  )
                }
              >
                {language === 'en' ? 'Book a Call' : 'Agenda Llamada'}
              </ScribbleButton>

              <ScribbleButton
                variant="dark-blue"
                size="md"
                weight="normal"
                href="https://wa.me/524611407412"
                target="_blank"
                rel="noopener noreferrer"
              >
                {language === 'en' ? 'Get a Quote' : 'Cotiza aquí'}
              </ScribbleButton>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          8. Footer Section (Authentic Curtain Parallax + Framed Brackets + Wordmark)
          ========================================================================== */}
      <div
        ref={footerWrapRef}
        data-theme-section="light"
        data-footer=""
        className="footer-wrap"
      >
        <footer
          ref={footerInnerRef}
          data-footer-inner=""
          className="footer"
        >
          <div className="footer-top">
            <div className="footer-bracket" />
            <div className="footer-bracket is--2" />
            <div className="footer-content-w">
              {/* Col 1: Socials */}
              <div className="demo-footer__col">
                <p className="footer__links-label">[ Socials ]</p>
                <ul className="footer__links-list">
                  <li className="footer__links-list-item">
                    <a
                      data-underline-link=""
                      href="https://www.tiktok.com/@kr3ado"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__links-txt"
                    >
                      TikTok
                    </a>
                  </li>
                  <li className="footer__links-list-item">
                    <a
                      data-underline-link=""
                      href="https://www.instagram.com/_alejandro.ha/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__links-txt"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="footer__links-list-item">
                    <a
                      data-underline-link=""
                      href="https://www.awwwards.com/alejandroha/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__links-txt"
                    >
                      Awwwards
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 2: Navigation */}
              <div className="demo-footer__col">
                <p className="footer__links-label">[ Nav ]</p>
                <ul className="footer__links-list">
                  <li className="footer__links-list-item">
                    <button
                      onClick={() => {
                        const el = document.getElementById('about')
                        if (el) lenisRef.current?.scrollTo(el)
                      }}
                      className="bg-transparent border-0 p-0 text-left cursor-pointer"
                    >
                      <span data-underline-link="" className="footer__links-txt">
                        {language === 'en' ? 'About' : 'Sobre mí'}
                      </span>
                    </button>
                  </li>
                  <li className="footer__links-list-item">
                    <button
                      onClick={() => {
                        const el =
                          document.getElementById('services-showcase') ||
                          document.getElementById('services')
                        if (el) lenisRef.current?.scrollTo(el)
                      }}
                      className="bg-transparent border-0 p-0 text-left cursor-pointer"
                    >
                      <span data-underline-link="" className="footer__links-txt">
                        {language === 'en' ? 'Services' : 'Servicios'}
                      </span>
                    </button>
                  </li>
                  <li className="footer__links-list-item">
                    <button
                      onClick={() => {
                        const el = document.getElementById('portfolio')
                        if (el) lenisRef.current?.scrollTo(el)
                      }}
                      className="bg-transparent border-0 p-0 text-left cursor-pointer"
                    >
                      <span data-underline-link="" className="footer__links-txt">
                        {language === 'en' ? 'Projects' : 'Proyectos'}
                      </span>
                    </button>
                  </li>
                  <li className="footer__links-list-item">
                    <button
                      onClick={() => {
                        const el = document.getElementById('contact')
                        if (el) lenisRef.current?.scrollTo(el)
                      }}
                      className="bg-transparent border-0 p-0 text-left cursor-pointer"
                    >
                      <span data-underline-link="" className="footer__links-txt">
                        {language === 'en' ? 'Contact' : 'Contacto'}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 3: Contact Details */}
              <div className="demo-footer__col">
                <p className="footer__links-label">
                  {language === 'en' ? '[ Contact ]' : '[ Contáctanos ]'}
                </p>
                <ul className="footer__links-list">
                  <li className="footer__links-list-item">
                    <a
                      data-underline-link=""
                      href="mailto:info@alejandroha.com?subject=Contacto%20Alejandro%20HA"
                      className="footer__links-txt"
                    >
                      info@alejandroha.com
                    </a>
                  </li>
                  <li className="footer__links-list-item">
                    <a
                      data-underline-link=""
                      href="https://wa.me/524611407412"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__links-txt"
                    >
                      +52 461 140 7412
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Astronaut Blue Giant ALEJANDRO HA. Wordmark Vector */}
            <div className="txt-color-astronaut">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 281 26" fill="none">
                <g clipPath="url(#clip0_footer_logo)">
                  <path d="M22.78 24.36H19.1L18.49 21.29L17.31 18.47H5.11L3.9 21.29L3.29 24.36H0L9.46 2.18001L8.71 0.640015H12.75L22.78 24.35V24.36ZM16.43 16.39L11.21 4.00001L5.96 16.39H16.42H16.43Z" fill="currentColor" />
                  <path d="M42.99 21.5L42.56 24.36H26.7L27.2 21.11V3.89001L26.7 0.640015H30.45L29.99 3.89001V22.25H39.7L42.99 21.5Z" fill="currentColor" />
                  <path d="M65.38 21.57L64.95 24.36H47.56L48.06 21.11V3.89001L47.56 0.640015H64.81L65.24 3.43001L61.95 2.68001H50.81V11.18H59.17L61.99 10.82V13.53L59.17 13.17H50.81V22.31H62.09L65.38 21.56V21.57Z" fill="currentColor" />
                  <path d="M68.67 22.89V19.46L72.17 22.17C72.81 22.42 73.53 22.56 74.17 22.56C76.99 22.56 78.53 20.95 78.53 17.88V3.89001L78.03 0.640015H81.78L81.32 3.89001L81.28 17.5C81.28 21.96 78.78 24.68 74.39 24.68C72.39 24.68 70.75 24.14 68.68 22.89H68.67Z" fill="currentColor" />
                  <path d="M107.55 24.36H103.87L103.26 21.29L102.08 18.47H89.87L88.66 21.29L88.05 24.36H84.76L94.22 2.18001L93.47 0.640015H97.51L107.54 24.35L107.55 24.36ZM101.2 16.39L95.99 4.00001L90.74 16.39H101.2Z" fill="currentColor" />
                  <path d="M132.73 0.640015L132.23 3.89001V24.35H128.37L114.37 2.89001V21.1L114.83 24.35H111.47L111.97 21.1V3.89001L111.47 0.640015H115.9L129.83 22.03V3.89001L129.37 0.640015H132.73Z" fill="currentColor" />
                  <path d="M139.37 21.11V3.89001L138.87 0.640015H147.66C155.94 0.640015 160.12 4.39001 160.12 12.46C160.12 20.53 155.94 24.35 147.66 24.35H138.87L139.37 21.1V21.11ZM147.76 22.28C154.01 22.28 157.22 19.32 157.22 12.46C157.22 5.60001 154.04 2.71001 147.79 2.71001H142.11V22.28H147.75H147.76Z" fill="currentColor" />
                  <path d="M185.79 24.36H181.4L180.4 21.79L174.58 14.5H168.83V21.11L169.44 24.36H165.55L166.05 21.11V3.89001L165.55 0.640015H176.12C181.62 0.640015 184.3 3.10001 184.3 7.50001C184.3 11.18 181.91 13.61 177.51 14.11L185.79 24.36ZM175.26 12.39C179.12 12.39 181.51 10.68 181.51 7.50001C181.51 4.32001 179.62 2.61001 175.76 2.61001H168.76V12.39H175.26Z" fill="currentColor" />
                  <path d="M189.61 12.46C189.61 4.64 194.36 0 201.39 0C208.42 0 213.17 4.64 213.17 12.46C213.17 20.28 208.35 25.03 201.39 25.03C194.43 25.03 189.61 20.28 189.61 12.46ZM210.25 12.46C210.25 5.82 206.57 2.14 201.39 2.14C196.21 2.14 192.53 5.82 192.53 12.46C192.53 19.1 196.17 22.85 201.35 22.85C206.53 22.85 210.24 19.14 210.24 12.46H210.25Z" fill="currentColor" />
                  <path d="M227.28 21.11V3.89001L226.78 0.640015H230.53L230.07 3.89001V11.14H244.14V3.89001L243.68 0.640015H247.43L246.93 3.89001V21.1L247.43 24.35H243.68L244.14 21.1V13.24H230.07V21.1L230.53 24.35H226.78L227.28 21.1V21.11Z" fill="currentColor" />
                  <path d="M274.13 24.36H270.45L269.84 21.29L268.66 18.47H256.45L255.24 21.29L254.63 24.36H251.34L260.8 2.18001L260.05 0.640015H264.09L274.12 24.35L274.13 24.36ZM267.77 16.39L262.56 4.00001L257.31 16.39H267.77Z" fill="currentColor" />
                  <path d="M280.56 20.1899H276.58V24.3599H280.56V20.1899Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_footer_logo">
                    <rect width="280.55" height="25.03" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="footer-copy">
            <div className="footer-copy__left">
              <p className="footer-copy__label">Small details, big impact</p>
              <p className="footer-copy__label">© {new Date().getFullYear()}, Alejandro Hinojosa</p>
            </div>
            <a
              href="https://www.luanstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-copy__link"
            >
              <p data-underline-link="" className="footer-copy__label">
                Design by: Luan Studio
              </p>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
