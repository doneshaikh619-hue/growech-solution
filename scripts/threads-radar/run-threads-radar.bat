@echo off
title Growech Multi-Agent Threads Lead Radar (1-Minute Continuous Autopilot)
cd /d "%~dp0"
echo ====================================================
echo   GROWECH SOLUTION - 24/7 MULTI-AGENT THREADS RADAR
echo   Mode: 1-Minute Continuous Real-Time Autopilot
echo   Filter: Ultra-Fresh Leads Only (< 24 Hours)
echo ====================================================
echo Model: Google Gemini 3.8 Flash (Anti-AI Slop Humanizer)
echo.

:loop
echo [%date% %time%] Running 1-minute Threads scan cycle...
node threads-radar.cjs
echo.
echo ====================================================
echo Cycle complete. Waiting 60 seconds for next cycle...
echo Press Ctrl+C to stop.
echo ====================================================
timeout /t 60 /nobreak >nul
goto loop
