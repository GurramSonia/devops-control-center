from database.database import SessionLocal
from models.user import User

from passlib.context import CryptContext


pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


db = SessionLocal()

try:
    email = "viewer@example.com"
    password = "viewer123"

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        print("User already exists")

    else:
        password_hash = pwd_context.hash(password)

        user = User(
            email=email,
            password_hash=password_hash
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print("User created successfully!")
        print("ID:", user.id)
        print("Email:", user.email)

finally:
    db.close()