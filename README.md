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
Run curl with:
- `Athorization` header set to admin password
- This following as the body
```{
	"ballotName": "test1",
	"subject": "CLLFST Elections",
	"emails": ["a", "b", "c"],
	"candidates": [
		{
		    "name": "cand1",
		    "role": "IN",
		    "votes": 3
		},
		{
		    "name": "cand2",
		    "role": "SG",
		    "votes": 3
		}
	]
}```