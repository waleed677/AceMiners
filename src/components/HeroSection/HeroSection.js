import React, { useState } from 'react'
import { HeroContainer, HeroBg,ImageBg, VideoBg, HeroContent,HeroH1,HeroP,HeroBtnWrapper,ArrowForward,ArrowRight,Button } from './HeroSection.elements';
function HeroSection() {


    const [hover,setHover]= useState(false);
    const onHover = () => {
        setHover(!hover);
    }
    return (
        <>
           <HeroContainer>
                {/* <HeroBg>
                    <ImageBg wid={100} src={"config/images/bg.png"} />
                </HeroBg> */}
                <HeroContent>
                </HeroContent>
           </HeroContainer> 
        </>
    )
}

export default HeroSection
