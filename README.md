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

## Init new ballot (TODO: add form)
Run curl/postman with:
- `Athorization` header set to admin password
- This following body
PS: dates should be in UTC,
PPS: the {} symbol will be replaced by the voting link
```
url: http://localhost:3000/ballots

{
	"ballotName": "Test",
	"startDate": "2020-05-01T23:05:00.000Z",
	"endDate":	 "2020-05-30T23:10:00.000Z",
	"subject": "Vote",
	"text": "Please use this link to vote: {}. Thank you!",
	"emails": ["a", "b", "c],
	"candidates": [
	    {
	        "name": "cand1",
	        "role": "Secrétaire général"
	    },
	    {
	        "name": "cand2",
	        "role": "Responsable Externe"
	    },
	    {
	        "name": "cand3",
	        "role": "Responsable Interne"
	    },
	    {
	        "name": "cand4",
	        "role": "Responsable Interne"
	    },
	    {
	        "name": "cand5",
	        "role": "Responsable Sponsoring"
	    },
	    {
	        "name": "cand6",
	        "role": "Responsable Médiatisation"
	    },
	    {
	        "name": "cand7",
	        "role": "Responsable Médiatisation"
	    },
	    {
	        "name": "cand8",
	        "role": "Community Manager"
	    },
	    {
	        "name": "cand9",
	        "role": "Responsable Matériel"
	    }
	]
}
```
