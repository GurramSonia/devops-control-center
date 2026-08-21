from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_email = Column(
        String(255),
        nullable=False
    )

    user_role = Column(
        String(20),
        nullable=False
    )

    action = Column(
        String(100),
        nullable=False
    )

    resource_type = Column(
        String(50),
        nullable=False
    )

    resource_name = Column(
        String(255),
        nullable=False
    )

    namespace = Column(
        String(255),
        nullable=True
    )

    status = Column(
        String(20),
        nullable=False
    )

    details = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )