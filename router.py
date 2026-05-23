from fastapi import APIRouter

from DB import get_slug_from_long_url, add_long_url, add_special_url

router = APIRouter()


@router.get("/")
async def root(long_url: str):
    result = await get_slug_from_long_url(long_url)
    if not result:
        await add_long_url(long_url)
        result = await get_slug_from_long_url(long_url)

    return {"Status": "Ok", "Body": f"{str(result)}"}


@router.get("/{slug}")
async def redirect_to_url(slug: str):

    return {"ping": "pong"}

@router.post("/")
async def add_special_slug(long_url: str, special_slug: str):
    result = await add_special_url(long_url, special_slug)
    if result:
        return {"Status": "Ok", "Body": f"{special_slug}"}
    else:
        return {"Status": "NonOk"}