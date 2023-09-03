from abc import ABC, abstractmethod
from typing import Type
from fastapi import HTTPException


class CustomHTTPException(ABC, HTTPException):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(status_code=status_code, detail=detail)

    # Abstraction: create_exception is an abstract method that must be implemented by subclasses
    @abstractmethod
    def create_exception(self) -> Type[HTTPException]:
        pass


# Inheritance: CustomHTTPExceptionImpl is a concrete implementation of AbstractCustomHTTPException
class CustomHTTPExceptionImpl(CustomHTTPException):
    def create_exception(self) -> Type[HTTPException]:
        return CustomHTTPExceptionImpl(status_code=self.status_code, detail=self.detail)

    # Class Methods for Error Handling (Encapsulation)
    @classmethod
    def user_not_found(cls) -> Type[HTTPException]:
        return cls(status_code=404, detail="User not found")

    @classmethod
    def plan_not_found(cls) -> Type[HTTPException]:
        return cls(status_code=404, detail="Plan not found")

    @classmethod
    def add_user_failed(cls) -> Type[HTTPException]:
        return cls(status_code=500, detail="Failed to add User")

    @classmethod
    def incorrect_credentials(cls) -> Type[HTTPException]:
        return cls(status_code=401, detail="Email or password incorrect")

    @classmethod
    def invalid_email(cls) -> Type[HTTPException]:
        return cls(status_code=400, detail="Invalid email format")

    @classmethod
    def database_error(cls) -> Type[HTTPException]:
        return cls(status_code=500, detail="uncaught DB error")

    # Composition: EntryFailed class nested within CustomHTTPExceptionImpl
    class EntryFailed:
        # Polymorphism: __call__ method is used differently
        def __call__(self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(
                status_code=500, detail="Database error Failed to amend Entry"
            )

        # Polymorphism: put method is used differently
        def put(self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(
                status_code=500, detail="Database error Failed to add Entry"
            )

    # Instance of EntryFailed class (Composition)
    entry_failed = EntryFailed()
