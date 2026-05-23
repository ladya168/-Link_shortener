from fastapi import FastAPI

from DB import generate_slugs, drop_all, create_all
from router import router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await drop_all()
    print("dropping all tables")
    await create_all()
    print("creating all tables")
    await generate_slugs()
    print("generating slugs")
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(router)