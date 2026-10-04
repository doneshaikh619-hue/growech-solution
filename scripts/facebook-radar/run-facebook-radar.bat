@echo off
title Growech Facebook Client Lead Radar
cd /d "%~dp0"
echo ====================================================
echo   GROWECH SOLUTION - 24/7 FACEBOOK LEAD RADAR
echo ====================================================
echo Starting autonomous scan for high-intent client leads...
echo.
node facebook-radar.cjs
echo.
echo ====================================================
echo Scan complete. Check facebook_radar.log and captured_leads.json
echo ====================================================
pause
