import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { createEffect, createSignal, onCleanup } from "solid-js";
import "./App.css";

type ZoomOptions = {
  level: number;
}

type MouseLocation = {
  x: number;
  y: number;
}

function startCapture(displayMediaOptions: DisplayMediaStreamOptions | undefined) {
  return navigator.mediaDevices
    .getDisplayMedia(displayMediaOptions)
    .catch((err) => {
      console.error(err);
      return null;
    });
}


function App() {
  const [currentFrame, setCurrentFrame] = createSignal<string>()
  const [zoomOptions, setZoomOptions] = createSignal<ZoomOptions>()
  const [mouseLocation, setMouseLocation] = createSignal<MouseLocation>({x: 0, y: 0})

  createEffect(async () => {
    await invoke('start_recording')
    // const mediaStream = startCapture({ video: true, audio: false })
    const unlisten = await listen<MouseLocation>('mouse_location', (event) => {
      // console.log(event)
      // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
      // event.payload is the payload object
      setMouseLocation(event.payload);
    })
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

    onCleanup(() => unlisten());
  })
  
  return (
    <div class="container">
      {/* {currentFrame() ? <img src={currentFrame()} /> : <h1>Waiting for first frame...</h1>} */}
      <h1>
        
        {`Mouse Location: ${mouseLocation()?.x}, ${mouseLocation()?.y}`}
        
      </h1>

    </div>
  );
}

export default App;
