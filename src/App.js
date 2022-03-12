import React, { useEffect, useState, useRef } from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import * as s from "./styles/globalStyles";
import Home from "./pages/HomePage/Home";
import Fonts from "./styles/fontStyles";
import ReactGA from 'react-ga';
ReactGA.initialize('G-3X4313YHG0');
const theme = {
  colors: {
    body:'#000',
    textColor:'#5fcde4',
  }
}



function App() {
  return (

    <s.Body theme={theme}>
    <Fonts/>
      <Router>
        <Home/>
      </Router>
    </s.Body>
  );
}

export default App;
