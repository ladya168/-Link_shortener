from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert

from DB import Session, DB
from service import generate_random_slug


async def generate_slugs():
    async with Session() as session:
        for i in range(100):
            if i % 10 == 0:
                print(f"{i}% finished")
            batch = []
            for _ in range(1000):
                batch.append(generate_random_slug())
                batch_dicts = [{"slug": slug, "long_url": None} for slug in batch]
            stmt = insert(DB).values(batch_dicts)
            stmt = stmt.on_conflict_do_nothing(index_elements=['slug'])
            await session.execute(stmt)
            await session.commit()
    print("Generating finished")



async def get_slug_from_long_url(long_url: str | None):
    print("Getting slug from long url")
    async with Session() as session:
        query = select(DB.slug).where(DB.long_url == long_url).where(DB.special == False)
        result = await session.execute(query)
        slug = result.scalars().first()
        return slug

async def add_long_url(slug: str, long_url: str):
    print("Adding long url")
    async with Session() as session:
        query = update(DB).where(DB.slug == slug).values(long_url = long_url)
        await session.execute(query)
        await session.commit()
        return True

async def add_special_url(long_url: str, special_url: str):
    print("Adding special url")
    async with Session() as session:
        uniqueness = (await session.execute(select(DB).where(DB.slug == special_url))).scalars().first()
        if not uniqueness:
            query = DB(long_url = long_url, slug = special_url, special = True)
            session.add(query)
            await session.commit()
            return special_url
        else:
            return False

async def get_long_url_to_slug(slug: str):
    print("Getting long url to slug")
    async with Session() as session:
        query = select(DB.long_url).where(DB.slug == slug)
        result = await session.execute(query)
        long_url = result.scalars().first()
        if long_url:
            return long_url
        else:
            return "Error: Long url not found"