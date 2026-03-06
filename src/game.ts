import type { Renderer, Input, Audio } from "light-engine-procedural";
import { Player } from "./oop/player";
import { Rect } from "./oop/rect";
import { resolvePlayerRectCollisions } from "./collision";
import { createBox, renderBox, updateBox, type BoxState } from "./box";
import type { RectState } from "./rect";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    conveyorBelt: Rect;
    leftGate: Rect;
    rightGate: Rect;
    boxes: BoxState[];
    colliders: RectState[];
    conveyorStartX: number;
    conveyorEndX: number;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    const boxes = [
        createBox(960 - 250 - 50 - 10, 200),
        createBox(960 - 250 - 50 - 10, 220),
        createBox(960 - 250 - 50 - 10, 240),
        createBox(960 - 250 - 50 - 10, 260)
    ];

    const conveyorBelt = new Rect(960 - 350, 200, 700, 80, "blue");
    const leftGate = new Rect(960 - 250 - 100, 200 - 10, 100, 100, "rgba(173, 216, 230, .5)");
    const rightGate = new Rect(960 + 250, 200 - 10, 100, 100, "rgba(173, 216, 230, .5)");

    const conveyorStartX = leftGate.state.x + leftGate.state.width / 2;
    const conveyorEndX = rightGate.state.x + rightGate.state.width / 2;

    return {
        renderer,
        input,
        audio,
        player: new Player(),
        conveyorBelt,
        leftGate,
        rightGate,
        boxes,
        colliders: [
            conveyorBelt.state,
            leftGate.state,
            rightGate.state,
            ...boxes
        ],
        conveyorStartX,
        conveyorEndX
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
    const moved = state.player.update(dt, state.input);

    if (moved) {
        state.audio.play("move");
    }

    for (const box of state.boxes) {
        updateBox(box, dt, state.conveyorStartX, state.conveyorEndX);
    }

    resolvePlayerRectCollisions(
        state.player.state,
        state.colliders
    );
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    state.renderer.clear();
    state.conveyorBelt.render(state.renderer.ctx);
    state.leftGate.render(state.renderer.ctx);
    state.rightGate.render(state.renderer.ctx);
    for (const box of state.boxes) {
        renderBox(box, state.renderer.ctx);
    }
    state.player.render(
        state.renderer.ctx,
        alpha
    );
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}