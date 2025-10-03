@echo off
echo.
echo ========================================
echo   PLAGIARISM DETECTION TEST
echo ========================================
echo.
echo Testing plagiarism detection with sample code...
echo.

REM Test 1: Original code (should PASS)
echo [Test 1] Checking original code...
curl -X POST http://localhost:3000/api/snippets/detect-plagiarism ^
  -H "Content-Type: application/json" ^
  -d "{\"code\": \"function unique_12345() { console.log('This is totally unique code that nobody has written before!'); return Math.random() * 999999; }\"}" ^
  2>nul
echo.
echo.

REM Test 2: Similar to existing code (should REVIEW or BLOCK)
echo [Test 2] Checking code similar to existing snippets...
curl -X POST http://localhost:3000/api/snippets/detect-plagiarism ^
  -H "Content-Type: application/json" ^
  -d "{\"code\": \"console.log('Uploaded via curl');\"}" ^
  2>nul
echo.
echo.

echo ========================================
echo   TESTS COMPLETE
echo ========================================
echo.
echo Check the similarity scores above!
echo - Similarity ^<65%% = PASS (original)
echo - Similarity 65-85%% = REVIEW (suspicious)  
echo - Similarity ^>=85%% = BLOCK (plagiarism)
echo.
pause
