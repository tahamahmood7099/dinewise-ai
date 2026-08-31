@echo off
echo =========================================================================
echo  BharatBite AI - Food Recommendation & Customer Behavior System
echo =========================================================================
echo.
echo Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start "BharatBite AI Backend" cmd /k "cd /d %~dp0backend && python run.py"

echo Starting Next.js Frontend Server on http://localhost:3000 ...
start "BharatBite AI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Application successfully launched!
echo - Frontend: http://localhost:3000
echo - Backend API & Docs: http://127.0.0.1:8000/docs
echo.
pause
