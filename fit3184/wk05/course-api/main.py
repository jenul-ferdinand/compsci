from fastapi import FastAPI, HTTPException
import os

app = FastAPI()
COUNTER_FILE = "counter.txt"

@app.get("/")
def get_root():
    return { "message": "This is the root endpoint of the API." }

@app.get("/api/v1/courses")
def get_courses():
    count = 0
    if os.path.exists(COUNTER_FILE):
        with open(COUNTER_FILE, "r") as f:
            count = f.read().strip()
    return {
        "courses": [
            { "id": "FIT3184", "name": "Cloud Computing"}
        ], 
        "message": f"The number of students visited the handbook is {count}."
    }

@app.get("/api/v1/fit3184")
def fit3184():
    try:
        count = 0
        if os.path.exists(COUNTER_FILE):
            with open(COUNTER_FILE, "r") as f:
                count = int(f.read().strip())
        count += 1
        with open(COUNTER_FILE, "w") as f:
            f.write(str(count))
        return {
            "message": f"This is the FIT3184 handbook, you are {count} visitor."
        }
    except HTTPException as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error accessing counter: {str(e)}"
        )

# run dis with uvicorn main:app --host 0.0.0.0 --reload --port 8080
