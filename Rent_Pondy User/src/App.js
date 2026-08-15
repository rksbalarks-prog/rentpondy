

import React from 'react'
import BannerCarousel from './Components/BannerCarousel'
import Ads from './Components/Ads'
import FrontFooter from './Components/FrontFooter'
import Header from './Components/Header'
import Carousel from './Components/Carousel';
import Login from './Components/Login';
import WebLogin from './Components/WebLogin'
import Seo from './seo/Seo';
import { SITE_URL, BRAND } from './seo/seoMeta';

// Site-level structured data. WebSite + SearchAction is what lets Google show a
// search box for the brand; RealEstateAgent describes who is behind the listings.
const HOME_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/pondicherry?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/rentpondylogo.png`,
    areaServed: [
      { '@type': 'City', name: 'Pondicherry' },
      { '@type': 'City', name: 'Chennai' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pondicherry',
      addressRegion: 'Puducherry',
      addressCountry: 'IN',
    },
  },
];

export default function App() {
  return (
    <>
    <Seo
      title="Rent Pondy | Rental Houses &amp; Commercial Property in Pondicherry"
      description="Find houses, apartments, commercial spaces and land for rent in Pondicherry and Chennai. Owner-posted listings with real photos and rent — zero brokerage. New properties added daily."
      canonical={SITE_URL + '/'}
      jsonLd={HOME_JSON_LD}
    />
    <Header />
    <BannerCarousel />
     <div className="container-fluid ps-5 pe-4" style={{background:"#FFFFFF"}}>
      <div className="row">
        {/* Main Content */}
        {/* <Login /> */}
        <div className="col-12 col-md-9" style={{fontFamily:"Inter, sans-serif", fontWeight:'Medium'}}>
          {/* <PropertyCard /> */}
<div className='mt-3 mb-3'>
                  <WebLogin />

</div>

          <Carousel />
          
          </div>
        {/* Sidebar */}
        <div className="d-none d-md-block col-md-3 mt-3 p-0 ">
          <Ads />
          </div>
      </div>
    </div>
    {/* <ShareButtons /> */}
    {/* <CardCarousel /> */}
   <FrontFooter/>
    </>
  )
}
