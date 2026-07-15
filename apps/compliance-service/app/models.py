def compliance_helper(compliance) -> dict:
    return {
        "id": str(compliance["_id"]),
        "studentId": compliance["studentId"],
        "type": compliance["type"],
        "status": compliance["status"],
        "notes": compliance.get("notes", ""),
        "createdAt": compliance["createdAt"],
    }