from fastapi import APIRouter, Depends
from ..functions import authenticate_user
from fastapi_jwt_auth import AuthJWT
from .. import schemas

router = APIRouter(prefix="/oauth", tags=["Authentication"])


@router.post("/login", response_model=schemas.OauthResponse)
def login(user: schemas.UserRequest, Authorise: AuthJWT = Depends()) -> dict[str, str]:
    authenticated_user = authenticate_user(email=user.email, password=user.password)

    response = schemas.OauthResponse.create_tokens(
        user_email=authenticated_user.email, Authorise=Authorise
    )
    return response


@router.post("/refresh", response_model=schemas.RefreshResponse)
def refresh(Authorise: AuthJWT = Depends()) -> dict[str, str]:
    """
    The jwt_refresh_token_required() function ensures a valid refresh
    token is present in the request before running any code below that function.
    We can use the get_jwt_subject() function to get the subject of the refresh
    token, and use the create_access_token() function again to make a new access token.
    """
    Authorise.jwt_refresh_token_required()

    current_user = Authorise.get_jwt_subject()
    response = schemas.RefreshResponse.refresh_token(
        current_user=current_user, Authorise=Authorise
    )
    return response
