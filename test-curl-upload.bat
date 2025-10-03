@echo off
echo Testing curl upload endpoint...
curl -X POST http://localhost:3000/api/snippets/upload-curl ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"Test Curl Upload\", \"code\": \"console.log('Uploaded via curl');\", \"description\": \"Testing the curl upload endpoint\", \"language\": \"JavaScript\", \"author\": \"CurlTest\", \"authorId\": \"curl-test-123\", \"price\": 0, \"tags\": [\"test\", \"curl\"], \"framework\": \"Node.js\"}"
echo.
echo Upload complete!
