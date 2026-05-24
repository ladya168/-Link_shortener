from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from config import settings


engine = create_async_engine(settings.db_url)
Session = async_sessionmaker(engine)

class DefBase(DeclarativeBase):
    pass

class DB(DefBase):
    __tablename__ = "Links"
    slug: Mapped[str] = mapped_column(primary_key=True)
    long_url: Mapped[str | None] = None
    special: Mapped[bool] = mapped_column(default=False)

async def drop_all():
    async with engine.begin() as conn:
        await conn.run_sync(DefBase.metadata.drop_all)

async def create_all():
    async with engine.begin() as conn:
        await conn.run_sync(DefBase.metadata.create_all)