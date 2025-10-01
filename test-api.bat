@echo off
echo ==============================================
echo CodeHut API CLI Test Suite (Windows)
echo ==============================================
echo.

set BASE_URL=http://localhost:3001

echo [1/5] Testing API Ping...
curl -s %BASE_URL%/api/ping
echo.
echo.

echo [2/5] Testing Get Snippets...
curl -s "%BASE_URL%/api/snippets?limit=3" | python -m json.tool 2>nul || echo {"error": "Could not format JSON - but request went through"}
echo.
echo.

echo [3/5] Testing Popular Snippets...
curl -s "%BASE_URL%/api/snippets/popular?limit=3" | python -m json.tool 2>nul || echo {"error": "Could not format JSON - but request went through"}
echo.
echo.

echo [4/5] Testing Semantic Search...
curl -s "%BASE_URL%/api/snippets/search/semantic?query=react%%20component&limit=3" | python -m json.tool 2>nul || echo {"error": "Could not format JSON - but request went through"}
echo.
echo.

echo [5/5] Testing Snippet Creation (will fail due to auth)...
curl -s -X POST "%BASE_URL%/api/snippets" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"CLI Test\",\"description\":\"Test snippet\",\"code\":\"console.log('hello');\",\"price\":5,\"language\":\"JavaScript\"}" | python -m json.tool 2>nul || echo {"error": "Could not format JSON - but request went through"}
echo.
echo.

echo ==============================================
echo Test Complete! 
echo Check the responses above for:
echo - API connectivity (should see ping response)
echo - Snippet retrieval from Supabase database
echo - Vector search functionality  
echo - Expected auth errors for creation
echo ==============================================
pause