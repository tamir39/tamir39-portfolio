@echo off
setlocal

echo.
echo  // booting tamir.os ...
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [!] Node.js is not installed. Install Node 20+ from https://nodejs.org and retry.
    exit /b 1
)

if not exist "node_modules" (
    echo  // installing dependencies ...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo [!] npm install failed.
        exit /b 1
    )
)

echo  // starting dev server at http://localhost:3000
echo  // press Ctrl+C to stop
echo.

call npm run dev

endlocal
