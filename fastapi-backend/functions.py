import re
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder
import psycopg2
from . import schemas
from .errors import CustomHTTPExceptionImpl
from .database import conn, cursor
from pyparsing import Any

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def is_valid_email(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if re.match(pattern, email):
        return True
    else:
        return CustomHTTPExceptionImpl.invalid_email()


def createNewUser(data: schemas.NewUser) -> schemas.User:
    hashed_password = hashPassword(data.password)
    user = addUserToDb(data=data, hashed_password=hashed_password)
    return user


def addUserToDb(data: schemas.NewUser, hashed_password: str) -> schemas.User:
    try:
        cursor.execute(
            """INSERT INTO public."Users" (forename, surname, email, password) VALUES (%s,%s,%s,%s) RETURNING * """,
            (data.forename, data.surname, data.email, hashed_password),
        )
        user = cursor.fetchone()
        if user is None:
            raise CustomHTTPExceptionImpl.entry_failed()

        conn.commit()
        json_compatible_item_data = jsonable_encoder(user)
        return schemas.User(**json_compatible_item_data)
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.entry_failed()


def update_user(email: str, data: schemas.UpdateUser) -> schemas.User:
    try:
        cursor.execute(
            """UPDATE public."Users" SET forename=%s, surname=%s, disabled=%s, email=%s WHERE email=%s RETURNING *""",
            (data.forename, data.surname, data.disabled, data.email, email),
        )
        user = cursor.fetchone()
        if user is None:
            raise CustomHTTPExceptionImpl.not_found.user()
        conn.commit()
        json_compatible_item_data = jsonable_encoder(user)
        return schemas.User(**json_compatible_item_data)
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.entry_failed.put()


def get_user(email: str, is_login: bool = False) -> schemas.User:
    try:
        cursor.execute("""SELECT * FROM public."Users" WHERE email = %s """, (email,))
        user = cursor.fetchone()
        if is_login and not user:
            raise CustomHTTPExceptionImpl.incorrect_credentials()
        if not user:
            raise CustomHTTPExceptionImpl.not_found.user()
        json_compatible_item_data = jsonable_encoder(user)
        return schemas.User(**json_compatible_item_data)
    except psycopg2.Error as error:
        if is_login:
            raise CustomHTTPExceptionImpl.incorrect_credentials()
        raise CustomHTTPExceptionImpl.not_found.user()


def getUserPlans(email: str) -> Any:
    try:
        id = get_user(email).id
        cursor.execute("""SELECT * FROM public."Plans" WHERE owner_id = %s """, (id,))
        plans = cursor.fetchall()
        if not plans:
            raise CustomHTTPExceptionImpl.not_found.plan()
        return jsonable_encoder(plans)
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.database_error()


def hashPassword(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(email: str, password: str) -> schemas.User:
    user = get_user(email=email, is_login=True)
    if not user:
        raise CustomHTTPExceptionImpl.incorrect_credentials()
    if not verify_password(password, user.password):
        raise CustomHTTPExceptionImpl.incorrect_credentials()
    return user


def addUserPlan(data: schemas.AddPlan, owner_id: int) -> schemas.Plan:
    try:
        cursor.execute(
            """INSERT INTO public."Plans" (owner_id, type) VALUES (%s,%s) RETURNING * """,
            (owner_id, data.type),
        )
        plan = cursor.fetchone()
        if plan is None:
            raise CustomHTTPExceptionImpl.entry_failed()

        conn.commit()
        json_compatible_item_data = jsonable_encoder(plan)
        return schemas.Plan(**json_compatible_item_data)
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.entry_failed()


def updateUserPlan(data: schemas.UpdatePlan, owner_id: int) -> schemas.Plan:
    try:
        cursor.execute(
            """UPDATE public."Plans" SET type = %s, owner_id = %s WHERE owner_id = %s AND id = %s RETURNING *""",
            (data.type, data.owner_id, owner_id, data.id),
        )
        plan = cursor.fetchone()
        if plan is None:
            raise CustomHTTPExceptionImpl.not_found.plan()
        conn.commit()
        json_compatible_item_data = jsonable_encoder(plan)
        return schemas.Plan(**json_compatible_item_data)
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.entry_failed.put()


def deleteUserPlan(id: int, owner_id: int) -> None:
    try:
        cursor.execute(
            """DELETE FROM public."Plans" WHERE owner_id = %s AND id = %s  RETURNING *""",
            (owner_id, id),
        )
        deleted_plan = cursor.fetchone()
        if deleted_plan is None:
            raise CustomHTTPExceptionImpl.not_found.plan()
        conn.commit()
        return None
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.entry_failed.delete()


# def getIndiviualPlan(id: int, owner_id: int) -> schemas.TotalPlanData:
#     try:
#         cursor.execute(
#             """SELECT * FROM public."Plans" WHERE owner_id = %s AND id = %s""",
#             (owner_id, id),
#         )
#         plans = cursor.fetchall()
#         if not plans:
#             raise CustomHTTPExceptionImpl.not_found.plan()
#         return schemas.TotalPlanData(plans)
#     except psycopg2.Error as error:
#         raise CustomHTTPExceptionImpl.database_error()


# def getPlanSubclasses(id: int) -> Any:
#     try:
#         cursor.execute(
#             """SELECT * FROM public."SubClass" WHERE plan_id = %s""",
#             (id,),
#         )
#         sub_class = cursor.fetchall()
#         if not sub_class:
#             raise CustomHTTPExceptionImpl.not_found.subClass()
#         return jsonable_encoder(sub_class)
#     except psycopg2.Error as error:
#         raise CustomHTTPExceptionImpl.database_error()

# def getSubClassOwnedAppliances(id:int):
#     try:
#         cursor.execute(
#             """SELECT * FROM public."Owned" WHERE plan_id = %s""",
#             (id,),
#         )
#         sub_class = cursor.fetchall()
#         if not sub_class:
#             raise CustomHTTPExceptionImpl.not_found.subClass()
#         return jsonable_encoder(sub_class)
#     except psycopg2.Error as error:
#         raise CustomHTTPExceptionImpl.database_error()


def getAllPlanData(id: int, owner_id: int) -> Any:
    try:
        cursor.execute(
            """SELECT
                P.*,
                (
                    SELECT json_agg(
                        jsonb_build_object(
                            'id', S.id,
                            'name', S.name,
                            'plan_id', S.plan_id,
                            'date_created', S.date_created,
                            'appliances',
                            (
                                SELECT json_agg(
                                    json_build_object(
                                        'id', A.id,
                                        'name', A.name,
                                        'data', A.data,
                                        'date_created', A.date_created
                                    )
                                )
                                FROM public."Appliance" AS A
                                JOIN public."OwnedAppliance" AS OA ON A.id = OA.appliance_id
                                WHERE OA.subclass_id = S.id
                            )
                        )
                    )
                    FROM public."SubClass" AS S
                    WHERE S.plan_id = P.id
                ) AS "SubClasses"
            FROM
                public."Plans" AS P
            WHERE
                P.owner_id = %s P.id = %s;""",
            (owner_id, id),
        )
        total_plan_data = cursor.fetchall()
        if not total_plan_data:
            raise CustomHTTPExceptionImpl.not_found.plan()
        return jsonable_encoder(total_plan_data)
    except psycopg2.Error as error:
        raise CustomHTTPExceptionImpl.database_error()


def Test(id: int):
    cursor.execute(
        """SELECT
    P.*,
    (
        SELECT json_agg(
            jsonb_build_object(
                'id', S.id,
                'name', S.name,
                'plan_id', S.plan_id,
                'date_created', S.date_created,
                'appliances',
                (
                    SELECT json_agg(
                        json_build_object(
                            'id', A.id,
                            'name', A.name,
                            'data', A.data,
                            'date_created', A.date_created
                        )
                    )
                    FROM public."Appliance" AS A
                    JOIN public."OwnedAppliance" AS OA ON A.id = OA.appliance_id
                    WHERE OA.subclass_id = S.id
                )
            )
        )
        FROM public."SubClass" AS S
        WHERE S.plan_id = P.id
    ) AS "SubClasses"
FROM
    public."Plans" AS P
WHERE
    P.id = 1;

""",
    )
    stuff = cursor.fetchall()
    return jsonable_encoder(stuff)


# from .schemas import User
# from .database import cursor


# def validateUser(user: User) -> bool:
#     cursor.execute("""SELECT * FROM users ORDER BY _id DESC""")
#     data = cursor.fetchall()
#     return user in data
