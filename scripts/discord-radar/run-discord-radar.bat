@echo off
title Growech Discord Lead Radar (24/7 Autopilot)
cd /d "%~dp0"
echo ====================================================
echo   GROWECH SOLUTION - 24/7 DISCORD LEAD RADAR
echo   Mode: 1-Minute Continuous Autopilot
echo   Origin Servers: Furlough, Reactiflux, TPH, Devs For Hire, n8n
echo ====================================================
echo Model: Google Gemini 3.8 Flash (Anti-AI Slop Humanizer)
echo.

:loop
echo [%date% %time%] Running Discord Lead Radar cycle...
node discord-radar.cjs
echo.
echo ====================================================
echo Cycle complete. Waiting 60 seconds for next cycle...
echo Press Ctrl+C to stop.
echo ====================================================
timeout /t 60 /nobreak >nul
goto loop
