import os,json
from typing import Optional, List
from datetime import date
from bson.binary import Binary

from fastapi import FastAPI, Body, HTTPException, status, UploadFile, File
from fastapi.responses import Response
from pydantic import ConfigDict, BaseModel, Field, EmailStr,constr
from pydantic.functional_validators import BeforeValidator
from fastapi.middleware.cors import CORSMiddleware


from typing_extensions import Annotated

from bson import ObjectId
import motor.motor_asyncio
from pymongo import ReturnDocument


app = FastAPI(
    title="Ration Card API",
    summary="Operations performed via website",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # specific frontend ka URL de sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MONGODB_URL = "mongodb+srv://vedroh123:vedroh123@cluster1.wmosgp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"


client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.rationcard
ration_collection = db.get_collection("register")

PyObjectId = Annotated[str, BeforeValidator(str)]


class RegisterModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    dob: str = Field(...)  # validate dob in frontend
    address: str = Field(...)
    no_of_family_members: int = Field(...)
    ratio_card_no: constr(min_length=10,max_length=10) = Field(...)
    adhar_no: constr(min_length=12,max_length=12) = Field(...)
    phone_no: constr(min_length=10,max_length=10) = Field(...)
    email: EmailStr = Field(...)
    image : bytes
    image_filename: Optional[str] = None  
    image_content_type: Optional[str] = None
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "John Doe",
                "dob": "1990-01-01",
                "address": "123 Main St",
                "no_of_family_members": 4,
                "ratio_card_no": "1234567890",
                "adhar_no": "123456789012",
                "phone_no": "0987654321",
                "email": "john@example.com",
                "image": "byte..",
                "image_filename": "profile_picture.jpg",
                "image_content_type": "image/jpeg"
            }
        },
    )


class UpdateRegisterModel(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None  # validate dob in frontend
    address: Optional[str] = None
    no_of_family_members: Optional[int] = None
    ration_card_no: Optional[constr(min_length=10, max_length=10)]
    adhar_no: Optional[constr(min_length=12, max_length=12)]
    phone_no: Optional[constr(min_length=10, max_length=10)]
    email: Optional[EmailStr]

class RegisterCollection(BaseModel):
    user: List[RegisterModel]

@app.post(
    "/register/",
    response_description="Add new user",
    response_model=RegisterModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
    
)
async def create_user(user: RegisterModel = Body(...)):
    try:
        # file_data = await file.read()

        user_data = user.model_dump(by_alias=True,  exclude=["id"])

    
        new_user = await ration_collection.insert_one(user_data)
        created_user = await ration_collection.find_one(
            {"_id": new_user.inserted_id}
        )
        return created_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/users/",
    response_description="List all users",
    response_model=RegisterCollection,
    response_model_by_alias=False,
)

async def list_students():
    return RegisterCollection(users=await ration_collection.find().to_list(1000))


@app.post("/upload/{id}")
async def upload_image(file: UploadFile = File(...), user_id: str = None):
    # Read the file
    file_data = await file.read()

    user_data = await ration_collection.find_one({"ratio_card_no": user_id})
    
    if user_data is None:
        return {"error": "User not found"}


    user_data["image"] = Binary(file_data)
    user_data["image_filename"] = file.filename
    user_data["image_content_type"] = file.content_type
    print(user_data)


    await ration_collection.update_one({"ratio_card_no": user_id}, {"$set": user_data})

    return {"message": "Image updated successfully"}


@app.get(
    "/user/{id}",
    response_description="Get a single user",
    response_model=RegisterModel,
    response_model_by_alias=False,
)
async def show_user(id: str):
    if (
        user := await ration_collection.find_one({"ratio_card_no": id})
    ) is not None:
        return user

    raise HTTPException(status_code=404, detail=f"ration card {id} not found")


@app.put(
    "/user-update/{id}",
    response_description="Update a user",
    response_model=RegisterModel,
    response_model_by_alias=False,
)
async def update_user(id: str, update_data : UpdateRegisterModel):
    update_data_dict = update_data.model_dump(exclude_unset=True)

    # Update the user
    result = await ration_collection.update_one(
        {"ratio_card_no": id},
        {"$set": update_data_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "success", "message": "User updated"}


@app.delete("/del-user/{id}", response_description="Delete a user")
async def delete_student(id: str):
    delete_result = await ration_collection.delete_one({"ratio_card_no": id})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"Ration card {id} not found")