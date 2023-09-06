from pydantic import BaseModel
from typing import Type, Union
from fastapi_jwt_auth import AuthJWT
from fastapi import Depends


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class User(BaseModel):
    id: int
    forename: str
    surname: str
    password: str
    email: str
    date_created: str
    disabled: Union[bool, None] = None


class UserRequest(BaseModel):
    email: str
    password: str


class UpdateUser(BaseModel):
    forename: str
    surname: str
    email: str
    disabled: Union[bool, None] = None


class UserNoPassword(BaseModel):
    id: int
    forename: str
    surname: str
    email: str
    date_created: str
    disabled: Union[bool, None] = None


class NewUser(BaseModel):
    forename: str
    surname: str
    password: str
    email: str


class OauthResponse(BaseModel):
    access_token: str
    refresh_token: Union[str, None] = None

    @classmethod
    def create_tokens(
        cls, user_email: str, Authorize: AuthJWT = Depends()
    ) -> "OauthResponse":
        access_token = Authorize.create_access_token(subject=user_email)
        refresh_token = Authorize.create_refresh_token(subject=user_email)
        return cls(access_token=access_token, refresh_token=refresh_token)


class RefreshResponse(BaseModel):
    access_token: str

    @classmethod
    def refresh_token(
        cls, current_user: str, Authorize: AuthJWT = Depends()
    ) -> "RefreshResponse":
        new_access_token = Authorize.create_access_token(subject=current_user)
        return cls(access_token=new_access_token)


class Plan(BaseModel):
    id: int
    total_cost: int
    users: int
    owner_id: int
    type: int
    date_created: str


class UpdatePlan(BaseModel):
    id: int
    owner_id: int
    type: int


class AddPlan(BaseModel):
    type: int
