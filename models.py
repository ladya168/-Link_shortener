
from pydantic import BaseModel, Field


class MappedBase(BaseModel):
    slug: str = Field(  # внутреннее имя
        ...,
        alias="special_slug",  # 🔥 имя в JSON от фронтенда
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9\-_]+$"
    )
    long_url: str

class LongUrl(BaseModel):
    long_url: str

