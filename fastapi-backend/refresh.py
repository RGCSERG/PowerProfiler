from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import psycopg2
from pydantic import BaseModel
from pyparsing import Any, Literal
from .database import conn, cursor
from .schemas import NewUser, User, UserNoPassword, UserRequest, UpdateUser
from fastapi.encoders import jsonable_encoder
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from .errors import CustomHTTPException
import logging
import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Settings(BaseModel):
    authjwt_secret_key: str = "secret"


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
        logger.error("Error while adding user to the database: %s", db_error)
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
        logger.error("Error while adding user to the database: %s", db_error)
        raise CustomHTTPException.entry_failed(put=True)


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
        raise CustomHTTPException.entry_failed()


def getUserPlans(email: str) -> Any:
    try:
        id = get_user(email).id
        cursor.execute("""SELECT * FROM public."Plan" WHERE owner_id = %s """, (id,))
        plans = cursor.fetchall()
        if not plans:
            raise CustomHTTPException.plan_not_found()
        return jsonable_encoder(plans)
    except psycopg2.DatabaseError:
        raise CustomHTTPException.entry_failed()


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


@AuthJWT.load_config
def get_config() -> Settings:
    return Settings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.post("/login")
def login(user: UserRequest, Authorize: AuthJWT = Depends()) -> dict[str, str]:
    user = authenticate_user(email=user.email, password=user.password)

    access_token = Authorize.create_access_token(subject=user.email)
    refresh_token = Authorize.create_refresh_token(subject=user.email)
    return {"access_token": access_token, "refresh_token": refresh_token}


@app.post("/users/refresh")
def refresh(Authorize: AuthJWT = Depends()) -> dict[str, str]:
    """
    The jwt_refresh_token_required() function insures a valid refresh
    token is present in the request before running any code below that function.
    we can use the get_jwt_subject() function to get the subject of the refresh
    token, and use the create_access_token() function again to make a new access token
    """
    Authorize.jwt_refresh_token_required()

    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)
    return {"access_token": new_access_token}


@app.get("/users/@me")
def protected(Authorize: AuthJWT = Depends()) -> UserNoPassword:
    Authorize.jwt_required()

    current_user = UserNoPassword(
        **jsonable_encoder(get_user(Authorize.get_jwt_subject()))
    )
    return current_user


@app.get("/users/plans")
def protectedPlans(Authorize: AuthJWT = Depends()) -> Any:
    Authorize.jwt_required()

    user_plans = getUserPlans(Authorize.get_jwt_subject())
    return user_plans


# @app.put("users/@me")
# def updateUser(userData: User, Authorize: AuthJWT = Depends()):
#     Authorize.jwt_required()

#     current_user = get_user(Authorize.get_jwt_subject())
#     return userData


@app.put("/users/@me")
def updateUsers(userData: UpdateUser, Authorize: AuthJWT = Depends()) -> UserNoPassword:
    Authorize.jwt_required()

    current_user = UserNoPassword(
        **jsonable_encoder(
            update_user(email=Authorize.get_jwt_subject(), data=userData)
        )
    )
    return current_user


@app.post("/users")
def newUser(userData: NewUser):
    current_user = UserNoPassword(**jsonable_encoder(createNewUser(data=userData)))
    return current_user
