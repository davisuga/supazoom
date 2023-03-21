import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { createEffect, createSignal, onCleanup } from "solid-js";
import "./App.css";

type ZoomOptions = {
  level: number;
}
function App() {
  const [currentFrame, setCurrentFrame] = createSignal<string>()
  const [zoomOptions, setZoomOptions] = createSignal<ZoomOptions>()


  createEffect(async () => {
    await invoke('start_recording')
    const unlisten = await listen<{src: string}>('frame', (event) => {
      // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
      // event.payload is the payload object
      setCurrentFrame(event.payload.src);
    })
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

    onCleanup(() => unlisten());
  })
  
  return (
    <div class="container">
      {currentFrame() ? <img src={currentFrame()} /> : <h1>Waiting for first frame...</h1>}
    </div>
  );
}

export default App;
