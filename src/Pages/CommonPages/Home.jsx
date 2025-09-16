import React from 'react'
import Header from '../../Components/CommonComponents/Header'
import HeroBanner from '../../Components/HomeComponents/HeroBanner'
import About from '../../Components/HomeComponents/About'
import CardSlider from '../../Components/HomeComponents/CardSlider'
import RecipientsRequestForm from '../../Components/HomeComponents/RecipientsRequestForm'

const Home = () => {
      

  
  return (
    <div>

      <HeroBanner/>
      <About/>
      <CardSlider/>
      <RecipientsRequestForm />
    </div>
  )
}

export default Home
