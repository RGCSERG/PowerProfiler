from pydantic import BaseModel
from typing import Optional, Union
from datetime import datetime


class Post(BaseModel):
    title: str
    content: str
    published: bool = True


class User(BaseModel):
    _id: int
    username: str
    password: str
    active: bool = True
    _datecreated: str
