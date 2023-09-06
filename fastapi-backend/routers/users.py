from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from .. import schemas
from ..functions import get_user, update_user, createNewUser
from fastapi_jwt_auth import AuthJWT


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/@me", response_model=schemas.UserNoPassword, status_code=206)
def protected(Authorize: AuthJWT = Depends()) -> schemas.UserNoPassword:
    Authorize.jwt_required()

    current_user = schemas.UserNoPassword(
        **jsonable_encoder(get_user(Authorize.get_jwt_subject()))
    )
    return current_user


@router.put("/@me", response_model=schemas.UserNoPassword, status_code=201)
def updateUsers(
    userData: schemas.UpdateUser, Authorize: AuthJWT = Depends()
) -> schemas.UserNoPassword:
    Authorize.jwt_required()

    current_user = schemas.UserNoPassword(
        **jsonable_encoder(
            update_user(email=Authorize.get_jwt_subject(), data=userData)
        )
    )
    return current_user


@router.post("/", response_model=schemas.UserNoPassword, status_code=201)
def newUser(userData: schemas.NewUser):
    current_user = schemas.UserNoPassword(
        **jsonable_encoder(createNewUser(data=userData))
    )
    return current_user
