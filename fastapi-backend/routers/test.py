from fastapi import APIRouter, Depends, Response
from ..functions import Test
from fastapi_jwt_auth import AuthJWT
from pyparsing import Any
from .. import schemas


router = APIRouter(prefix="/test", tags=["Tests"])


@router.get("/")
def test():
    return Test(1)
