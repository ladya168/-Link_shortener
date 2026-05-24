import random
import string

from pydantic import HttpUrl, ValidationError

all_chars = string.digits + string.ascii_letters

def generate_random_slug(): #-> str
    slug: str = ''
    for _ in range(6):
        slug += random.choice(all_chars)

    return str(slug)

def validate_url(url: str):
    try:
     HttpUrl(url)
     return True
    except ValidationError:
        return False
