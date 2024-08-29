import os,json
from typing import Optional, List
from datetime import date
from bson.binary import Binary

from passlib.context import CryptContext
from fastapi import FastAPI, Body, HTTPException, status, UploadFile, File, Form, Request
from fastapi.responses import Response, StreamingResponse
from pydantic import  BaseModel, Field, EmailStr,constr
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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGODB_URL = "mongodb+srv://vedroh123:vedroh123@cluster1.wmosgp9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"


client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.rationcard
orders_collection = db.get_collection("user_orders")
ration_collection = db.get_collection("register")

PyObjectId = Annotated[str, BeforeValidator(str)]


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


class RegisterModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    fullName: str = Field(...)
    dob: str = Field(...)  # validate dob in frontend
    address: str = Field(...)
    familyMembers: str = Field(...)
    rationCardNumber: str = Field(..., pattern=r'^\d{10}$')
    aadhaarNumber: str = Field(..., pattern=r'^\d{12}$')
    phoneNumber: str = Field(..., pattern=r'^\d{10}$')
    image : Optional[bytes] = None
    image_filename: Optional[str] = None  
    image_content_type: Optional[str] = None
    incomeColor: str
    income:str
    consent: str
    privacyAgreement: str


class UpdateRegisterModel(BaseModel):
    fullName: str = Field(...)
    dob: str = Field(...)  # validate dob in frontend
    address: str = Field(...)
    familyMembers: str = Field(...)
    rationCardNumber: str = Field(..., pattern=r'^\d{10}$')
    aadhaarNumber: str = Field(..., pattern=r'^\d{12}$')
    phoneNumber: str = Field(..., pattern=r'^\d{10}$')
    image : Optional[bytes] = None
    image_filename: Optional[str] = None  
    image_content_type: Optional[str] = None
    incomeColor: str
    income:str

class RegisterCollection(BaseModel):
    user: List[RegisterModel]

@app.post(
    "/register/",
    response_description="Add new user",
    status_code=status.HTTP_201_CREATED
)
async def create_user(fullName:str = Form(...),
                      dob:str = Form(...),  # validate dob in frontend
                      address: str = Form(...),
                      familyMembers: str = Form(...),
                      rationCardNumber: str = Form(...),
                      aadhaarNumber: str = Form(...),
                      phoneNumber: str = Form(...),           
                      incomeColor: str = Form(...),
                      income:str = Form(...),
                      consent: str = Form(...),
                      privacyAgreement: str = Form(...),
                      document: UploadFile = File(...),
                      confirmPassword:str=Form(...)
):
    try:
        file = await document.read()
        print(file)
        print(fullName ,dob,address, income,familyMembers,rationCardNumber,aadhaarNumber,phoneNumber,incomeColor,consent,privacyAgreement)
        user_data = {
            "fullName" : fullName,
            "dob" : dob,
            "address": address,
            "income": income,
            "familyMembers": familyMembers,
            "rationCardNumber":rationCardNumber,
            "aadhaarNumber" : aadhaarNumber,
            "image" : Binary(file),
            "phoneNumber" : phoneNumber,
            "incomeColor" : incomeColor,
            "consent" : consent,
            "privacyAgreement" : privacyAgreement,
            "password":hash_password(confirmPassword)
        }
        if incomeColor=="yellow":
            wheat = 2 * familyMembers
            rice = 3 * familyMembers
            sugar = 2 * familyMembers
        if incomeColor=="orange":
            wheat = 5 * familyMembers
            rice = 7 * familyMembers
            sugar = 3 * familyMembers
        else:
            sugar,wheat,rice = 0,0,0

        order_data = {
            "fullName" : fullName,
            "rationCardNumber" : rationCardNumber,
            "sugar":sugar,
            "rice": rice,
            "wheat":wheat
        }
        user_order = await orders_collection.insert_one(order_data)
        await orders_collection.find_one(
            {"_id": user_order.inserted_id}
        )
        new_user = await ration_collection.insert_one(user_data)
        created_user = await ration_collection.find_one(
            {"_id": new_user.inserted_id}
        )
        name,color = created_user["fullName"],created_user["incomeColor"]
        return name,color
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

    user_data = await ration_collection.find_one({"rationCardNumber": user_id})
    
    if user_data is None:
        return {"error": "User not found"}


    user_data["image"] = Binary(file_data)
    user_data["image_filename"] = file.filename
    user_data["image_content_type"] = file.content_type
    print(user_data)


    await ration_collection.update_one({"rationCardNumber": user_id}, {"$set": user_data})

    return {"message": "Image updated successfully"}


@app.get(
    "/user/{id}",
    response_description="Get a single user",
    response_model=RegisterModel,
    response_model_by_alias=False,
)
async def show_user(id: str):
    if (
        user := await ration_collection.find_one({"rationCardNumber": id})
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
        {"rationCardNumber": id},
        {"$set": update_data_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"status": "success", "message": "User updated"}


@app.delete("/del-user/{id}", response_description="Delete a user")
async def delete_student(id: str):
    delete_result = await ration_collection.delete_one({"rationCardNumber": id})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"Ration card {id} not found")

@app.post("/login")
async def login(rationCardNumber: str = Form(...),password:str = Form(...)):
        print(rationCardNumber,password)
        user = await ration_collection.find_one({"rationCardNumber": rationCardNumber})
        
        if user is None:
            print("user is not found")
            raise HTTPException(status_code=404, detail="Invalid username or password")
        
        # print(verify_password(password, user["password"]))
        result = verify_password(password, user["password"])
        if  result == False:
            raise HTTPException(status_code=404, detail="Invalid username or password")


@app.get("/orders")
async def order(request:Request):
    id = request.cookies.get("id","defaultNone")
    print("id "+id)
    user =  await ration_collection.find_one({"rationCardNumber": id})
    return {"color":user["incomeColor"],"name":user["fullName"]}

