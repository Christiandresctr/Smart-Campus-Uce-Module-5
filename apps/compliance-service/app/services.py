from datetime import datetime
from bson.objectid import ObjectId
from .database import collection
from .models import compliance_helper


def create_compliance(data: dict):
    data["createdAt"] = datetime.utcnow().isoformat()
    result = collection.insert_one(data)
    return compliance_helper(collection.find_one({"_id": result.inserted_id}))


def get_compliances(skip: int = 0, limit: int = 100):
    items = collection.find().skip(skip).limit(limit)
    return [compliance_helper(item) for item in items]


def get_compliance(id: str):
    item = collection.find_one({"_id": ObjectId(id)})
    return compliance_helper(item) if item else None


def get_compliances_by_student(student_id: str):
    items = collection.find({"studentId": student_id})
    return [compliance_helper(item) for item in items]


def update_compliance(id: str, data: dict):
    collection.find_one_and_update(
        {"_id": ObjectId(id)}, {"$set": data}
    )
    return compliance_helper(collection.find_one({"_id": ObjectId(id)}))


def delete_compliance(id: str):
    item = collection.find_one({"_id": ObjectId(id)})
    if item:
        collection.delete_one({"_id": ObjectId(id)})
    return compliance_helper(item) if item else None