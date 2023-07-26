<template>
    <div
        className="flex h-fit flex-col-reverse items-center justify-center gap-4 md:flex-row"
    >
        <div className="relative h-1/2 w-full flex-1 px-4 py-8 ">
            <span
                className="absolute left-4 top-0 mx-auto text-xs font-bold text-text md:text-base"
            >
                *Balls in play 4/15
            </span>

            <div
                className="flex h-full flex-col gap-4 rounded-md bg-primary p-4 text-text md:justify-between betaction_back"
            >
                <div className="flex flex-col gap-2">
                    <div
                        className="flex flex-row items-stretch gap-1 md:flex-col"
                    >
                        <div className="w-full text-sm font-bold md:text-base">
                            <div
                                className="flex flex-1 items-stretch justify-between"
                            >
                                <span>Bet amount</span>
                                <div className="flex items-center gap-1">
                                    <div
                                        className="rounded-full bg-purpleDark p-0.5"
                                    >
                                        <CurrencyDollarSimple weight="bold" />
                                    </div>
                                    <span>23</span>
                                </div>
                            </div>
                            <div
                                className="flex items-stretch justify-center shadow-md"
                            >
                                <input
                                    type="number"
                                    v-model="count"
                                    className="w-full rounded-bl-md rounded-tl-md border-2 border-secondary bg-background p-2.5 px-4 font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none md:p-2"
                                />
                                <button
                                    @click="halfDivide()"
                                    className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:right-0 write-coler after:top-[calc(50%_-_8px)] after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-2"
                                >
                                    ½
                                </button>
                                <button
                                    @click="double()"
                                    className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:right-0 write-coler after:top-[calc(50%_-_8px)] after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-2"
                                >
                                    2x
                                </button>
                                <button
                                    className="rounded-br-md rounded-tr-md border-2 border-transparent bg-secondary p-2 px-3 text-xs transition-colors  write-coler hover:bg-secondary/80 focus:border-purple focus:outline-none"
                                >
                                    max
                                </button>
                            </div>
                        </div>

                        <button
                            className="block rounded-md bg-purple px-2 py-4 text-sm font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:hidden"
                        >
                            Apostar
                        </button>
                    </div>
                    <select
                        defaultValue="{16}"
                        className="w-full rounded-md border-2 border-secondary bg-background px-4 py-2 font-bold transition-all placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none disabled:line-through disabled:opacity-80"
                        id="lines"
                    >
                        <!-- {linesOptions.map(line => ( -->
                        <option key="{line}" value="{line}">14 Line</option>
                        <option key="{line}" value="{line}">9 Line</option>
                        <option key="{line}" value="{line}">10 Line</option>
                        <option key="{line}" value="{line}">11 Line</option>
                        <option key="{line}" value="{line}">12 Line</option>
                        <option key="{line}" value="{line}">13 Line</option>
                        <!-- ))} -->
                    </select>
                </div>
                <button
                    @click="addBall()"
                    className="hidden rounded-md bg-purple px-6 py-5 font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:visible md:block"
                >
                    Apostar
                </button>
            </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
            <div id="plinko" ref="plinkoDiv"></div>
        </div>
    </div>
</template>

<script lang="ts">
import Matter, {
    Engine,
    Render,
    World,
    Runner,
    Bodies,
    Composite,
    Events,
    Body,
} from "matter-js";
import * as PIXI from "pixi.js";

const SCENE_SCALE = 1.5;

export default {
    data() {
        return {
            worldWidth: 800,
            startPins: 3,
            pinLines: 14,
            pinSize: 1 * SCENE_SCALE,
            pinGap: 15 * SCENE_SCALE,
            ballSize: 4 * SCENE_SCALE,
            ballElastity: 1,
            engine: null,
            world: null,
            pins: [],
            lines: [],
            balls: [],
            startPoint: { x: this.worldWidth / 2 - 1, y: 100 },
            app: new PIXI.Application({
                backgroundAlpha: 0,
                antialias: true,
            }),
            container: new PIXI.Container(),
        };
    },

    setup(props) {},

    methods: {
        addBall() {
            const ballBody = Bodies.circle(
                this.startPoint.x,
                this.startPoint.y,
                this.ballSize,
                {
                    id: "ball",
                    floorCount: 0,
                    restitution: this.ballElastity,
                    frictionAir: 0.07,
                    // friction: 0,
                    // density: 1,
                }
            );

            ballBody.collisionFilter.group = -1;
            Composite.add(this.world, [ballBody]);

            const pixiBall = new PIXI.Graphics();
            pixiBall.beginFill(0xffffff, 1);
            pixiBall.drawCircle(0, 0, this.ballSize);
            pixiBall.pivot.set(0.5, 0.5);

            this.container.addChild(pixiBall);
            const pathData = this.generateRandomPath();

            this.drawLine(pathData.targetPinX);

            this.balls.push({
                body: ballBody,
                shape: pixiBall,
                ...pathData,
            });

            this.ballCount++;
        },

        // initTarget() {
        //     let targetPin = 1;
        //     path.forEach((direction: string, index: number) => {
        //         if (index) {
        //             if (this.path[index - 1] === "R") {
        //                 targetPin++;
        //             }
        //         }
        //         this.targetPinX.push(
        //             this.worldWidth / 2 -
        //                 ((index + 2) * this.pinGap) / 2 +
        //                 targetPin * this.pinGap
        //         );
        //         this.targetPins.push(targetPin);
        //     });
        // },

        addPins() {
            for (let l = 0; l < this.pinLines; l++) {
                const linePins = this.startPins + l;
                const lineWidth = (linePins - 1) * this.pinGap;

                const pin2 = new PIXI.Graphics();

                for (let i = 0; i < linePins; i++) {
                    // const color = this.targetPins[l] === i ? "#333" : "#fff";

                    const color = "#fff";
                    const pin = Bodies.circle(
                        this.worldWidth / 2 - lineWidth / 2 + i * this.pinGap,
                        150 + l * this.pinGap,
                        this.pinSize,
                        {
                            id: i,
                            floor: l,
                            isStatic: true,
                            render: {
                                fillStyle: color,
                                strokeStyle: color,
                                lineWidth: 1,
                            },
                        }
                    );

                    this.pins.push(pin);

                    pin2.beginFill(color, 1);
                    pin2.drawCircle(
                        this.worldWidth / 2 - lineWidth / 2 + i * this.pinGap,
                        150 + l * this.pinGap,
                        2
                    );

                    this.container.addChild(pin2);
                }
            }
            Composite.add(this.world, this.pins);
        },

        render() {
            Engine.run(this.engine);
            this.$refs.plinkoDiv.appendChild(this.app.view);
            this.app.stage.addChild(this.container);
        },

        addEvent() {
            const balls = this.balls;

            const pinLines = this.pinLines;
            const world = this.world;

            Events.on(this.engine, "afterUpdate", function (event) {
                balls.forEach((object, index) => {
                    const { path, targetPinX } = object;

                    const ball = object.body;

                    const { floorCount } = ball;

                    if (floorCount === pinLines - 1) {
                        if (path[floorCount] === "R") {
                            if (ball.position.x <= targetPinX[floorCount]) {
                                ball.position.x = targetPinX[floorCount] + 1;
                            }
                        } else {
                            if (ball.position.x >= targetPinX[floorCount]) {
                                ball.position.x = targetPinX[floorCount] - 1;
                            }
                        }
                        if (ball.position.y > 600) {
                            balls.splice(index, 1);
                            World.remove(world, ball);
                            Composite.remove(world, ball);

                            object.shape.destroy();
                        }
                    } else {
                        const X = ball.position.x;
                        const Y = ball.position.y;
                        let posX = X;

                        const current = floorCount;

                        if (path[current] !== path[current + 1]) {
                            if (path[current] === "R") {
                                if (posX <= targetPinX[current]) {
                                    posX = targetPinX[current] + 1;
                                }
                                if (posX >= targetPinX[current + 1]) {
                                    posX = targetPinX[current + 1] - 1;
                                }
                            }
                            if (path[current] === "L") {
                                if (posX >= targetPinX[current]) {
                                    posX = targetPinX[current] - 1;
                                }
                                if (posX <= targetPinX[current + 1]) {
                                    posX = targetPinX[current + 1] + 1;
                                }
                            }
                        }
                        if (path[current] === path[current + 1]) {
                            if (path[current] === "R") {
                                if (posX <= targetPinX[current]) {
                                    posX = targetPinX[current] + 1;
                                }
                                if (posX <= targetPinX[current + 1]) {
                                    posX += 0.1;
                                }
                                if (
                                    // current !== pinLines - 2 &&
                                    posX >=
                                    targetPinX[current + 1] + 5
                                ) {
                                    posX = targetPinX[current + 1] + 5;
                                }
                            }
                            if (path[current] === "L") {
                                if (posX >= targetPinX[current]) {
                                    posX = targetPinX[current] - 1;
                                }

                                if (posX >= targetPinX[current + 1]) {
                                    posX -= 0.1;
                                }
                                if (
                                    // current !== pinLines - 2 &&
                                    posX <=
                                    targetPinX[current + 1] - 5
                                ) {
                                    posX = targetPinX[current + 1] - 5;
                                }
                            }
                        }
                        ball.position.x = posX;
                    }
                });
            });

            Events.on(this.engine, "collisionStart", function (event) {
                var pairs = event.pairs;
                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i];
                    if (pair.bodyA.id === "ball") {
                        if (pair.bodyB.floor > pair.bodyA.floorCount) {
                            pair.bodyA.floorCount = pair.bodyB.floor;
                        }
                    } else if (pair.bodyB.id === "ball") {
                        if (pair.bodyA.floor > pair.bodyB.floorCount) {
                            pair.bodyB.floorCount = pair.bodyA.floor;
                        }
                    }
                }
            });
        },

        generateRandomPath() {
            let newPath = [];
            let targetPin = 1;
            let targetPins = [1];
            let targetPinX = [400];

            for (let i = 0; i < this.pinLines; i++) {
                const randomVal = Math.random() > 0.5 ? "L" : "R";

                newPath.push(randomVal);

                if (i && randomVal === "R") {
                    targetPin++;
                }

                if (i !== this.pinLines - 1) {
                    targetPins.push(targetPin);

                    targetPinX.push(
                        this.worldWidth / 2 -
                            ((i + 3) * this.pinGap) / 2 +
                            targetPin * this.pinGap
                    );
                }
            }
            return { path: newPath, targetPins, targetPinX };
        },

        drawLine(xArray) {
            const line = new PIXI.Graphics();
            const hue = Math.random() * 360;
            const lightness = Math.random() * 75;
            const randomColor = `hsl(${hue}, 100%, ${25 + lightness}%)`;
            console.log(randomColor);

            line.lineStyle(1, randomColor, 1);
            line.moveTo(this.worldWidth / 2, 150);
            xArray.forEach((point, index) => {
                line.lineTo(point, 150 + index * this.pinGap);
            });

            this.container.addChild(line);
        },
    },

    mounted() {
        this.startPoint.x = this.worldWidth / 2;

        this.engine = Engine.create();
        this.world = this.engine.world;

        this.addPins();
        this.render();
        this.addEvent();

        this.app.ticker.add(() => {
            this.balls.forEach((ball, index) => {
                ball.shape.position = ball.body.position;
            });
        });
    },
};
</script>
