import { NavStickyMinimal }  from '@/components/sections/NavStickyMinimal'
import { HeroBigStatement }  from '@/components/sections/HeroBigStatement'
import { MarqueeServices }   from '@/components/sections/MarqueeServices'
import { HugeTextScroll }    from '@/components/sections/HugeTextScroll'
import { ServicesGrid }      from '@/components/sections/ServicesGrid'
import { StatsGrid }         from '@/components/sections/StatsGrid'
import { ProcessSteps }      from '@/components/sections/ProcessSteps'
import { ContactBigCTA }     from '@/components/sections/ContactBigCTA'
import { SiteFooter }        from '@/components/sections/SiteFooter'

export default function HomePage() {
  return (
    <>
      <NavStickyMinimal />

      <main id="main-content">
        {/* 1 — Hero */}
        <HeroBigStatement />

        {/* 2 — Marquee */}
        <MarqueeServices />

        {/* 3 — Huge text parallax */}
        <HugeTextScroll />

        {/* 4 — Services */}
        <ServicesGrid />

        {/* 5 — Stats */}
        <StatsGrid />

        {/* 6 — Process */}
        <ProcessSteps />

        {/* 7 — Contact CTA */}
        <ContactBigCTA />
      </main>

      <SiteFooter />
    </>
  )
}
