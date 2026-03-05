import {
    type RectState,
    createRect,
    renderRect
} from "../rect";

export class Rect {
    private state: RectState;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color = "white"
    ) {
        this.state = createRect(x, y, width, height, color);
    }

    render(ctx: CanvasRenderingContext2D) {
        renderRect(this.state, ctx);
    }
}