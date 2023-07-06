from pydantic import BaseModel
from typing import Optional, Union
from datetime import datetime


class Post(BaseModel):
    title: str
    content: str
    published: bool = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Union[str, None] = None


class User(BaseModel):
    id: int
    password: str
    username: str
    forename: str
    sername: str
    email: str
    _date_created: str
    disabled: Union[bool, None] = None


class UserRequest(BaseModel):
    id: int
    password: str
