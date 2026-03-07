import type { Renderer, Input, Audio } from "light-engine-procedural";
import { Player } from "./oop/player";
import { Rect } from "./oop/rect";
import { resolvePlayerRectCollisions } from "./collision";
import type { RectState } from "./rect";
import { createBoxFactory, renderBoxFactory, updateBoxFactory, type BoxFactoryState } from "./box-factory";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    conveyorBelt: Rect;
    leftGate: Rect;
    rightGate: Rect;
    colliders: RectState[];
    conveyorStartX: number;
    conveyorEndX: number;
    boxFactory: BoxFactoryState;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    const conveyorBelt = new Rect(960 - 350, 200, 700, 80, "blue");
    const leftGate = new Rect(960 - 250 - 100, 200 - 10, 100, 100, "rgba(173, 216, 230, .5)");
    const rightGate = new Rect(960 + 250, 200 - 10, 100, 100, "rgba(173, 216, 230, .5)");

    const conveyorStartX = leftGate.state.x + leftGate.state.width / 2;
    const conveyorEndX = rightGate.state.x + rightGate.state.width / 2;
    const boxFactory = createBoxFactory(conveyorStartX, conveyorEndX, 1.0);

    return {
        renderer,
        input,
        audio,
        player: new Player(),
        conveyorBelt,
        leftGate,
        rightGate,
        colliders: [
            conveyorBelt.state,
            leftGate.state,
            rightGate.state,
            ...boxFactory.boxes
        ],
        conveyorStartX,
        conveyorEndX,
        boxFactory
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

    updateBoxFactory(state.boxFactory, dt);

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
    renderBoxFactory(state.boxFactory, state.renderer.ctx);
    state.player.render(
        state.renderer.ctx,
        alpha
    );
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}