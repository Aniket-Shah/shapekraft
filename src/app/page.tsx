import { NavStickyMinimal }  from '@/components/sections/NavStickyMinimal'
import { HeroBigStatement }  from '@/components/sections/HeroBigStatement'
import { MarqueeServices }   from '@/components/sections/MarqueeServices'
import { HugeTextScroll }    from '@/components/sections/HugeTextScroll'
import { FeaturedWork }      from '@/components/sections/FeaturedWork'
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
        <HeroBigStatement />
        <MarqueeServices />
        <HugeTextScroll />
        <FeaturedWork />
        <ServicesGrid />
        <StatsGrid />
        <ProcessSteps />
        <ContactBigCTA />
      </main>

      <SiteFooter />
    </>
  )
}
