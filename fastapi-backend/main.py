from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .routers import oauth2, plans, users

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


@AuthJWT.load_config
def get_config() -> Settings:
    return Settings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


app.include_router(oauth2.router)
app.include_router(plans.router)
app.include_router(users.router)

# @app.put("users/@me")
# def updateUser(userData: User, Authorize: AuthJWT = Depends()):
#     Authorize.jwt_required()

#     current_user = get_user(Authorize.get_jwt_subject())
#     return userData


@app.get("/")
def root() -> dict[str, str]:
    return {"detail": "check /docs or /redoc for usecases and endpoints"}
