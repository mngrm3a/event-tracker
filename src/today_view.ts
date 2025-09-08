import { HOUR_LABEL_RADIUS, INNER_RADIUS, OUTER_RADIUS, RADIAL_BAR_OFFSET, ROTATION_OFFSET, SVG_NS, VALUE_LABEL_RADIUS } from "./constants";
import { createLinearGradient, polarToCartesian } from "./utils";

/**
 * TodayView
 *
 * Responsible for rendering the circular "today" chart: hour labels, value labels,
 * radial bar wedges and gradients. Use the static `create` factory to instantiate
 * and perform initial setup (gradients and hour labels). The constructor is private
 * to enforce creation via the factory which inlines previous `setup` behavior.
 */
export class TodayView {
    private cx: number; // Center x-coordinate of SVG
    private cy: number; // Center y-coordinate of SVG

    /**
     * Private constructor. Use `TodayView.create(...)` to instantiate and set up
     * the view (this mirrors the old `setup` method behavior).
     *
     * @param svg SVG root element
     * @param defs SVG <defs> element for gradients
     * @param timeLabels Group for hour labels
     * @param valueLabels Group for value labels
     * @param counterLabel Element for total count label
     * @param radialBars Group for radial bar wedges
     */
    private constructor(
        private svg: SVGSVGElement,
        private defs: SVGDefsElement,
        private timeLabels: SVGGElement,
        private valueLabels: SVGGElement,
        private counterLabel: SVGGElement,
        private radialBars: SVGGElement
    ) {
        // Calculate center of SVG from viewBox
        this.cx = svg.viewBox.baseVal.width / 2;
        this.cy = svg.viewBox.baseVal.height / 2;
    }

    /**
     * Factory that creates a TodayView instance and performs initial setup
     * (creates gradients and hour labels).
     *
     * @param svg SVG root element
     * @param defs SVG <defs> element for gradients
     * @param timeLabels Group for hour labels
     * @param valueLabels Group for value labels
     * @param counterLabel Element for total count label
     * @param radialBars Group for radial bar wedges
     * @param range Optional array of hour numbers (default: 0..23)
     * @returns Initialized TodayView instance
     */
    static create(
        svg: SVGSVGElement,
        defs: SVGDefsElement,
        timeLabels: SVGGElement,
        valueLabels: SVGGElement,
        counterLabel: SVGGElement,
        radialBars: SVGGElement,
        range: number[] = Array.from({ length: 24 }, (_, i) => i)
    ): TodayView {
        const instance = new TodayView(svg, defs, timeLabels, valueLabels, counterLabel, radialBars);
        instance.createGradients(ROTATION_OFFSET + 180, range.length);
        instance.createLabels(instance.timeLabels, HOUR_LABEL_RADIUS, range);
        return instance;
    }

    /**
     * Updates chart with new data values.
     * @param data Array of values (e.g., event counts per hour)
     */
    setData(data: number[]) {
        // Update total event count label
        this.counterLabel.textContent = data.reduce((a, b) => a + b, 0).toString();
        // Clear and re-create value labels
        this.valueLabels.replaceChildren();
        this.createLabels(this.valueLabels, VALUE_LABEL_RADIUS, data);
        // Clear and re-create radial bars
        this.radialBars.replaceChildren();
        this.createRadialBars(
            ROTATION_OFFSET + 180 - RADIAL_BAR_OFFSET,
            INNER_RADIUS,
            OUTER_RADIUS,
            data
        );
    }

    /**
     * Creates labels (hour or value) around the chart.
     * @param parent SVG group element to append labels
     * @param radius Distance from center for label placement
     * @param values Array of label values (numbers)
     */
    private createLabels(parent: SVGGElement, radius: number, values: number[]) {
        const step = 360 / values.length; // Angle between labels
        values.forEach((v, i) => {
            const angle = i * step; // Position label at correct angle
            const g = document.createElementNS(SVG_NS, "g");
            // Rotate and translate label to correct position, then rotate back for upright text
            g.setAttribute("transform", `rotate(${angle}) translate(0,${radius}) rotate(${-angle})`);
            const label = document.createElementNS(SVG_NS, "text");
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("dominant-baseline", "middle");
            label.textContent = v.toString();
            g.appendChild(label);
            parent.appendChild(g);
        });
    }

    /**
     * Creates linear gradients for each radial bar wedge.
     * @param rot Rotation offset for gradient direction
     * @param num Number of gradients to create
     */
    private createGradients(rot: number, num: number) {
        const step = 360 / num;
        for (let i = 0; i < num; i++) {
            // Each gradient is rotated to match its wedge
            this.defs.appendChild(createLinearGradient(`gradient-${i}`, i * step + rot));
        }
    }

    /**
     * Creates radial bar wedges for the chart.
     *
     *           y1Outer
     *          /
     *         /
     *        *-------- x2Outer
     *        |        ^
     *        |        |
     *        |   wedge height = rWedge - rInner
     *        |
     *   x1Inner ----*---- x2Inner
     *          startInner
     *
     * Each wedge is drawn as an SVG path between inner and outer radii.
     * @param rot Rotation offset for wedge alignment
     * @param rInner Inner radius for wedge start
     * @param rOuter Maximum outer radius for wedge end
     * @param values Array of values (determines wedge length)
     */
    private createRadialBars(rot: number, rInner: number, rOuter: number, values: number[]) {
        const step = 360 / values.length; // Angle per wedge
        const maxVal = Math.max(...values); // Maximum value for scaling

        values.forEach((val, i) => {
            // Calculate start and end angles for wedge
            const startAngle = i * step + rot;
            const endAngle = (i + 1) * step + rot;
            // Scale wedge length based on value
            const rWedge = rInner + (rOuter - rInner) * (val / maxVal);

            // Calculate Cartesian coordinates for wedge corners
            const { x: x1Inner, y: y1Inner } = polarToCartesian(this.cx, this.cy, rInner, startAngle);
            const { x: x2Inner, y: y2Inner } = polarToCartesian(this.cx, this.cy, rInner, endAngle);
            const { x: x2Outer, y: y2Outer } = polarToCartesian(this.cx, this.cy, rWedge, endAngle);
            const { x: x1Outer, y: y1Outer } = polarToCartesian(this.cx, this.cy, rWedge, startAngle);

            // SVG path for wedge: arc from start to end (inner), line to outer, arc back, close path
            const path = `M${x1Inner},${y1Inner} A${rInner},${rInner} 0 0,1 ${x2Inner},${y2Inner} L${x2Outer},${y2Outer} A${rWedge},${rWedge} 0 0,0 ${x1Outer},${y1Outer} Z`;
            const wedge = document.createElementNS(SVG_NS, "path");
            wedge.setAttribute("d", path);
            wedge.setAttribute("fill", `url(#gradient-${i})`);
            wedge.setAttribute("stroke", "#C2E4FF");
            wedge.setAttribute("stroke-width", "1"); // Wedge border width
            this.radialBars.appendChild(wedge);
        });
    }
}