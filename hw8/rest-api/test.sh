# POST accounts
curl http://localhost:8080/accounts -H "Content-Type: application/json" -X POST -d '{"balance":100, "name":"checking"}' -i
curl http://localhost:8080/accounts -H "Content-Type: application/json" -X POST -d '{"balance":200, "name":"saving"}' -i

# GET accounts
curl http://localhost:8080/accounts -i

# PUT update
curl http://localhost:8080/accounts/0 -H "Content-Type: application/json" -X PUT -d '{"balance":300, "name":"saving"}' -i

# GET accounts again
curl http://localhost:8080/accounts -i

# DELETE an account
curl http://localhost:8080/accounts/0 -X DELETE -i

# GET accounts again
curl http://localhost:8080/accounts -i
