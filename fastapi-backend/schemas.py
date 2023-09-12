from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
from fastapi import Depends
from typing import List, Type, Union


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class UserBase(BaseModel):
    forename: str
    surname: str
    email: str


class User(UserBase):
    id: int
    password: str
    date_created: str
    disabled: Union[bool, None] = None


class UserRequest(BaseModel):
    email: str
    password: str


class UpdateUser(UserBase):
    disabled: Union[bool, None] = None


class UserNoPassword(UserBase):
    id: int
    date_created: str
    disabled: Union[bool, None] = None


class NewUser(UserBase):
    password: str


class OauthResponse(BaseModel):
    access_token: str
    refresh_token: Union[str, None] = None

    @classmethod
    def create_tokens(
        cls, user_email: str, Authorise: AuthJWT = Depends()
    ) -> "OauthResponse":
        access_token = Authorise.create_access_token(subject=user_email)
        refresh_token = Authorise.create_refresh_token(subject=user_email)
        return cls(access_token=access_token, refresh_token=refresh_token)


class RefreshResponse(BaseModel):
    access_token: str

    @classmethod
    def refresh_token(
        cls, current_user: str, Authorise: AuthJWT = Depends()
    ) -> "RefreshResponse":
        new_access_token = Authorise.create_access_token(subject=current_user)
        return cls(access_token=new_access_token)


class PlanBase(BaseModel):
    type: int


class Plan(PlanBase):
    id: int
    total_cost: int
    users: int
    owner_id: int
    date_created: str


class UpdatePlan(PlanBase):
    id: int
    owner_id: int


class PlanType(BaseModel):
    id: int
    data: str
    date_created: str


class BaseAppliance(BaseModel):
    data: str
    name: str


class Appliance(BaseAppliance):
    id: int
    date_created: str


class BaseSubClass(BaseModel):
    name: str
    plan_id: int
    appliances: Union[List[Appliance], None] = None


class SubClass(BaseSubClass):
    id: int
    date_created: str


class TotalPlanData(BaseModel):
    id: int
    type: PlanType
    date_created: str
    owner_id: int
    users: int
    total_cost: int
    SubClasses: Union[List[SubClass], None] = None
