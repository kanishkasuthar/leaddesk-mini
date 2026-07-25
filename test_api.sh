TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@leaddesk.com","password":"Password123!"}' | jq -r '.token')
echo "Token: $TOKEN"

echo "Testing GET /api/leads"
curl -s -X GET http://localhost:5001/api/leads -H "Authorization: Bearer $TOKEN" | jq .

echo "Testing POST /api/leads"
LEAD_ID=$(curl -s -X POST http://localhost:5001/api/leads -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@doe.com", "budget": "Above ₹50,000", "message": "hello"}' | jq -r '.data.id')
echo "Created lead ID: $LEAD_ID"

echo "Testing PUT /api/leads/:id (Status Update)"
curl -s -X PUT http://localhost:5001/api/leads/$LEAD_ID -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"status": "Contacted"}' | jq .

echo "Testing Search"
curl -s -X GET http://localhost:5001/api/leads/search?q=John -H "Authorization: Bearer $TOKEN" | jq .

