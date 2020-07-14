"use strict";
import Map from './Map.js';

const mapSettings = {
    width: 650,
    height: 650,
    selector: '#map'
}

const map = new Map( mapSettings );

console.log(map);