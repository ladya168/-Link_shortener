from pydantic import BaseModel, HttpUrl


class MappedBase(BaseModel):
    slug: str
    long_url: HttpUrl


