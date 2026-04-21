@ECHO OFF
SETLOCAL

SET "BASEDIR=%~dp0"
REM %~dp0 includes a trailing backslash; a trailing "\" inside quoted -D values can break argv parsing.
IF "%BASEDIR:~-1%"=="\" SET "BASEDIR=%BASEDIR:~0,-1%"

SET "WRAPPER_DIR=%BASEDIR%\\.mvn\\wrapper"
SET "WRAPPER_JAR=%WRAPPER_DIR%\\maven-wrapper.jar"
SET "WRAPPER_JAR_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

IF NOT EXIST "%WRAPPER_JAR%" (
  IF NOT EXIST "%WRAPPER_DIR%" (
    MKDIR "%WRAPPER_DIR%" >NUL 2>&1
  )
  ECHO Downloading Maven Wrapper...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='Stop';" ^
    "Invoke-WebRequest -Uri '%WRAPPER_JAR_URL%' -OutFile '%WRAPPER_JAR%';"
  IF ERRORLEVEL 1 (
    ECHO Failed to download Maven Wrapper. 1>&2
    EXIT /B 1
  )
)

SET "JAVA_EXE=java"

"%JAVA_EXE%" ^
  "-Dmaven.multiModuleProjectDirectory=%BASEDIR%" ^
  -classpath "%WRAPPER_JAR%" ^
  org.apache.maven.wrapper.MavenWrapperMain %*

ENDLOCAL
