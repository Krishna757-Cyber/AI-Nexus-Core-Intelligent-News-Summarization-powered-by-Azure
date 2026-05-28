from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
import os
import uvicorn

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/{filename}")
async def serve_static(filename: str):
    if os.path.exists(filename):
        return FileResponse(filename)
    return {"error": "File not found"}

if __name__ == "__main__":
    print("🚀 App running at http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)