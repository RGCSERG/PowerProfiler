import re
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder
import psycopg2
from .schemas import NewUser, User, UpdateUser
from .errors import CustomHTTPException
from .database import conn, cursor
from pyparsing import Any, Literal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def is_valid_email(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if re.match(pattern, email):
        return True
    else:
        return CustomHTTPException.invalid_email()


def createNewUser(data: NewUser) -> User:
    hashed_password = hashPassword(data.password)
    user = addUserToDb(data=data, hashed_password=hashed_password)
    return user


def addUserToDb(data: NewUser, hashed_password: str) -> User:
    try:
        cursor.execute(
            """INSERT INTO public."Users" (forename, surname, email, password) VALUES (%s,%s,%s,%s) RETURNING * """,
            (data.forename, data.surname, data.email, hashed_password),
        )
        user = cursor.fetchone()
        if user is None:
            raise CustomHTTPException.entry_failed()

        conn.commit()
        json_compatible_item_data = jsonable_encoder(user)
        return User(**json_compatible_item_data)
    except psycopg2.DatabaseError as db_error:
        raise CustomHTTPException.entry_failed()


def update_user(email: str, data: UpdateUser) -> User:
    try:
        cursor.execute(
            """UPDATE public."Users" SET forename=%s, surname=%s, disabled=%s, email=%s WHERE email=%s RETURNING *""",
            (data.forename, data.surname, data.disabled, data.email, email),
        )
        user = cursor.fetchone()
        if user is None:
            raise CustomHTTPException.user_not_found()
        conn.commit()
        json_compatible_item_data = jsonable_encoder(user)
        return User(**json_compatible_item_data)
    except psycopg2.DatabaseError as db_error:
        raise CustomHTTPException.entry_failed.put()


def get_user(email: str, is_login: bool = False) -> User:
    try:
        cursor.execute("""SELECT * FROM public."Users" WHERE email = %s """, (email,))
        user = cursor.fetchone()
        if is_login and not user:
            raise CustomHTTPException.incorrect_credentials()
        if not user:
            raise CustomHTTPException.user_not_found()
        json_compatible_item_data = jsonable_encoder(user)
        return User(**json_compatible_item_data)
    except psycopg2.DatabaseError:
        if is_login:
            raise CustomHTTPException.incorrect_credentials()
        raise CustomHTTPException.user_not_found()


def getUserPlans(email: str) -> Any:
    try:
        id = get_user(email).id
        cursor.execute("""SELECT * FROM public."Plan" WHERE owner_id = %s """, (id,))
        plans = cursor.fetchall()
        if not plans:
            raise CustomHTTPException.plan_not_found()
        return jsonable_encoder(plans)
    except psycopg2.DatabaseError:
        raise CustomHTTPException.database_error()


def hashPassword(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(email: str, password: str) -> User or Literal[False]:
    user = get_user(email=email, is_login=True)
    if not user:
        raise CustomHTTPException.incorrect_credentials()
    if not verify_password(password, user.password):
        raise CustomHTTPException.incorrect_credentials()
    return user


# from .schemas import User
# from .database import cursor


# def validateUser(user: User) -> bool:
#     cursor.execute("""SELECT * FROM users ORDER BY _id DESC""")
#     data = cursor.fetchall()
#     return user in data
