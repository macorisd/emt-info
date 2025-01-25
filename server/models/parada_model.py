from pydantic import BaseModel, Field


class Parada(BaseModel):
    codLinea: int = Field(default=None, description="Número de línea")
    nombreLinea: str = Field(default=None, description="Nombre de la línea")
    sentido: int = Field(default=None, description="Sentido del recorrido (1=ida, 2=vuelta)")
    nombreParada: str = Field(default=None, description="Nombre de la parada")
    lon: float = Field(default=None, description="Longitud GPS de la parada")
    lat: float = Field(default=None, description="Latitud GPS de la parada")


class ParadaCreate(BaseModel):
    codLinea: int = Field(default=None, description="Número de línea")
    nombreLinea: str = Field(default=None, description="Nombre de la línea")
    sentido: int = Field(default=None, description="Sentido del recorrido (1=ida, 2=vuelta)")
    nombreParada: str = Field(default=None, description="Nombre de la parada")
    lon: float = Field(default=None, description="Longitud GPS de la parada")
    lat: float = Field(default=None, description="Latitud GPS de la parada")


class ParadaUpdate(BaseModel):
    codLinea: int | None = Field(default=None, description="Número de línea")
    nombreLinea: str | None = Field(default=None, description="Nombre de la línea")
    sentido: int | None = Field(default=None, description="Sentido del recorrido (1=ida, 2=vuelta)")
    nombreParada: str | None = Field(default=None, description="Nombre de la parada")
    lon: float | None = Field(default=None, description="Longitud GPS de la parada")
    lat: float | None = Field(default=None, description="Latitud GPS de la parada")


class ParadaDeleteResponse(BaseModel):
    details: str = "La parada se ha eliminado correctamente."
