
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import AboutUs from '../components/AboutUs'
import Footer from '../components/Footer'
import LocationSection from '../components/Map'
import OurServices from '../components/OurServices'
import {Gallery} from '../components/Gallery'


function HomePage() {
  return (
    <>
        <Navbar />
        <Hero />
        <section id="about-us">
        <AboutUs /> 
        </section>
        <OurServices />
        <Gallery/>
        <LocationSection/>
        <Footer />
    </>
  )
}

export default HomePage