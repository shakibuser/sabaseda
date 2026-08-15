@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "FAIL=0"
echo SABA MEDIA - FINAL PROJECT AUDIT
echo Read-only audit plus production build
echo.

echo [1] Project root
for %%F in (package.json astro.config.mjs) do (
 if exist "%%F" (echo PASS %%F) else (echo FAIL %%F & set "FAIL=1")
)

echo.
echo [2] Duplicate src
if exist "src\src" (echo FAIL src\src exists & set "FAIL=1") else echo PASS no src\src

echo.
echo [3] Backup files in src
powershell -NoProfile -ExecutionPolicy Bypass -Command "$b=Get-ChildItem src -Recurse -File -ErrorAction SilentlyContinue | ? { $_.Name -match '\.(bak|backup|tmp)$' -or $_.Name -match 'before-.*\.bak$' }; if($b){$b|%%{Write-Host ('WARNING '+$_.FullName)};exit 2}else{Write-Host 'PASS no backup/temp files'}"
if errorlevel 2 set "FAIL=1"

echo.
echo [4] Expected folders
for %%D in (src\components src\content src\layouts src\pages src\styles src\utils) do (
 if exist "%%D" (echo PASS %%D) else (echo FAIL %%D & set "FAIL=1")
)

echo.
echo [5] Mojibake scan
powershell -NoProfile -ExecutionPolicy Bypass -Command "$fs=Get-ChildItem src -Recurse -File -Include *.astro,*.ts,*.md,*.css; $bad=@(); foreach($f in $fs){$s=[IO.File]::ReadAllText($f.FullName);if($s -match '[\u256a\u2518\u250c\u2514\u251c\u2524\u2534\u252c\u00c2\u00c3]'){$bad+=$f.FullName}};if($bad){$bad|%%{Write-Host ('FAIL '+$_)};exit 2}else{Write-Host 'PASS no common mojibake markers'}"
if errorlevel 2 set "FAIL=1"

echo.
echo [6] Important files
for %%F in (
 src\components\Header.astro
 src\components\Footer.astro
 src\components\NewsCard.astro
 src\components\Seo.astro
 src\layouts\BaseLayout.astro
 src\pages\index.astro
 src\pages\news\index.astro
 src\pages\news\[slug].astro
 src\pages\category\[category].astro
 src\pages\robots.txt.ts
 src\pages\rss.xml.ts
 src\pages\sitemap.xml.ts
 src\content.config.ts
) do (
 if exist "%%F" (echo PASS %%F) else (echo FAIL %%F & set "FAIL=1")
)

echo.
echo [7] Repair/base64 contamination scan
powershell -NoProfile -ExecutionPolicy Bypass -Command "$fs=Get-ChildItem src -Recurse -File -Include *.astro,*.ts,*.md,*.css; $bad=@(); foreach($f in $fs){$s=[IO.File]::ReadAllText($f.FullName);if($s -match '\$p\s*=|FromBase64String|Expand-Archive|sabaseda-src-clean\.zip'){$bad+=$f.FullName}};if($bad){$bad|%%{Write-Host ('FAIL '+$_)};exit 2}else{Write-Host 'PASS no repair/install commands in src'}"
if errorlevel 2 set "FAIL=1"

echo.
echo [8] News content
powershell -NoProfile -ExecutionPolicy Bypass -Command "$fs=Get-ChildItem src\content\news -File -Filter *.md -ErrorAction SilentlyContinue;if(!$fs){Write-Host 'FAIL no news markdown';exit 2};$bad=0;foreach($f in $fs){$s=[IO.File]::ReadAllText($f.FullName);foreach($k in @('title:','summary:','category:','publishedAt:','image:','imageAlt:')){if($s -notmatch ('(?m)^'+[regex]::Escape($k))){Write-Host ('WARNING '+$f.Name+' missing '+$k);$bad=1}}};if($bad){exit 2}else{Write-Host ('PASS '+$fs.Count+' news files with required frontmatter')}}"
if errorlevel 2 set "FAIL=1"

echo.
echo [9] Config
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Get-Content -Raw package.json;$a=Get-Content -Raw astro.config.mjs;if($p -notmatch 'astro'){Write-Host 'FAIL Astro dependency';exit 2};if($a -notmatch 'https://sabaseda\.ir'){Write-Host 'FAIL site URL';exit 2};Write-Host 'PASS package and site config'"
if errorlevel 2 set "FAIL=1"

echo.
echo [10] Sitemap
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=Get-Content -Raw src\pages\sitemap.xml.ts;if($s -notmatch 'getCollection' -or $s -notmatch 'application/xml' -or $s -notmatch 'sitemaps.org'){Write-Host 'FAIL sitemap';exit 2}else{Write-Host 'PASS sitemap source'}"
if errorlevel 2 set "FAIL=1"

echo.
echo [11] robots and RSS
for %%F in (src\pages\robots.txt.ts src\pages\rss.xml.ts) do (
 if exist "%%F" (echo PASS %%F) else (echo FAIL %%F & set "FAIL=1")
)

echo.
echo [12] Production build
call npm run build
if errorlevel 1 (echo FAIL build & set "FAIL=1") else echo PASS build

echo.
if "%FAIL%"=="0" (echo AUDIT RESULT: PASS) else echo AUDIT RESULT: REVIEW REQUIRED
echo.
pause
exit /b %FAIL%
