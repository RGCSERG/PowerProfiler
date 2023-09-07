from fastapi import APIRouter, Depends, Response
from ..functions import (
    deleteUserPlan,
    get_user,
    getAllPlanData,
    getUserPlans,
    addUserPlan,
    updateUserPlan,
)
from fastapi_jwt_auth import AuthJWT
from pyparsing import Any
from .. import schemas


router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/@me", status_code=200)
def protectedPlans(Authorise: AuthJWT = Depends()) -> Any:
    Authorise.jwt_required()

    user_plans = getUserPlans(Authorise.get_jwt_subject())
    return user_plans


@router.post("/@me", status_code=201, response_model=schemas.Plan)
def addPlan(newplan: schemas.AddPlan, Authorise: AuthJWT = Depends()) -> schemas.Plan:
    Authorise.jwt_required()

    id = get_user(Authorise.get_jwt_subject()).id
    plan = addUserPlan(newplan, owner_id=id)
    return plan


@router.put("/@me", status_code=201, response_model=schemas.Plan)
def updatePlan(
    amended_plan: schemas.UpdatePlan, Authorise: AuthJWT = Depends()
) -> schemas.Plan:
    Authorise.jwt_required()

    id = get_user(Authorise.get_jwt_subject()).id
    updated_plan = updateUserPlan(data=amended_plan, owner_id=id)
    return updated_plan


@router.delete("/@me/{id}", status_code=204)
def deletePlan(id: int, Authorise: AuthJWT = Depends()) -> Response:
    Authorise.jwt_required()

    user_id = get_user(Authorise.get_jwt_subject()).id
    deleteUserPlan(id=id, owner_id=user_id)

    return Response(status_code=204)


@router.get("/@me/data", status_code=200)
def getTotalPlan(
    data: schemas.GetIndividualPlan, Authorise: AuthJWT = Depends()
) -> Any:
    Authorise.jwt_required()

    user_id = get_user(Authorise.get_jwt_subject()).id
    returnData = getAllPlanData(id=data.id, owner_id=user_id)
    return returnData
