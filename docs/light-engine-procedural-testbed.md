# **Light Engine Procedural Testbed**

`light-engine-procedural-testbed` is a project with engine library, game for it, to test and prototype new stuff.  
It is rewritten from light-engine-oop.  

## Table of Contents <a id="toc"></a>

- [**Configuration**](#configuration)
- [**Prototyping**](#prototyping)
  * [**Player**](#player)
- [**Page**](#page)
  * [**Index**](#index) **/** [**Style**](#style)
- [**Game**](#game)
  * [**Game Logic**](#game-logic) **/** [**Main**](#main)

## Configuration <a id="configuration"></a>

### Typescript Config 

tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": [
            "ES2022",
            "DOM",
            "DOM.Iterable"
        ],
        "types": [
            "vite/client"
        ],
        "skipLibCheck": true,
        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "noEmit": true,
        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": false,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true
    },
    "include": [
        "src"
    ]
}
```

### Package Config

package.json

```json
{
    "name": "light-engine-procedural-testbed",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
    },
    "devDependencies": {
        "typescript": "~5.9.3",
        "vite": "^8.0.0-beta.13"
    },
    "pnpm": {
        "overrides": {
            "vite": "^8.0.0-beta.13"
        }
    },
    "dependencies": {
        "light-engine-procedural": "^0.0.2"
    },
    "packageManager": "pnpm@10.30.3+sha512.c961d1e0a2d8e354ecaa5166b822516668b7f44cb5bd95122d590dd81922f606f5473b6d23ec4a5be05e7fcd18e8488d47d978bbe981872f1145d06e9a740017"
}
```

### Git Config

.gitignore

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

[⬆ Table of Contents](#toc)

## Prototyping <a id="prototyping"></a>

### Player <a id="player"></a>

src/player.ts

```ts
import { Input } from "minimal-engine-lib";

export type PlayerState = {
    x: number;
    y: number;

    prevX: number;
    prevY: number;

    speed: number;
    size: number;
};

export function createPlayer(
    x = 100,
    y = 200,
    speed = 200,
    size = 50
): PlayerState {
    return {
        x,
        y,
        prevX: x,
        prevY: y,
        speed,
        size,
    };
}

export function updatePlayer(
    state: PlayerState,
    dt: number,
    input: Input
): boolean {
    state.prevX = state.x;
    state.prevY = state.y;

    let dx = 0;
    let dy = 0;

    if (input.isDown("ArrowRight")) dx += 1;
    if (input.isDown("ArrowLeft")) dx -= 1;
    if (input.isDown("ArrowUp")) dy -= 1;
    if (input.isDown("ArrowDown")) dy += 1;

    if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy);

        dx /= length;
        dy /= length;

        state.x += dx * state.speed * dt;
        state.y += dy * state.speed * dt;

        return true;
    }

    return false;
}

export function renderPlayer(
    state: PlayerState,
    ctx: CanvasRenderingContext2D,
    alpha: number
) {
    const interpolatedX =
        state.prevX + (state.x - state.prevX) * alpha;

    const interpolatedY =
        state.prevY + (state.y - state.prevY) * alpha;

    ctx.fillStyle = "red";
    ctx.fillRect(
        interpolatedX,
        interpolatedY,
        state.size,
        state.size
    );
}
```

src/oop/player.ts

```ts
import {
    PlayerState,
    createPlayer,
    updatePlayer,
    renderPlayer
} from "../player";

import { Input } from "minimal-engine-lib";

export class Player {
    private state: PlayerState;

    constructor(
        x = 100,
        y = 200,
        speed = 200,
        size = 50
    ) {
        this.state = createPlayer(x, y, speed, size);
    }

    update(dt: number, input: Input) {
        return updatePlayer(this.state, dt, input);
    }

    render(ctx: CanvasRenderingContext2D, alpha: number) {
        renderPlayer(this.state, ctx, alpha);
    }

    get x() {
        return this.state.x;
    }

    get y() {
        return this.state.y;
    }

    set x(value: number) {
        this.state.x = value;
    }

    set y(value: number) {
        this.state.y = value;
    }
}
```

[⬆ Table of Contents](#toc)

## Page <a id="page"></a>

### Index <a id="index"></a>

index.html   

```html
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>minimal-engine</title>
</head>

<div id="start-overlay">
    Click to Start
</div>
<canvas id="canvas"></canvas>

<body>
    <script type="module" src="/src/main.ts"></script>
</body>

</html>
```

[⬆ Table of Contents](#toc)

### Style <a id="style"></a>

src/style.css   

```css
html,
body {
    margin: 0;
    overflow: hidden;
    background: black;
    height: 100%;
}

canvas {
    display: none;
    width: 100%;
    height: 100%;
}

#start-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    z-index: 9999;
}
```

[⬆ Table of Contents](#toc)

## Game <a id="game"></a>

## Game Logic <a id="game-logic"></a>

### Procedural Game

src/game.ts  

Procedural game but uses oop wrappers.  

```ts
import type { Renderer, Input, Audio } from "light-engine-procedural";
import { Player } from "./oop/player";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
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
        player: new Player()
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

    state.player.render(
        state.renderer.ctx,
        alpha
    );
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}
```

[⬆ Table of Contents](#toc)

### OOP Game

src/oop/game.ts  

```ts
import { type IGame, Renderer, Input, Audio } from "light-engine-procedural";
import {
    type GameState,
    createGame,
    updateGame,
    renderGame,
    startGameMusic
} from "../game";

export class Game implements IGame {
    private state: GameState;

    constructor(
        renderer: Renderer,
        input: Input,
        audio: Audio
    ) {
        this.state = createGame(renderer, input, audio);
    }

    update(dt: number) {
        updateGame(this.state, dt);
    }

    render(alpha: number) {
        renderGame(this.state, alpha);
    }

    startMusic() {
        startGameMusic(this.state);
    }
}
```

[⬆ Table of Contents](#toc)

## Main <a id="main"></a>

Creates and runs engine and game.  

```ts
import "./style.css";
import {
    Renderer,
    Input,
    Audio,
    GameLoop
} from "light-engine-procedural";
import { Game } from "./oop/game";

const renderer = new Renderer("canvas");
const input = new Input();
const audio = new Audio();

const game = new Game(renderer, input, audio);

(async () => {
    await audio.load("move", "./sounds/move.wav");
    await audio.load("bg", "./sounds/bg.mp3");
})();

const overlay = document.getElementById("start-overlay");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

overlay?.addEventListener("click", async () => {
    overlay.style.display = "none";
    canvas.style.display = "block";

    await audio.playMusicAfterGesture("bg", 0.5);
});

const loop = new GameLoop(
    (dt) => game.update(dt),
    (alpha) => game.render(alpha)
);

loop.start();
```

[⬆ Table of Contents](#toc)
