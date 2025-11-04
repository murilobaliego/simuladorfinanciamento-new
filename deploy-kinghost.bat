@echo off
echo === Building Application ===
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo === Uploading Files ===
echo Please ensure you have SCP/SSH client installed (Git Bash, WSL, or PuTTY)
echo.
echo Run these commands manually:
echo.
echo scp -r dist/* simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/
echo scp package.json simuladorfinanciamento@ftp.simuladorfinanciamento.com:~/apps_nodejs/
echo.
echo Then SSH and run:
echo ssh simuladorfinanciamento@ftp.simuladorfinanciamento.com
echo cd ~/apps_nodejs
echo nvm use 22.1.0
echo npm install --production
echo pm2 restart simuladorfinanciamento
echo.
pause
