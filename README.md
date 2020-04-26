# CLLFST voting app


## Clone the repo
```
git clone https://github.com/cllfst/cllfst-vote.git
```

## Run in dev mode
### install mongodb
```
sudo apt update && sudo apt install -y mongodb
```

### Install packages & start the app
```
cd cllfst-vote/src && npm i && npm run dev
```

### Send emails
If you want the app to send emails, you should provide correct
email account credentials (without two factors authentication).
You should also modify the security config of your account.

```
SENDER_EMAIL=<sender email address> SENDER_PASSWORD=<sender email password> npm run dev
```

# Using docker
cd inside the projects folder and add a .env file with your config:
```
$ cd cllfst-vote/
$ touch .env
$ cat .env

ADMIN_PASSWORD=<whatever>
SENDER_EMAIL=<sender email>
SENDER_PASSWORD=<sender password>
DB_HOST=<host>
DB_PORT=<port>
DB_NAME=<db name>
DB_UI_USERNAME=<whatever>
DB_UI_PASSWORD=<whatever>
DOMAIN_NAME=domain.com
```

Start containers
```
cd cllfst-vote/ && docker-compose up -d --build
```

## Init new ballot
Run curl/postman with:
- `Athorization` header set to admin password
- This following body
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