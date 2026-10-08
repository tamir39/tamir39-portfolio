@echo off
setlocal
cd /d "%~dp0"

rem Dedicated portfolio range; avoids Twohearts 3000/5173/5174,
rem Whitelable 3006/5175, and Mission Control 5180-5249.
rem Usage: run.bat [start-port]   Example: run.bat 5300
set "PORTFOLIO_START_PORT=%~1"
if not defined PORTFOLIO_START_PORT set "PORTFOLIO_START_PORT=5260"

"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-local.ps1" -StartPort "%PORTFOLIO_START_PORT%"
set "RUN_EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%RUN_EXIT_CODE%"=="0" (
  echo Portfolio stopped with error code %RUN_EXIT_CODE%. See the message above.
) else (
  echo Portfolio server stopped.
)
echo Press any key to close this window.
pause >nul
exit /b %RUN_EXIT_CODE%
