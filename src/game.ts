import type { Renderer, Input, Audio } from "light-engine-procedural";
import { Player } from "./oop/player";
import { Rect } from "./oop/rect";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    conveyorBelt: Rect;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    return {
        renderer,
        input,
        audio,
        player: new Player(),
        conveyorBelt: new Rect(400, 200, 120, 80, "blue")
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
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    state.renderer.clear();
    state.conveyorBelt.render(state.renderer.ctx);
    state.player.render(
        state.renderer.ctx,
        alpha
    );
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}