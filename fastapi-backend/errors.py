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
                status_code=500, detail="Database error Failed to add Entry"
            )

        # Polymorphism: put method is used differently
        def put(self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(
                status_code=500, detail="Database error Failed to amend Entry"
            )

        # Polymorphism: delete method is used differently
        def delete(Self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(
                status_code=500, detail="Database error Failed to delete Entry"
            )

    class NotFound:
        def __call__(self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(status_code=404, detail="Item not found")

        def user(self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(status_code=404, detail="User not found")

        def plan(self) -> Type[HTTPException]:
            return CustomHTTPExceptionImpl(status_code=404, detail="Plan not found")

    # Instance of EntryFailed class (Composition)
    entry_failed = EntryFailed()
    not_found = NotFound()
