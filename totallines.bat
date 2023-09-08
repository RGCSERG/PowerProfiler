@echo off
setlocal enabledelayedexpansion

set total_lines=0

for /f %%f in ('git ls-files') do (
    set "file=%%f"
    for /f %%c in ('type "%%f" ^| find /c /v ""') do (
        set /a total_lines+=%%c
    )
)

echo Total lines of code: %total_lines%
