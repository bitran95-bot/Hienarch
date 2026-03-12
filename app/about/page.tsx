"use client"
import { useEffect } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './styles.css';

const inter = Inter({ subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'] });

export default function AboutPage() {
  useEffect(() => {
    // Hiệu ứng xuất hiện khi cuộn trang (Intersection Observer)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });

    // Hiệu ứng di chuột (Mouse move parallax)
    const handleMouseMove = (e: MouseEvent) => {
      const slabs = document.querySelectorAll<HTMLElement>('.slab');
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;

      slabs.forEach(slab => {
        slab.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Dọn dẹp bộ nhớ khi chuyển trang
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`about-page ${inter.className}`}>
      <nav className="about-nav">
        <div className={`about-logo ${jetbrains.className}`}>ELIAS_VAUGHN / ARCHITECT</div>
        <div className={`about-logo ${jetbrains.className}`}>INDEX.01</div>
      </nav>

      <main className="about-main">
        {/* HERO SECTION */}
        <section className="hero-grid">
          <div className="title-block reveal">
            <span className={`mono-label ${jetbrains.className}`}>Principal Architect</span>
            <h1>Concrete<br />Poetics</h1>
            <p className="bio-text" style={{ marginTop: '40px' }}>
              Designing monoliths that breathe. Elias Vaughn's work is a dialogue between the brutality of raw earth and the fragility of light.
            </p>
          </div>

          <div className="architect-image-wrapper slab-inset reveal" style={{ transitionDelay: '0.2s' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
              alt="Architect Portrait" 
              className="architect-image" 
            />
            <div className="caption-slab slab">
              <span className={`mono-label ${jetbrains.className}`} style={{ margin: 0 }}>Est. 1988</span>
              <p style={{ fontWeight: 700, marginTop: '5px' }}>ELIAS VAUGHN</p>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="reveal">
          <div className="section-header">
            <span className={`mono-label ${jetbrains.className}`}>Philosophy</span>
            <h2>The Tectonic Intent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="slab-inset" style={{ padding: '40px' }}>
              <span className={`mono-label ${jetbrains.className}`}>01 / Materiality</span>
              <p>We do not cover structures; we reveal them. Concrete is our primary language—a liquid stone that remembers the form of its casting.</p>
            </div>
            <div className="slab-inset" style={{ padding: '40px' }}>
              <span className={`mono-label ${jetbrains.className}`}>02 / Permanence</span>
              <p>Architecture is an anchor in an era of ephemeral digital noise. We build for the next century, prioritizing mass and shadow.</p>
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="timeline-container">
          <div className="timeline-line"></div>
          
          <div className="timeline-item reveal">
            <div className="timeline-content slab">
              <span className={`year-stamp ${jetbrains.className}`}>2012</span>
              <h3>The Quarry House</h3>
              <p className={jetbrains.className} style={{ fontSize: '0.9rem', color: 'var(--text-mono)' }}>
                A residential complex carved directly into the limestone cliffs of the Amalfi Coast. Winner of the Stone Architecture Award.
              </p>
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-content slab">
              <span className={`year-stamp ${jetbrains.className}`}>2015</span>
              <h3>Void Pavilion</h3>
              <p className={jetbrains.className} style={{ fontSize: '0.9rem', color: 'var(--text-mono)' }}>
                A temporary installation in Berlin exploring the acoustic properties of cast concrete and negative space.
              </p>
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-content slab">
              <span className={`year-stamp ${jetbrains.className}`}>2019</span>
              <h3>Monolith Library</h3>
              <p className={jetbrains.className} style={{ fontSize: '0.9rem', color: 'var(--text-mono)' }}>
                The firm's magnum opus—a 12-story brutalist structure in Tokyo featuring a self-supporting concrete spiral staircase.
              </p>
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-content slab">
              <span className={`year-stamp ${jetbrains.className}`}>2024</span>
              <h3>Strata HQ</h3>
              <p className={jetbrains.className} style={{ fontSize: '0.9rem', color: 'var(--text-mono)' }}>
                Our new studio in Zurich, exploring the intersection of 3D-printed concrete and tectonic assembly.
              </p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: '100px', textAlign: 'center', paddingBottom: '100px' }}>
          <div className="slab-inset" style={{ display: 'inline-block', padding: '20px 60px' }}>
            <span className={`mono-label ${jetbrains.className}`}>Contact</span>
            <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>STUDIO@ELIASVAUGHN.ARCH</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
