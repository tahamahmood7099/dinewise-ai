from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import EvaluationMetrics
from ..ml.evaluation_engine import evaluate_models

router = APIRouter(prefix="/evaluation", tags=["Model Evaluation"])

@router.get("", response_model=List[EvaluationMetrics])
def get_model_evaluation(k: int = 5, db: Session = Depends(get_db)):
    """
    Evaluate and benchmark Popularity, Content-Based, Collaborative Filtering, 
    and Hybrid engines with Precision@K, Recall@K, F1 Score, and NDCG@K.
    """
    return evaluate_models(db, k=k)
