import  styled  from "styled-components";
import {Link as LinkS } from "react-scroll";

export const NavLink = styled(LinkS)`
    text-decoration:none;
    color:#fff;
    align-items:center;
    height:100%;
    padding:0 1rem;
    display:flex;
    cursor:pointer;
    font-family: 'wonder';
    font-size:1.5rem;
    &:hover{
      color:#dbac36;
    }
    &:active{
      border-bottom: 3px solid #01bf71;
    }
    
    @media screen and (max-width: 960px) {
      text-align:center;
      width:100%;
      display:table;
    
      &:hover{
        color:#4b59f7;
        transition: all 0.5s ease;
        }
    }
    `;


export const NavItems = styled.li`
height:80px;
padding-left:24px;
list-style: none;


@media screen and (max-width: 960px) {
  height:0%;
  margin-top:9vh;
  &:hover{
    border:none;
  }
}
`;

export const NavIcon = styled.img`
display:flex;
align-items:center;
justify-content:center;
vertical-align:middle;
margin:10px auto;
width: ${({wid}) => wid ? wid+"%" : '48px'};

@media screen and (max-width: 960px) {
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
}
`;