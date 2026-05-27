from fastapi import FastAPI
from DB import drop_all, create_all
from DB_requests import generate_slugs
from router import router
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("dropping all tables")
    await drop_all()
    print("creating all tables")
    await create_all()
    print("generating slugs")
    await generate_slugs()
    yield
    print("App stopped")
    await drop_all()


app = FastAPI(lifespan=lifespan)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)