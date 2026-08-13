from database.database import SessionLocal
from services.user_service import get_user_by_email


db = SessionLocal()

try:
    user = get_user_by_email(
        db,
        "sonia@example.com"
    )

    if user:
        print("User found!")
        print("ID:", user.id)
        print("Email:", user.email)
        print("Password hash:", user.password_hash)
    else:
        print("User not found")

finally:
    db.close()