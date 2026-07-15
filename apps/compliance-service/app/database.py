from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27018")
db = client.compliance_db
collection = db.compliance