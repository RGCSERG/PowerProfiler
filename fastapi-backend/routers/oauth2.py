from fastapi import APIRouter, Depends
from ..functions import authenticate_user
from fastapi_jwt_auth import AuthJWT
from .. import schemas

router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=schemas.OauthResponse)
def login(user: schemas.UserRequest, Authorize: AuthJWT = Depends()) -> dict[str, str]:
    user = authenticate_user(email=user.email, password=user.password)

    response = schemas.OauthResponse.create_tokens(
        user_email=user.email, Authorize=Authorize
    )
    return response


@router.post("/refresh", response_model=schemas.RefreshResponse)
def refresh(Authorize: AuthJWT = Depends()) -> dict[str, str]:
    """
    The jwt_refresh_token_required() function insures a valid refresh
    token is present in the request before running any code below that function.
    we can use the get_jwt_subject() function to get the subject of the refresh
    token, and use the create_access_token() function again to make a new access token
    """
    Authorize.jwt_refresh_token_required()

    current_user = Authorize.get_jwt_subject()
    response = schemas.RefreshResponse.refresh_token(
        current_user=current_user, Authorize=Authorize
    )
    return response
