from fastapi import APIRouter, Depends, Response
from ..functions import (
    delete_user_plan,
    get_user,
    get_all_plan_data,
    get_user_plans,
    add_user_plan,
    update_user_plan,
)
from fastapi_jwt_auth import AuthJWT
from pyparsing import Any
from .. import schemas

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/@me", status_code=200)
def get_plans(Authorise: AuthJWT = Depends()) -> Any:
    Authorise.jwt_required()

    user_plans = get_user_plans(Authorise.get_jwt_subject())
    return user_plans


@router.post("/@me", status_code=201, response_model=schemas.Plan)
def add_plan(newplan: schemas.PlanBase, Authorise: AuthJWT = Depends()) -> schemas.Plan:
    Authorise.jwt_required()

    id = get_user(Authorise.get_jwt_subject()).id
    plan = add_user_plan(newplan, owner_id=id)
    return plan


@router.put("/@me", status_code=201, response_model=schemas.Plan)
def update_plan(
    amended_plan: schemas.UpdatePlan, Authorise: AuthJWT = Depends()
) -> schemas.Plan:
    Authorise.jwt_required()

    id = get_user(Authorise.get_jwt_subject()).id
    updated_plan = update_user_plan(data=amended_plan, owner_id=id)
    return updated_plan


@router.delete("/@me/{id}", status_code=204)
def delete_plan(id: int, Authorise: AuthJWT = Depends()) -> Response:
    Authorise.jwt_required()

    user_id = get_user(Authorise.get_jwt_subject()).id
    delete_user_plan(id=id, owner_id=user_id)
    return Response(status_code=204)


@router.get("/@me/{id}", status_code=200)
def get_total_plan(id: int, Authorise: AuthJWT = Depends()) -> schemas.TotalPlanData:
    Authorise.jwt_required()

    user_id = get_user(Authorise.get_jwt_subject()).id
    returnData = get_all_plan_data(id=id, owner_id=user_id)
    return returnData
