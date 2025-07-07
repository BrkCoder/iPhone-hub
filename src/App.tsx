import './App.css'
import Highlights from "./components/Highlights.tsx";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import Model from './components/Model.tsx';
import Features from './components/Features.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import Footer from './components/Footer.tsx';

const App = () => {

    return (
        <main className={'bg-black w-full h-full '}>
            <Navbar/>
            <Hero/>
            <Highlights/>
            <Model/>
            <Features/>
            <HowItWorks/>
            <Footer/>
        </main>
    )
}

export default App
