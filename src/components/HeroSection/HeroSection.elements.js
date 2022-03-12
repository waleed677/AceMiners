import styled from "styled-components";
import {MdKeyboardArrowRight, MdArrowForward} from "react-icons/md";
import { Link } from "react-scroll";

export const HeroContainer = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    padding: 0 30px;
    height:100vh;
    position:relative;
    z-index:1;
    width: 100%;
    @media screen and (max-width: 768px) {
        height:100vh;
    }

`;


export const HeroBg = styled.div`
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    width:100%;
    height:100%;
    overflow:hidden;

`;

export const VideoBg = styled.video`
    width:100%;
    height:100%;
    -o-object-fit:cover;
    object-fit:cover;
    background:#232a34;
    opacity:0.5;
`;  

export const ImageBg = styled.img`
    width:${({wid}) => (wid ? wid+"%" : "100%")};
    height:100%;
`;  

export const HeroContent = styled.div`
    z-index:3;
    max-width:1200px;
    position:absolute;
    padding:8px 24px;
    display:flex;
    flex-direction:column;
    align-items:center;
    top:15%;
    
`;

export const HeroH1 = styled.h1`
    font-size:48px;
    color:#fff;
    text-align:center;
    font-family: 'cocogoose';
    @media screen and (max-width: 768px) {
        font-size:40px;
    }
    @media screen and (max-width: 480px) {
        font-size:32px;
    }
`;

export const HeroP = styled.p`
    margin-top:14px;
    font-size:1.8rem;
    color:#fff;
    text-align:center;
    font-family: 'wonder';
    width:90%;

    @media screen and (max-width: 768px) {
        font-size:18px;
        line-height:1.1;
    }
    @media screen and (max-width: 480px) {
        font-size:16px;
    }
`;

export const HeroBtnWrapper = styled.div`
    margin-top:32px;
    display:flex;
    flex-direction:column;
    align-items:center;
`;

export const ArrowForward = styled(MdArrowForward)`
    margin-left:8px;
    font-size:20px;
`;

export const ArrowRight = styled(MdKeyboardArrowRight)`
    margin-left:8px;
    font-size:20px;
`;


export const Button = styled(Link)`
background-color: var(--primary);
 padding: 10px 22px;
 border-radius: 10px;
 white-space: nowrap;
 outline: none;
 border: none;
 font-weight: bolder;
 text-decoration:none;
 color: var(--primary-text);
 margin-top:1.1vw;
 cursor: pointer;
 display:flex;
 justify-content:center;
 align-items:center;
 transition: 0.5s all ease-in-out;
 :active {
   box-shadow: none;
   -webkit-box-shadow: none;
   -moz-box-shadow: none;
 }

`;