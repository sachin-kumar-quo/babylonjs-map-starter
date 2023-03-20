import React, { useRef, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import html2canvas from "html2canvas";
import "./App.css";
import "leaflet/dist/leaflet.css";
import CuboidWithTexture from "./CuboidWithTexture";

import {
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  Texture,
  StandardMaterial
} from "@babylonjs/core";

const defaultCenter = [38.9072, -77.0369];
const defaultZoom = 8;

function App() {
  const [screenshot, setScreenshot] = useState();
  const mapRef = useRef();

  let box;

  const onSceneReady = (scene) => {
    var camera = new FreeCamera(
      "camera1",
      new Vector3(0, 5, -10),
      scene
    );
    camera.setTarget(Vector3.Zero());
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
    var light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;
    box = MeshBuilder.CreateBox("cuboid", { size: 3 }, scene);
    box.position.y = 1;
    const texture = new Texture(screenshot, scene);
    const material = new StandardMaterial("texture", scene);
    material.diffuseTexture = texture;
    box.material = material;
  };

  const onRender = (scene) => {
    if (box !== undefined) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 10;
      box.rotation.y +=
        (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
  };

  async function handleScreenshot() {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;
    const canvas = await html2canvas(map.getContainer(), {
      useCORS: true,
      allowTaint: true
    });
    let dataurl = canvas.toDataURL("image/png");
    setScreenshot(dataurl);
  }

  return (
    <div className="App">
      <Map ref={mapRef} center={defaultCenter} zoom={defaultZoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
      <div className="sidebar">
        <p>
          <button onClick={handleScreenshot}>Take Screenshot</button>
        </p>
      </div>
      {screenshot && (
        <div className="modal">
          <div className="close" ><a href="#" className="cross" onClick={()=>setScreenshot(null)}/></div>
          <CuboidWithTexture
            canvasId="babylon-canvas"
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
          />
        </div>
      )}
    </div>
  );
}

export default App;
