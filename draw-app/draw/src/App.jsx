import { useRef, useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";

function App() {
  const canvasRef = useRef(null);

  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [eraser, setEraser] = useState(false);
  const [dark, setDark] = useState(false);

  // ===== CANVAS SETUP =====
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.75;

    ctx.lineCap = "round";

    const handleBegin = ({ x, y, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleDraw = ({ x, y, color, size }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    socket.on("begin", handleBegin);
    socket.on("draw", handleDraw);
    socket.on("clear", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("begin", handleBegin);
      socket.off("draw", handleDraw);
    };
  }, []);

  // ===== DRAW START =====
  const startDraw = (e) => {
    saveState();

    const { x, y } = getXY(e);
    const ctx = canvasRef.current.getContext("2d");

    const drawColor = eraser ? "#ffffff" : color;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x, y);

    socket.emit("begin", { x, y, color: drawColor, size });
    setDrawing(true);
  };

  // ===== DRAW MOVE =====
  const draw = (e) => {
    if (!drawing) return;

    const { x, y } = getXY(e);
    const ctx = canvasRef.current.getContext("2d");

    const drawColor = eraser ? "#ffffff" : color;

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("draw", { x, y, color: drawColor, size });
  };

  const stopDraw = () => setDrawing(false);

  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // ===== SAVE STATE =====
  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    undoStack.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );

    redoStack.current = [];
  };

  // ===== UNDO =====
  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!undoStack.current.length) return;

    redoStack.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );

    ctx.putImageData(undoStack.current.pop(), 0, 0);
  };

  // ===== REDO =====
  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!redoStack.current.length) return;

    undoStack.current.push(
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    );

    ctx.putImageData(redoStack.current.pop(), 0, 0);
  };

  // ===== CLEAR =====
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit("clear");
  };

  // ===== SAVE IMAGE =====
  const saveImage = () => {
    const url = canvasRef.current.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.png";
    a.click();
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="floating-toolbar">

        <input
          type="color"
          onChange={e => setColor(e.target.value)}
        />

        <input
          type="range"
          min="1"
          max="20"
          value={size}
          onChange={e => setSize(e.target.value)}
        />

        <button onClick={() => setEraser(!eraser)}>
          {eraser ? "Brush" : "Eraser"}
        </button>

        <button onClick={undo}>Undo</button>

        <button onClick={redo}>Redo</button>

        <button onClick={clearCanvas}>Clear</button>

        <button onClick={saveImage}>Save</button>

        <button onClick={() => setDark(!dark)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>

      </div>

      <canvas
        ref={canvasRef}
        className="canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />
    </div>
  );
}

export default App;
