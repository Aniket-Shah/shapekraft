'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getMarket } from '@/lib/market'
import { GTM_ID, GA_ID } from '@/lib/analytics'

export function AnalyticsScripts() {
  const [ids, setIds] = useState<{ gtmId: string; gaId: string } | null>(null)

  useEffect(() => {
    const market = getMarket(window.location.hostname)
    setIds({ gtmId: GTM_ID[market], gaId: GA_ID[market] })
  }, [])

  if (!ids) return null

  return (
    <>
      {ids.gaId && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${ids.gaId}`} strategy="afterInteractive" />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ids.gaId}');
            `}
          </Script>
        </>
      )}

      {ids.gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${ids.gtmId}');
          `}
        </Script>
      )}
    </>
  )
}
