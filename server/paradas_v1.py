from typing import List
from fastapi import APIRouter, HTTPException, Query, Request, Path
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from models.parada_model import Parada, ParadaCreate, ParadaUpdate, ParadaDeleteResponse
from db_connection import DatabaseConnection
from api_utils import APIUtils

router = APIRouter()

endpoint_name = "paradas"
version = "v1"


@router.get("/" + endpoint_name, tags=["Paradas CRUD endpoints"], response_model=List[Parada])
async def get_paradas(
    request: Request,
    codLinea: int | None = Query(None, description="Código de la línea de autobús"),
    sentido: int | None = Query(None, description="Sentido de la línea (1 o 2)"),
    nombreParada: str | None = Query(None, description="Nombre de la parada"),
    fields: str | None = Query(None, description="Campos específicos a devolver"),
    sort: str | None = Query(None, description="Campos por los que ordenar, separados por comas"),
    offset: int = Query(default=0, description="Índice de inicio para los resultados de la paginación"),
    limit: int = Query(default=30, description="Cantidad de paradas a devolver, por defecto 30")
):
    """Obtener todas las paradas con filtros opcionales."""
    APIUtils.check_accept_json(request)

    try:
        projection = APIUtils.build_projection(fields)
        sort_criteria = APIUtils.build_sort_criteria(sort)

        query = {}
        if codLinea is not None:
            query["codLinea"] = codLinea
        if sentido is not None:
            query["sentido"] = sentido
        if nombreParada is not None:
            query["nombreParada"] = {"$regex": nombreParada, "$options": "i"}

        paradas = DatabaseConnection.query_document(
            "parada", query, projection, sort_criteria, offset, limit
        )
        total_count = DatabaseConnection.count_documents("parada", query)

        return JSONResponse(
            status_code=200,
            content=paradas,
            headers={"X-Total-Count": str(total_count)}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las paradas: {str(e)}")


@router.post("/" + endpoint_name, tags=["Paradas CRUD endpoints"], response_model=Parada)
async def create_parada(parada: ParadaCreate):
    """Crear una nueva parada."""
    try:
        parada_dict = parada.model_dump()
        parada_dict["_id"] = DatabaseConnection.create_document("parada", parada_dict)
        return JSONResponse(status_code=201, content=parada_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la parada: {str(e)}")


@router.put("/" + endpoint_name + "/{id}", tags=["Paradas CRUD endpoints"], response_model=Parada)
async def update_parada(id: str, parada: ParadaUpdate):
    """Actualizar una parada por su ID."""
    try:
        parada_dict = parada.model_dump()
        updated_document = DatabaseConnection.update_document_id("parada", id, parada_dict)
        if updated_document is None:
            raise HTTPException(status_code=404, detail="Parada no encontrada.")
        return JSONResponse(status_code=200, content=updated_document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar la parada: {str(e)}")


@router.delete("/" + endpoint_name + "/{id}", tags=["Paradas CRUD endpoints"], response_model=ParadaDeleteResponse)
async def delete_parada(id: str):
    """Eliminar una parada por su ID."""
    try:
        deleted_count = DatabaseConnection.delete_document_id("parada", id)
        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="Parada no encontrada.")
        return {"details": "La parada se ha eliminado correctamente."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar la parada: {str(e)}")


@router.get("/" + endpoint_name + "/nearby", tags=["Paradas CRUD endpoints"], response_model=List[Parada])
async def get_paradas_nearby(
    lat: float = Query(..., description="Latitud central para la búsqueda"),
    lon: float = Query(..., description="Longitud central para la búsqueda"),
    radius: float = Query(0.003, description="Radio de búsqueda en grados, por defecto 0.2"),
    offset: int = Query(default=0, description="Índice de inicio para los resultados de la paginación"),
    limit: int = Query(default=30, description="Cantidad de paradas a devolver, por defecto 30")
):
    """Obtener paradas cercanas a una ubicación específica (latitud y longitud)."""
    try:
        query = {
            "lat": {"$gte": lat - radius, "$lte": lat + radius},
            "lon": {"$gte": lon - radius, "$lte": lon + radius}
        }

        paradas = DatabaseConnection.query_document("parada", query, skip=offset, limit=limit)
        total_count = DatabaseConnection.count_documents("parada", query)

        return JSONResponse(
            status_code=200,
            content=paradas,
            headers={"X-Total-Count": str(total_count)}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al buscar las paradas cercanas: {str(e)}")
