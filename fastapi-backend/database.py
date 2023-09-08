import psycopg2
from psycopg2.extras import RealDictCursor
import time


with open("password.txt", "r") as f:
    passwo = f.read()
while True:
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",  # fast api database # model_testing_database # postgres
            user="postgres",
            password=f"{passwo}",
            cursor_factory=RealDictCursor,
        )
        cursor = conn.cursor()
        print("connected to database")
        conn.rollback()
        break
    except Exception as error:
        print("connection to databse failed")
        print(error)
        time.sleep(2)
# while True:
#     try:
#         conn2 = psycopg2.connect(host='localhost', database='postgres', user='postgres', password=f'{passwo}', cursor_factory=RealDictCursor)
#         cursor2 = conn2.cursor()
#         print("connected to second database")
#         break
#     except Exception as error:
#         print("connection to databse failed")
#         print(error)
#         time.sleep(2)
