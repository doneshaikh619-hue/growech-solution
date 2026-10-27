@echo off
title Growech Dine POS — Pitch Demo
echo ========================================================
echo         GROWECH SOLUTION — RESTAURANT POS PITCH
echo ========================================================
echo.
echo Starting Growech Dine POS Web Demo on http://localhost:3000 ...
echo.
cd /d "%~dp0apps\web"
start "" http://localhost:3000
npx next dev --port 3000
pause
