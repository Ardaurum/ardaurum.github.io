import { float2 } from './float2.js';

export const RMath = {
    angleToVec(angle) {
        return float2.create(Math.cos(angle), Math.sin(angle)); 
    },

    degreeToVec(degree) {
        let angle = degree * Math.PI / 180.0;
        return float2.create(Math.cos(angle), Math.sin(angle)); 
    }
}