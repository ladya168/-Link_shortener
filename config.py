from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_NAME: str
    SQLITE_DB_FILE: str

    @property
    def db_url(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    @property
    def db_url_sqlite(self):
        return f"sqlite+aiosqlite:///{self.SQLITE_DB_FILE}.db"

    model_config = SettingsConfigDict(env_file=".env")
settings = Settings()