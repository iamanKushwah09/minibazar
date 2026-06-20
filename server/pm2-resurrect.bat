echo @echo off > C:\pm2-resurrect.bat
echo SET PATH=%%APPDATA%%\npm;%%PATH%% >> C:\pm2-resurrect.bat
echo pm2 resurrect >> C:\pm2-resurrect.bat
