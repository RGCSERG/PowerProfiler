from .schemas import User
from .database import cursor


def validateUser(user: User) -> bool:
    cursor.execute("""SELECT * FROM users ORDER BY _id DESC""")
    data = cursor.fetchall()
    return user in data
