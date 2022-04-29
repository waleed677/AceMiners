import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

function Loader() {
    return (
        <div className="overlay">
            <div className="spinner">
           <RotatingLines width="100" strokeColor="#FF5733" />
           </div>
        </div>
    );
}



export default Loader;