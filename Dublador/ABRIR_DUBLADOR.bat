@echo off
title Dublador Animamente
cd /d "%~dp0"

set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY (
  where python >nul 2>nul && set "PY=python"
)
if not defined PY (
  echo.
  echo  Python nao encontrado neste computador.
  echo  Instale em https://www.python.org/downloads/
  echo  e marque a opcao "Add Python to PATH" na instalacao.
  echo  Depois abra este arquivo de novo.
  echo.
  start "" "https://www.python.org/downloads/"
  pause
  exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
  echo.
  echo  Primeira vez: preparando o Dublador. Isso so acontece uma vez...
  echo.
  %PY% -m venv .venv
  if errorlevel 1 goto erro
)

".venv\Scripts\python.exe" -c "import cv2, sounddevice, soundfile, numpy, PIL, imageio_ffmpeg" >nul 2>nul
if errorlevel 1 (
  echo  Instalando as bibliotecas (precisa de internet^)...
  ".venv\Scripts\python.exe" -m pip install --disable-pip-version-check -q --upgrade pip
  ".venv\Scripts\python.exe" -m pip install --disable-pip-version-check -r requirements.txt
  if errorlevel 1 goto erro
  ".venv\Scripts\python.exe" -c "import imageio_ffmpeg; imageio_ffmpeg.get_ffmpeg_exe()"
)

rem Cria o atalho na Area de Trabalho (uma vez so)
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=[Environment]::GetFolderPath('Desktop'); $l=Join-Path $d 'Dublador Animamente.lnk'; if(-not (Test-Path $l)){ $s=(New-Object -ComObject WScript.Shell).CreateShortcut($l); $s.TargetPath='%~dp0ABRIR_DUBLADOR.bat'; $s.WorkingDirectory='%~dp0'; $s.WindowStyle=7; $s.IconLocation='%SystemRoot%\System32\SHELL32.dll,168'; $s.Save() }" >nul 2>nul

start "" ".venv\Scripts\pythonw.exe" "%~dp0dublador.py"
exit /b 0

:erro
echo.
echo  Algo deu errado na preparacao. Confira a internet e tente de novo.
echo  Se continuar, apague a pasta .venv e abra este arquivo novamente.
echo.
pause
exit /b 1
