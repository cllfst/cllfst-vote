# CLLFST voting app


## clone the repo
```
git clone https://github.com/cllfst/cllfst-vote.git
```

## Dev mode
### install mongodb
```
# install mongodb
$ sudo apt update && sudo apt install -y mongodb
```

### install packages & start the app
```
cd cllfst-vote/src && npm i && npm run dev
```

# Using docker
```
cd cllfst-vote/ && docker-compose up -d --build

```

## Init new ballot
Run curl/postman with:
- `Athorization` header set to admin password
- This following as the body
```
url: http://localhost:3000/ballots

{
	"ballotName": "test",
	"startDate": "2020-05-25T22:19:37.143Z",
	"endDate": "2020-06-25T22:19:37.143Z",
	"subject": "CLLFST Elections",
	"text": "Holà! Por favor use este enlace para votar: {}. Gracias",
	"emails": ["a", "b", "c"],
	"candidates": [
	    {
	        "name": "cand1",
	        "role": "SG"
	    },
	    {
	        "name": "cand2",
	        "role": "EX"
	    },
	    {
	        "name": "cand3",
	        "role": "IN"
	    },
	    {
	        "name": "cand4",
	        "role": "IN"
	    },
	    {
	        "name": "cand5",
	        "role": "SP"
	    },
	    {
	        "name": "cand6",
	        "role": "ME"
	    },
	    {
	        "name": "cand7",
	        "role": "ME"
	    },
	    {
	        "name": "cand5",
	        "role": "CM"
	    },
	    {
	        "name": "cand3",
	        "role": "MA"
	    }
	]
}
```