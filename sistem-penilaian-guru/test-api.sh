#!/bin/bash

echo "Testing Register API..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}' \
  -w "\n\nHTTP Status: %{http_code}\n"

echo -e "\n\nTesting Login API..."
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}' \
  -w "\n\nHTTP Status: %{http_code}\n"
