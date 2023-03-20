import React, { useEffect, useState } from "react";
import { HashLink as Link } from 'react-router-hash-link';
// import Navbar from "../components/navbar/Navbar";


function Agile() {

  return (

    <div>
        <h2> Mes outils d'analyse agile </h2>

        <ul>
            <li><Link to="#impact-mapping"> Impact mapping </Link></li>
            <li><Link to="#empathy-map"> Empathy map </Link></li>
            <li><Link to="#personas"> Personas </Link></li>
            <li><Link to="#arbre-fonctionnel"> Arbre fonctionnel </Link></li>
            <li><Link to="#elevator-pitch"> Elevator pitch </Link></li>
        </ul>
        <div id="impact-mapping">
            <h3>Impact mapping</h3>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu dictum varius duis at consectetur lorem. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Nibh praesent tristique magna sit amet purus. Vel risus commodo viverra maecenas accumsan lacus. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Nisl nisi scelerisque eu ultrices. Ipsum dolor sit amet consectetur adipiscing. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Neque viverra justo nec ultrices dui sapien eget. Orci ac auctor augue mauris augue neque.
            </div>
        </div>
        <div id="empathy-map">
            <h3>Empathy map</h3>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu dictum varius duis at consectetur lorem. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Nibh praesent tristique magna sit amet purus. Vel risus commodo viverra maecenas accumsan lacus. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Nisl nisi scelerisque eu ultrices. Ipsum dolor sit amet consectetur adipiscing. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Neque viverra justo nec ultrices dui sapien eget. Orci ac auctor augue mauris augue neque.
            </div>
        </div>
        <div id="personas">
            <h3>Personas</h3>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu dictum varius duis at consectetur lorem. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Nibh praesent tristique magna sit amet purus. Vel risus commodo viverra maecenas accumsan lacus. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Nisl nisi scelerisque eu ultrices. Ipsum dolor sit amet consectetur adipiscing. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Neque viverra justo nec ultrices dui sapien eget. Orci ac auctor augue mauris augue neque.
            </div>
        </div>
        <div id="arbre-fonctionnel">
            <h3>Arbre fonctionnel</h3>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu dictum varius duis at consectetur lorem. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Nibh praesent tristique magna sit amet purus. Vel risus commodo viverra maecenas accumsan lacus. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Nisl nisi scelerisque eu ultrices. Ipsum dolor sit amet consectetur adipiscing. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Neque viverra justo nec ultrices dui sapien eget. Orci ac auctor augue mauris augue neque.
            </div>
        </div>
        <div id="elevator-pitch">
            <h3>Elevator pitch</h3>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu dictum varius duis at consectetur lorem. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Nibh praesent tristique magna sit amet purus. Vel risus commodo viverra maecenas accumsan lacus. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Porttitor lacus luctus accumsan tortor posuere ac ut consequat. Nisl nisi scelerisque eu ultrices. Ipsum dolor sit amet consectetur adipiscing. Egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Neque viverra justo nec ultrices dui sapien eget. Orci ac auctor augue mauris augue neque.
            </div>
        </div>
        
        
        

        <Link to="/"> Retour à l'accueil </Link>
    </div>

  );
}

export default Agile;