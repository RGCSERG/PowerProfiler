from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from .. import schemas
from ..functions import get_user, is_valid_email, update_user, create_new_user
from fastapi_jwt_auth import AuthJWT

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/@me", response_model=schemas.UserNoPassword, status_code=206)
def protected(Authorise: AuthJWT = Depends()) -> schemas.UserNoPassword:
    Authorise.jwt_required()
    current_user = schemas.UserNoPassword(
        **jsonable_encoder(get_user(Authorise.get_jwt_subject()))
    )
    return current_user


@router.put("/@me", response_model=schemas.UserNoPassword, status_code=201)
def update_users(
    userData: schemas.UpdateUser, Authorise: AuthJWT = Depends()
) -> schemas.UserNoPassword:
    Authorise.jwt_required()
    current_user = schemas.UserNoPassword(
        **jsonable_encoder(
            update_user(email=Authorise.get_jwt_subject(), data=userData)
        )
    )
    return current_user


@router.post("/", response_model=schemas.UserNoPassword, status_code=201)
def new_user(userData: schemas.NewUser):
    is_valid_email(userData.email)
    current_user = schemas.UserNoPassword(
        **jsonable_encoder(create_new_user(data=userData))
    )
    return current_user
