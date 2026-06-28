@echo off
REM Node.js Express Backend - Quick Start Script for Windows

echo.
echo ========================================
echo Express Auth Backend - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
echo Installing npm dependencies...
call npm install

echo.
echo ========================================
echo Starting Express Server...
echo ========================================
echo.
echo The application will be available at:
echo   - Main API: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start

pause
