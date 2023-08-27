from pydantic import BaseModel
from typing import Optional, Union
import datetime


class Post(BaseModel):
    title: str
    content: str
    published: bool = True


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
