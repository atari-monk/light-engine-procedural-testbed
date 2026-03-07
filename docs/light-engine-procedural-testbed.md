# **Light Engine Procedural Testbed**

`light-engine-procedural-testbed` is a project with engine library, game for it, to test and prototype new stuff.  
It is rewritten from light-engine-oop.  

## Table of Contents <a id="toc"></a>

- [**Configuration**](#configuration)
- [**Prototyping**](#prototyping)
  * [**Player**](#player) **/** [**Rect**](#rect) **/** [**Collision**](#collision) **/** [**Box**](#box) **/** [**Box Factory**](#box-factory)
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
    x = 960 - 25,
    y = 350,
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
import { Input } from "light-engine-procedural";
import {
    type PlayerState,
    createPlayer,
    updatePlayer,
    renderPlayer
} from "../player";

export class Player {
    private _state: PlayerState;

    get state() {
        return this._state;
    }

    constructor(
        x = 960 - 25,
        y = 350,
        speed = 200,
        size = 50
    ) {
        this._state = createPlayer(x, y, speed, size);
    }

    update(dt: number, input: Input) {
        return updatePlayer(this._state, dt, input);
    }

    render(ctx: CanvasRenderingContext2D, alpha: number) {
        renderPlayer(this._state, ctx, alpha);
    }

    get x() {
        return this._state.x;
    }

    get y() {
        return this._state.y;
    }

    set x(value: number) {
        this._state.x = value;
    }

    set y(value: number) {
        this._state.y = value;
    }
}
```

[⬆ Table of Contents](#toc)

### Rect <a id="rect"></a>

src/rect.ts  

```ts
export type RectState = {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};

export function createRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = "white"
): RectState {
    return {
        x,
        y,
        width,
        height,
        color
    };
}

export function renderRect(
    rect: RectState,
    ctx: CanvasRenderingContext2D
) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(
        rect.x,
        rect.y,
        rect.width,
        rect.height
    );
}
```

src/oop/rect.ts

```ts
import {
    type RectState,
    createRect,
    renderRect
} from "../rect";

export class Rect {
    private _state: RectState;

    get state() {
        return this._state;
    }

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color = "white"
    ) {
        this._state = createRect(x, y, width, height, color);
    }

    render(ctx: CanvasRenderingContext2D) {
        renderRect(this._state, ctx);
    }
}
```

[⬆ Table of Contents](#toc)

### Collision <a id="collision"></a>

src/collision.ts  

AABB Helper  

```ts
import { type PlayerState } from "./player";
import { type RectState } from "./rect";

function intersects(
    px: number,
    py: number,
    ps: number,
    rect: RectState
) {
    return (
        px < rect.x + rect.width &&
        px + ps > rect.x &&
        py < rect.y + rect.height &&
        py + ps > rect.y
    );
}

export function resolvePlayerRectCollisions(
    player: PlayerState,
    rects: RectState[]
) {
    const size = player.size;

    for (const rect of rects) {
        if (!intersects(player.x, player.y, size, rect)) continue;

        if (player.x > player.prevX) {
            player.x = rect.x - size;
        } else if (player.x < player.prevX) {
            player.x = rect.x + rect.width;
        }
    }

    for (const rect of rects) {
        if (!intersects(player.x, player.y, size, rect)) continue;

        if (player.y > player.prevY) {
            player.y = rect.y - size;
        } else if (player.y < player.prevY) {
            player.y = rect.y + rect.height;
        }
    }
}
```

[⬆ Table of Contents](#toc)

### Box <a id="box"></a>

```ts
import {
    type RectState,
    createRect,
    renderRect
} from "./rect";

export type BoxState = RectState & {
    speed: number;
};

export function createBox(
    x: number,
    y: number,
    size = 20,
    speed = 40
): BoxState {
    return {
        ...createRect(
            x,
            y,
            size,
            size,
            "rgba(255,0,0,.5)"
        ),
        speed
    };
}

export function updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number
) {
    box.x += box.speed * dt;

    if (box.x > endX) {
        box.x = startX;
    }
}

export function renderBox(
    box: BoxState,
    ctx: CanvasRenderingContext2D
) {
    renderRect(box, ctx);
}
```

[⬆ Table of Contents](#toc)

### Box Factory <a id="box-factory"></a>

It keeps box count on conveyor to max 6.  

```ts
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
    spawnInterval = 1.5
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

    while (factory.spawnTimer >= factory.spawnInterval && factory.boxes.length < 6) {
        factory.spawnTimer -= factory.spawnInterval;

        const laneIndex = Math.floor(Math.random() * LANES_Y.length);
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

### Game Logic <a id="game-logic"></a>

#### Procedural Game

src/game.ts  

Procedural game but uses oop wrappers.  

```ts
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
    const boxFactory = createBoxFactory(conveyorStartX, conveyorEndX);

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
```

[⬆ Table of Contents](#toc)

#### OOP Game

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

### Main <a id="main"></a>

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

    const loop = new GameLoop(
        (dt) => game.update(dt),
        (alpha) => game.render(alpha)
    );

    loop.start();
});
```

[⬆ Table of Contents](#toc)
