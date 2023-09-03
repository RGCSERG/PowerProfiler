from fastapi import APIRouter, Depends
from ..functions import getUserPlans
from fastapi_jwt_auth import AuthJWT
from pyparsing import Any


router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/")
def protectedPlans(Authorize: AuthJWT = Depends()) -> Any:
    Authorize.jwt_required()

    user_plans = getUserPlans(Authorize.get_jwt_subject())
    return user_plans
