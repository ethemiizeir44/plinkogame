import Matter, { Engine, Render, Runner, Bodies, Composite } from "matter-js";

export function useGame() {
  const count = useState('count', () => Math.round(Math.random() * 20))

  function gameStart() {
    
    const worldWidth = 800;
    const startPins = 3;
    const pinLines = 14;
    const pinSize = 1;
    const pinGap = 15;
    const ballSize = 5;
    const ballElastity = 0.8;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
      // element: document.querySelector("#plinko"),
      element: document.body,
      engine: engine
    });

    const pins: Matter.Body[] = [];
    for (let l = 0; l < pinLines; l++) {
      const linePins = startPins + l;
      const lineWidth = linePins * pinGap;
        for (let i = 0; i < linePins; i++) {
        const pin = Bodies.circle(
          worldWidth / 2 - lineWidth / 2 + i * pinGap,
          200   + l * pinGap,
          pinSize,
          {
            isStatic: true
          }
        );
      
        
        pins.push(pin);
      }
    }
    Composite.add(engine.world, pins);
    Engine.clear(engine)

    const ball = Bodies.circle(worldWidth / 2, 0, ballSize, {
      restitution: ballElastity
    });

    Composite.add(engine.world, [ball]);
    // engine.gravity.x = 0.2;
    engine.gravity.y = 2;
    engine.gravity.scale = 0.0003;
    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    document.body.addEventListener("click", (e) => {
      const ball = Bodies.circle(e.clientX, e.clientY-500, ballSize, {
        restitution: ballElastity
      });
      Composite.add(engine.world, [ball]);
    });
  }


  return {
    gameStart,
  }
}
