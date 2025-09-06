const svgNS = "http://www.w3.org/2000/svg";
const svg = document.querySelector("svg") as SVGSVGElement;
const defs = document.querySelector("svg defs") as SVGDefsElement | null;
const dataLabels = document.querySelector("#dataLabels") as SVGGElement | null;
const valueLabels = document.querySelector("#valueLabels") as SVGGElement | null;
const radialBars = document.querySelector("#radialBars") as SVGGElement | null;
const range = Array.from({ length: 24 }, (_, i) => i + 1);
const data = Array.from({ length: 24 }, () => Math.round(100 * Math.random() / 2));

assertNotNull(svg, "svg missing");
assertNotNull(defs, "defs missing");
assertNotNull(dataLabels, "dataLabels missing");
assertNotNull(valueLabels, "valueLabels missing");
assertNotNull(radialBars, "radialBars missing");

createLabels(dataLabels, 190, range);
createLabels(valueLabels, 100, data);
createGradients(defs, -82.5, "#3BA6F5", 24);
createRadialBars(radialBars, -82.5 + 180, 80, 180, data);

function createLabels(parent: SVGGElement, radius: number, values: number[]) {
    const angleStep = 360 / values.length
    values.forEach((value, i) => {
        const angle = (i + 1) * angleStep;
        const labelGroup = document.createElementNS(svgNS, "g");
        labelGroup.setAttribute(
            "transform",
            `rotate(${angle}) translate(0,${radius}) rotate(${-angle})`);
        parent.appendChild(labelGroup);
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.textContent = value.toString();
        labelGroup.appendChild(label);
    });
}

function createGradients(parent: SVGDefsElement, rot: number, color: string, num: number) {
    const angleStep = 360 / num;

    for (let i = 0; i < num; i++) {
        const startAngle = i * angleStep + rot;
        const gradientId = `gradient-${i}`;
        const linearGradient = document.createElementNS(svgNS, "linearGradient");
        linearGradient.setAttribute("id", gradientId);
        linearGradient.setAttribute("x1", "0%");
        linearGradient.setAttribute("y1", "0%");
        linearGradient.setAttribute("x2", "100%");
        linearGradient.setAttribute("y2", "0%");
        linearGradient.setAttribute("gradientTransform", `rotate(${startAngle + 90}, 0.5, 0.5)`);

        const stop1 = document.createElementNS(svgNS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("style", `stop-color:${color};stop-opacity:1`);
        linearGradient.appendChild(stop1);

        const stop2 = document.createElementNS(svgNS, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("style", `stop-color:${lightenColor(color, 0.5)};stop-opacity:1`);
        linearGradient.appendChild(stop2);

        parent.appendChild(linearGradient);
    }


}

function createRadialBars(parent: SVGGElement, rot: number, rInner: number, rOuter: number, values: number[]) {
    const cx = svg.viewBox.baseVal.width / 2;
    const cy = svg.viewBox.baseVal.height / 2;
    const angleStep = 360 / values.length;

    values.forEach((value, i) => {
        const startAngle = i * angleStep + rot;
        const startRad = startAngle * Math.PI / 180;
        const endAngle = (i + 1) * angleStep + rot;
        const endRad = endAngle * Math.PI / 180;
        const rOuter = rInner + (rOuterMax - rInner) * (value / 100);
        const x1Inner = cx + rInner * Math.cos(startRad);
        const y1Inner = cy + rInner * Math.sin(startRad);
        const x2Inner = cx + rInner * Math.cos(endRad);
        const y2Inner = cy + rInner * Math.sin(endRad);
        const x2Outer = cx + rWedge * Math.cos(endRad);
        const y2Outer = cy + rWedge * Math.sin(endRad);
        const x1Outer = cx + rWedge * Math.cos(startRad);
        const y1Outer = cy + rWedge * Math.sin(startRad);

        const path = `
            M${x1Inner},${y1Inner}
            A${rInner},${rInner} 0 0,1 ${x2Inner},${y2Inner}
            L${x2Outer},${y2Outer}
            A${rWedge},${rWedge} 0 0,0 ${x1Outer},${y1Outer}
            Z`;

        const wedge = document.createElementNS(svgNS, "path");
        wedge.setAttribute("d", path);
        wedge.setAttribute("fill", `url(#gradient-${i})`);
        wedge.setAttribute("stroke", "#C2E4FF");
        wedge.setAttribute("stroke-width", "1");
        parent.appendChild(wedge);
    });
}


function lightenColor(hex: string, factor: number) {
    hex = hex.replace("#", "");
    const r = Math.min(255, Math.round(parseInt(hex.slice(0, 2), 16) * (1 + factor)));
    const g = Math.min(255, Math.round(parseInt(hex.slice(2, 4), 16) * (1 + factor)));
    const b = Math.min(255, Math.round(parseInt(hex.slice(4, 6), 16) * (1 + factor)));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function assertNotNull<T>(value: T, msg?: string): asserts value is NonNullable<T> {
    if (value == null) throw new Error(msg);
}