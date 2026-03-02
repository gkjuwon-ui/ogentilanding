"""Ogenti Platform — Main Server (Vercel Serverless)"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .auth import router as auth_router
from .billing import router as billing_router
from .api_keys import router as keys_router
from .training import router as training_router

# ── App ──
app = FastAPI(
    title="Ogenti Platform",
    description="AI-to-AI Communication Protocol — Training Platform",
    version="0.1.0",
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ogenti.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──
app.include_router(auth_router)
app.include_router(billing_router)
app.include_router(keys_router)
app.include_router(training_router)


# ── Health ──
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "ogenti-platform", "version": "0.1.0"}


# ── Init DB on startup ──
@app.on_event("startup")
async def startup():
    init_db()
    print("◆ OGENTI PLATFORM — ONLINE ◆")
