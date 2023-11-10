// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use base64::{ Engine, engine::general_purpose};
use screenshots::Screen;
use autopilot::mouse;
use tauri::{Window};
use std::thread;


#[derive(Clone, serde::Serialize)]
struct MouseLocationPayload {
  x: f64,
  y: f64
}
// #[derive(Clone, serde::Serialize)]
// struct ImgCapturePayload {
//   src: String,
// }

#[tauri::command]
fn start_recording(window: Window) {
  std::thread::spawn(move || {
    loop {
        let autopilot::geometry::Point {y, x} = mouse::location();
        // let screen = Screen::from_point(x as i32, y as i32).expect("Failed to get screen");
        // let PhysicalSize {width, height}=window.inner_size().unwrap();
        // let img = screen.capture_area(x as i32, y as i32, width/10, height/10).expect("Failed to capture screen");
        // let buf=img.buffer();
        // let base64 = general_purpose::STANDARD.encode(buf);
        // let payload = ImgCapturePayload { src: format!("data:image/png;base64,{}", base64) };
        window.emit("mouse_location", Some(MouseLocationPayload {x, y})).expect("Failed to send mouse location");
        // thread::sleep(std::time::Duration::from_millis(8));
    }
  });
}
fn main() {
     
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_recording])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
