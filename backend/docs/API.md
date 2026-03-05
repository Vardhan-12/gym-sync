POST /api/auth/login

Body:
{
 "email": "user@test.com",
 "password": "123456"
}

Response:
{
 "accessToken": "...",
 "user": {...}
}