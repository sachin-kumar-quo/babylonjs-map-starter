import React, { useEffect, useRef } from "react";
import {
  Engine,
  Scene} from "@babylonjs/core";

function CuboidWithTexture(props) {
  const canvasRef = useRef(null);
  const {
    canvasId,
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    screenshot,
    ...rest
  } = props;

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Engine(
      canvasRef.current,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce(onSceneReady);
    }
    engine.runRenderLoop(() => {
      onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady
  ]);

  return <canvas className="canvas" id={canvasId} ref={canvasRef} {...rest} />;
}
export default CuboidWithTexture;