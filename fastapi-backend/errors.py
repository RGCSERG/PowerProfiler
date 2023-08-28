from fastapi import HTTPException
from typing import Type


class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

    @classmethod
    def user_not_found(cls) -> Type["CustomHTTPException"]:
        return cls(status_code=404, detail="User not found")

    @classmethod
    def plan_not_found(cls) -> Type["CustomHTTPException"]:
        return cls(status_code=404, detail="Plan not found")

    @classmethod
    def add_user_failed(cls) -> Type["CustomHTTPException"]:
        return cls(status_code=500, detail="Failed to add User")

    @classmethod
    def incorrect_credentials(cls) -> Type["CustomHTTPException"]:
        return cls(status_code=401, detail="Email or password incorrect")

    @classmethod
    def invalid_email(cls) -> Type["CustomHTTPException"]:
        return cls(status_code=400, detail="Invalid email format")

    @classmethod
    def entry_failed(cls, put: bool = False) -> Type["CustomHTTPException"]:
        if put == True:
            detail = "Database error Failed to add Entry"
        else:
            detail = "Database error Failed to amend Entry"
        return cls(status_code=500, detail=detail)

    @classmethod
    def database_error(cls) -> Type["CustomHTTPException"]:
        return cls(status_code=500, detail="uncaught DB error")
