import gsap from 'gsap'
import {useGSAP} from "@gsap/react";
import {heroVideo, smallHeroVideo} from "../utils";
import {useEffect, useState} from "react";

const Hero = () => {
    const [video, setVideo] = useState<string | null>();

    useGSAP(() => {
        gsap.to('#hero', {opacity: 1, delay: 2});
        gsap.to('#cta', {opacity: 1, y: -50, delay: 2})
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleVideo);
        handleVideo();
        return () => {
            window.removeEventListener('resize', handleVideo);
        }
    }, []);

    const handleVideo = () => {
        if (window.innerWidth < 760) {
            setVideo(smallHeroVideo)
        } else {
            setVideo(heroVideo)
        }
    }
    return (
        <section className={'w-full nav-height bg-black relative'}>
            <div className={'h-5/6 w-full flex-center flex-col'}>
                <p id="hero" className={'hero-title'}>IPhone 15 Pro</p>
                <div className={"md:w-10/12 w-9/12"}>
                    <video className={'pointer-events-none'} autoPlay={true} muted={true} playsInline={true}
                           key={video}>
                        <source src={video || undefined} type={'video/mp4'}/>
                    </video>
                </div>
            </div>
            <div id={'cta'}
                 className={'flex flex-col items-center opacity-0 translate-y-20'}>
                <a href='#highlights' className={'btn'}>Buy</a>
                <p className={'font-normal'}>From $199/month or $999</p>
            </div>
        </section>
    )
}

export default Hero;