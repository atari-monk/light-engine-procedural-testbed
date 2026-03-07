import { createBox, renderBox, updateBox, type BoxState } from "./box";

const LANES_Y = [200, 220, 240, 260];

export type BoxFactoryState = {
    boxes: BoxState[];
    conveyorStartX: number;
    conveyorEndX: number;
    spawnInterval: number;
    spawnTimer: number;
};

export function createBoxFactory(
    startX: number,
    endX: number,
    spawnInterval = 1.0
): BoxFactoryState {
    return {
        boxes: [],
        conveyorStartX: startX,
        conveyorEndX: endX,
        spawnInterval,
        spawnTimer: 0
    };
}

export function updateBoxFactory(factory: BoxFactoryState, dt: number) {
    for (const box of factory.boxes) {
        updateBox(box, dt, factory.conveyorStartX, factory.conveyorEndX);
    }

    factory.boxes = factory.boxes.filter(box => box.x < factory.conveyorEndX);

    factory.spawnTimer += dt;
    if (factory.spawnTimer >= factory.spawnInterval) {
        factory.spawnTimer -= factory.spawnInterval;

        const laneIndex = Math.floor(Math.random() * 4);
        const y = LANES_Y[laneIndex];
        const box = createBox(factory.conveyorStartX, y, 20, 80);
        factory.boxes.push(box);
    }
}

export function renderBoxFactory(factory: BoxFactoryState, ctx: CanvasRenderingContext2D) {
    for (const box of factory.boxes) {
        renderBox(box, ctx);
    }
}