import React from 'react'
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Activities from '../components/Activities';
import Contact from '../components/Contact';
const Home = () => {
	return (
		<div>
			<Hero/>
			<About/>
			<Experience/>
			<Projects/>
			<Skills/>
			<Activities/>
			<Contact/>
		</div>
	)
}

export default Home