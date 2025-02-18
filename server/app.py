from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware

from paradas_v1 import router as paradas_v1_router
from multimedia_v1 import router as multimedia_v1_router
from users_v1 import router as users_v1_router

app = FastAPI()
app.title = "EMTInfo"
app.version = "1.0.0"
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lista de orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

app.include_router(paradas_v1_router, prefix="/api/v1")
app.include_router(multimedia_v1_router, prefix="/api/v1")
app.include_router(users_v1_router, prefix="/api/v1")