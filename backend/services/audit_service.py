from sqlalchemy.orm import Session

from models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    user_email: str,
    user_role: str,
    action: str,
    resource_type: str,
    resource_name: str,
    status: str,
    namespace: str | None = None,
    details: str | None = None,
):
    audit_log = AuditLog(
        user_email=user_email,
        user_role=user_role,
        action=action,
        resource_type=resource_type,
        resource_name=resource_name,
        namespace=namespace,
        status=status,
        details=details,
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    return audit_log