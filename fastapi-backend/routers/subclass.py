from fastapi import APIRouter, Depends, Response
from fastapi_jwt_auth import AuthJWT
from pyparsing import Any
from .. import schemas

router = APIRouter(prefix="/subclass", tags=["SubClasses"])


@router.post("/@me", status_code=201, response_model=schemas.SubClass)
def add_subclass(
    data: schemas.BaseSubClass, Authorise: AuthJWT = Depends()
) -> schemas.SubClass:
    Authorise.jwt_required()
