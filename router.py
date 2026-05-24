from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from DB_requests import get_slug_from_long_url, add_long_url, add_special_url, get_long_url_to_slug
from service import validate_url

router = APIRouter()


@router.post("/")
async def add_slug(long_url: str):
    if validate_url(long_url):
        result = await get_slug_from_long_url(long_url)
        if not result:
            slug = await get_slug_from_long_url(result)
            if not slug:
                raise HTTPException(status_code=404, detail="slug not found")
            await add_long_url(slug, long_url)
            result = slug
    else:
        result = "Incorrect link"

    return {"Status": "Ok", "Body": f"http://127.0.0.1:8000/{str(result)}"}

@router.get("/{slug}")
async def redirect_to_url(slug: str):
    result = await get_long_url_to_slug(slug)
    if result:
        return RedirectResponse(url=result, status_code=302)
    else:
        raise HTTPException(status_code=404, detail="slug not found")

@router.post("/special")
async def add_special_slug(long_url: str, special_slug: str):
    if validate_url(long_url):
        result = await add_special_url(long_url, special_slug)
        return {"Status": "Ok", "Body": f"http://127.0.0.1:8000/{result}"}
    else:
        result = "Incorrect link"
        return {"Status": "nonOk", "Body": result}

