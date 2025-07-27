@echo off
echo Starting Bella AI Server...
cd /d "D:\AI\Bella"

echo Trying Python server on port 8000...
python -m http.server 8000

pause