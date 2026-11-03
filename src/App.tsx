import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLButtonElement>(null)
  const bgWrapRef = useRef<HTMLDivElement>(null)
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null)
  const bracketLeftRef = useRef<HTMLSpanElement>(null)
  const bracketRightRef = useRef<HTMLSpanElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Initialize Lenis Smooth Scrolling and link to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerHandler)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerHandler)
    }
  }, [])

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
    },
    { scope: containerRef }
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
      className="relative w-full max-w-full overflow-x-hidden bg-[#e2e1e1] text-[#080912] font-sans selection:bg-[#080912] selection:text-white"
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
            className={`pointer-events-auto block origin-top-left text-left bg-transparent border-none p-0 cursor-pointer transition-opacity duration-300 ${
              isScrolled ? 'hover:opacity-75' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1376 165"
              className="w-full h-auto text-[#080912] block"
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

        {/* Top-Right Pill Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => showNotification(language === 'en' ? 'Book a Call opened' : 'Reunión agendada')}
            className="nav-button-item px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#080912] text-white hover:bg-[#2a4093] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
          >
            {language === 'en' ? 'BOOK A CALL' : 'AGENDAR LLAMADA'}
          </button>

          <button
            onClick={() => showNotification(language === 'en' ? 'Quote Request opened' : 'Cotización solicitada')}
            className="nav-button-item px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#2a4093] text-white hover:bg-[#080912] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
          >
            {language === 'en' ? 'GET A QUOTE' : 'COTIZAR AHORA'}
          </button>
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

            {/* Interactive Call to Action Scribble / Pill Button */}
            <div className="about-bio-item mt-10 sm:mt-12">
              <button
                onClick={() =>
                  showNotification(language === 'en' ? 'Opening contact channel...' : 'Abriendo canal de contacto...')
                }
                className="group relative inline-flex items-center gap-4 px-8 py-4 sm:px-9 sm:py-4.5 rounded-full bg-[#080912] text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg cursor-pointer"
              >
                {/* Dark Blue hover slide */}
                <span className="absolute inset-0 bg-[#2a4093] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                <span className="relative z-10 text-xs sm:text-[13px] font-bold tracking-widest uppercase">
                  {language === 'en' ? "LET'S TALK" : 'COTIZA AQUÍ'}
                </span>

                <svg
                  className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
