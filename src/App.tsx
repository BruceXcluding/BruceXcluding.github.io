import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { profile, projects, focusAreas } from './content'

const github = profile.github
const marqueeItems = [
  { title: 'AI Exploration', detail: 'Ideas into working systems', tone: 'violet' },
  { title: 'Backbone Conductor', detail: 'Coding agent coordination', tone: 'blue' },
  { title: 'Open Source', detail: 'Building in public', tone: 'green' },
  { title: 'Creative Tech', detail: 'Digital experiences', tone: 'orange' },
  { title: 'LLM Ops', detail: 'CUDA experiments', tone: 'blue' },
  { title: 'Vitis Libraries', detail: 'Compute / C++', tone: 'orange' },
  { title: 'Model Serving', detail: 'SGLang', tone: 'violet' },
  { title: 'Accelerated', detail: 'Hardware & software', tone: 'green' },
]


function FadeIn({ children, delay = 0, y = 30, x = 0, className = '' }: { children: ReactNode; delay?: number; y?: number; x?: number; className?: string }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: '50px', amount: 0 }} transition={{ duration: .7, delay, ease: [.25, .1, .25, 1] }}>{children}</motion.div>
}

function ContactButton({ label = 'Visit my GitHub' }: { label?: string }) {
  return <a className="contact-button" href={github} target="_blank" rel="noreferrer"><Github size={18} strokeWidth={2} /><span>{label}</span><ArrowUpRight size={17} /></a>
}

function Magnet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 140, damping: 20 })
  const springY = useSpring(y, { stiffness: 140, damping: 20 })
  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (event: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect()
      if (!box) return
      const near = event.clientX >= box.left - 150 && event.clientX <= box.right + 150 && event.clientY >= box.top - 150 && event.clientY <= box.bottom + 150
      x.set(near ? (event.clientX - box.left - box.width / 2) / 3 : 0)
      y.set(near ? (event.clientY - box.top - box.height / 2) / 3 : 0)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, x, y])
  return <motion.div ref={ref} className="magnet" style={{ x: springX, y: springY }}>{children}</motion.div>
}

function HeroSection() {
  return <section className="hero" id="top">
    <FadeIn y={-20} className="nav-wrap"><nav className="nav" aria-label="Main navigation"><a href="#about">About</a><a href="#focus">Focus</a><a href="#projects">Projects</a><a href={github} target="_blank" rel="noreferrer">GitHub</a></nav></FadeIn>
    <div className="hero-title-wrap"><FadeIn delay={.15} y={40}><h1 className="hero-title hero-heading">Hi, i'm {profile.displayName}</h1></FadeIn></div>
    <FadeIn delay={.6} y={30} className="hero-portrait"><Magnet><img src="/profile-blue-rim.png" alt="Portrait of Yigex with a cat" fetchPriority="high" /></Magnet></FadeIn>
    <div className="hero-bottom"><FadeIn delay={.35} y={20}><p>{profile.heroLine}</p></FadeIn><FadeIn delay={.5} y={20}><ContactButton /></FadeIn></div>
  </section>
}

function MarqueeRow({ items, direction, progress }: { items: typeof marqueeItems; direction: 1 | -1; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], direction === 1 ? [-200, 220] : [200, -220])
  const reduce = useReducedMotion()
  return <motion.div className="marquee-track" style={{ marginLeft: `calc(-1 * var(--tile-step) * ${items.length})`, x: reduce ? 0 : x }}>{[...items, ...items, ...items].map((item, index) => <div className={`marquee-tile tone-${item.tone}`} key={`${item.title}-${index}`} aria-hidden={index >= items.length}><span className="marquee-kicker">YIGEX / FIELD NOTES</span><span className="marquee-orbit" /><span className="marquee-title">{item.title}</span><span className="marquee-detail">{item.detail} <ArrowUpRight size={18} /></span></div>)}</motion.div>
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return <section className="marquee-section" ref={ref} aria-label="Areas of work and public repositories"><MarqueeRow items={marqueeItems.slice(0, 4)} direction={1} progress={scrollYProgress} /><MarqueeRow items={marqueeItems.slice(4)} direction={-1} progress={scrollYProgress} /></section>
}

function Character({ char, index, total, progress }: { char: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total * .8, index / total * .8 + .16], [.2, 1])
  return <span className="char" aria-hidden="true"><span className="char-spacer">{char === ' ' ? '\u00a0' : char}</span><motion.span className="char-front" style={{ opacity }}>{char === ' ' ? '\u00a0' : char}</motion.span></span>
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .8', 'end .2'] })
  const reduce = useReducedMotion()
  return <p ref={ref} className="about-copy" aria-label={text}>{reduce ? text : Array.from(text).map((char, index) => <Character key={index} char={char} index={index} total={text.length} progress={scrollYProgress} />)}</p>
}

function AboutSection() {
  return <section className="about section-shell" id="about">
    <FadeIn x={-80} y={0} delay={.1} className="about-decor about-moon"><span className="decor-orbit" aria-hidden="true" /></FadeIn>
    <FadeIn x={-80} y={0} delay={.25} className="about-decor about-shape"><span className="decor-diamond" aria-hidden="true" /></FadeIn>
    <FadeIn x={80} y={0} delay={.15} className="about-decor about-lego"><span className="decor-cube" aria-hidden="true" /></FadeIn>
    <FadeIn x={80} y={0} delay={.3} className="about-decor about-pointer"><span className="decor-asterisk" aria-hidden="true">✳</span></FadeIn>
    <div className="about-inner"><FadeIn><h2 className="section-title hero-heading">About me</h2></FadeIn><AnimatedText text={profile.about} /><FadeIn delay={.25}><ContactButton label="Explore my work" /></FadeIn></div>
  </section>
}

function ServicesSection() {
  return <section className="services" id="focus"><FadeIn><h2 className="section-title">Expertise</h2></FadeIn><div className="services-list">{focusAreas.map(([number, title, description], index) => <FadeIn key={number} delay={index * .08} className="service"><span className="service-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></FadeIn>)}</div></section>
}

function ProjectCard({ project, index, progress }: { project: typeof projects[number]; index: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  const scale = useTransform(progress, [index * .45, (index + 1) * .45], [1, 1 - (projects.length - 1 - index) * .03])
  const repoUrl = `${github}/${project.repo}`
  return <motion.article className={`project-card project-tone-${index}`} style={{ scale: reduce ? 1 : scale, top: `calc(var(--card-top) + ${index * 28}px)`, zIndex: index + 1 }}><div className="project-top"><span className="project-number">{project.number}</span><div className="project-meta"><span>{project.category} / PUBLIC REPOSITORY</span><h3>{project.name}</h3></div><a className="project-link" href={repoUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={18} /></a></div><div className="project-visual"><div className="project-visual-left"><div className="project-art-small"><span>YIGEX / REPOSITORY {project.number}</span><strong>{project.name}</strong><i aria-hidden="true" /></div><div className="project-art-code"><span>EXPLORE THE WORK</span><strong>{project.repo}</strong><span className="project-code-lines" aria-hidden="true" /></div></div><div className="project-art-main"><span>{project.category}</span><span className="project-art-orbit" aria-hidden="true" /><strong>{project.name}</strong><small>github.com/BruceXcluding/{project.repo}</small></div></div></motion.article>
}

function ProjectsSection() {
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })
  return <section className="projects" id="projects"><FadeIn><h2 className="section-title hero-heading">Project</h2></FadeIn><div className="project-stack" ref={stackRef}>{projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} progress={scrollYProgress} />)}</div><footer><span>Yigex © {new Date().getFullYear()}</span><a href={github} target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={16} /></a><a href="#top">Back to top ↑</a></footer></section>
}

export default function App() {
  return <main><HeroSection /><MarqueeSection /><AboutSection /><ServicesSection /><ProjectsSection /></main>
}
