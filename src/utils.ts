import { SVG_NS } from "./constants";

/**
 * Converts degrees to radians.
 * @param deg Angle in degrees
 * @returns Angle in radians
 */
export function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/**
 * Converts polar coordinates (angle, radius) to Cartesian coordinates (x, y).
 * @param cx Center x-coordinate
 * @param cy Center y-coordinate
 * @param r Radius from center
 * @param angleDeg Angle in degrees
 * @returns Object with x and y properties
 */
export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): { x: number, y: number } {
    const rad = degToRad(angleDeg); // Convert angle to radians
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/**
 * Creates a linear gradient element for a radial bar.
 * @param id Gradient ID (used for referencing in SVG)
 * @param startAngle Rotation offset in degrees for gradient direction
 * @returns SVGLinearGradientElement
 */
export function createLinearGradient(id: string, startAngle: number): SVGLinearGradientElement {
    const grad = document.createElementNS(SVG_NS, "linearGradient");
    grad.setAttribute("id", id);
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");
    // Rotate gradient so it aligns with the wedge direction
    grad.setAttribute("gradientTransform", `rotate(${startAngle + 90}, 0.5, 0.5)`);

    // Gradient stops for color transition
    const stop1 = document.createElementNS(SVG_NS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("class", "gradient-stop-1");
    const stop2 = document.createElementNS(SVG_NS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("class", "gradient-stop-2");

    grad.append(stop1, stop2);
    return grad;
}