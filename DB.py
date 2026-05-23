from random import choice
from sqlite3 import IntegrityError
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from service import all_chars

engine = create_async_engine("sqlite+aiosqlite:///:database.db")

Session = async_sessionmaker(engine)

class DefBase(DeclarativeBase):
    pass

class DB(DefBase):
    __tablename__ = "Links"
    slug: Mapped[str] = mapped_column(primary_key=True)
    long_url: Mapped[str | None] = None
    special: Mapped[bool] = False

async def drop_all():
    async with engine.begin() as conn:
        await conn.run_sync(DefBase.metadata.create_all)

async def create_all():
    async with engine.begin() as conn:
        await conn.run_sync(DefBase.metadata.create_all)

async def generate_slugs():
    for _ in range(1000000000):
        async with Session() as session:
            slug = choice(all_chars)
            print(slug)
            query = DB(slug=slug)
            try:
                session.add(query)
                await session.commit()
            except IntegrityError:
                await session.rollback()



async def get_slug_from_long_url(long_url: str):
    async with Session() as session:
        query = select(DB.slug).where(DB.long_url == long_url).where(DB.special == False)
        result = await session.execute(query)
        slug = result.scalars().one_or_none()
        return slug

async def add_long_url(long_url: str):
    async with Session() as session:
        query = update(DB).where(DB.long_url == None ).values(long_url = long_url)
        await session.execute(query)
        await session.commit()
        return True

async def add_special_url(long_url: str, special_url: str):
    async with Session() as session:
        try:
            query = DB(long_url = long_url, slug = special_url, special = True)
            session.add(query)
            await session.commit()
            return True
        except IntegrityError:
            await session.rollback()
            return False