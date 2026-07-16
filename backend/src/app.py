from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from src.pipeline import run_pipeline
from src.report_generator import save_html_report, make_safe_filename


# ---------------------------------------------------
# FASTAPI INITIALIZATION
# ---------------------------------------------------
app = FastAPI(
    title="YouTube Fact Checker API",
    description="AI-powered YouTube fact-checking service.",
    version="2.0.0"
)


# ---------------------------------------------------
# ENABLE CORS
# ---------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------
# REQUEST SCHEMA
# ---------------------------------------------------
class CheckRequest(BaseModel):
    url: str
    save_report: Optional[bool] = False


# ---------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "API is running."
    }


# ---------------------------------------------------
# ROOT
# ---------------------------------------------------
@app.get("/")
def root():
    return {
        "success": True,
        "service": "YouTube Fact Checker API",
        "version": "2.0.0"
    }


# ---------------------------------------------------
# FACT CHECK ENDPOINT
# ---------------------------------------------------
@app.post("/check")
def check_video(req: CheckRequest):

    video_input = req.url.strip()

    print(f"[API] Processing: {video_input}")

    try:
        report = run_pipeline(video_input)

    except Exception as e:

        error_message = str(e)

        if "AI_QUOTA_EXCEEDED" in error_message:
            raise HTTPException(
                status_code=503,
                detail={
                    "code": "AI_QUOTA_EXCEEDED",
                    "message": (
                        "AI processing capacity has been exhausted. "
                        "Please try again later."
                    )
                }
            )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "PIPELINE_ERROR",
                "message": error_message
            }
        )

    saved_report = None

    if req.save_report:

        try:

            os.makedirs("reports", exist_ok=True)

            safe_name = make_safe_filename(video_input)

            output_path = f"reports/report_{safe_name}.html"

            saved_report = save_html_report(
                report,
                output_path
            )

        except Exception as e:

            saved_report = {
                "success": False,
                "message": str(e)
            }

    return {
        "success": True,
        "report": report,
        "saved_report": saved_report
    }


# ---------------------------------------------------
# LOCAL SERVER
# ---------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )