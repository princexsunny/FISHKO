@echo off
REM ============================================================
REM  FISHKO.IN - push code to GitHub (safe: skips .env & keys)
REM  Just double-click this file, or run it from Command Prompt
REM  inside the fishko-server folder.
REM ============================================================
setlocal
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [X] Git is not installed. Get it from https://git-scm.com/download/win
  pause
  exit /b 1
)

REM --- first-time setup: init repo + set remote ---
if not exist ".git" (
  echo First time setup...
  git init
  git branch -M main
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  set /p REPOURL="Paste your GitHub repo URL (e.g. https://github.com/you/fishko.git): "
  git remote add origin %REPOURL%
)

REM --- commit message ---
set /p MSG="Commit message (press Enter for 'update site'): "
if "%MSG%"=="" set MSG=update site

echo.
echo Uploading to GitHub...
git add .
git commit -m "%MSG%"
git push -u origin main

echo.
if errorlevel 1 (
  echo [!] Push finished with an error above. If it says 'rejected', run:  git pull --rebase origin main   then run this script again.
) else (
  echo [OK] Done! Your code is on GitHub. Render will auto-deploy in ~2 minutes.
)
echo.
pause
