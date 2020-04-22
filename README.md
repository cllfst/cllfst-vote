# CLLFST voting app

```
install mongodb
# sudo systemctl start mongod
# mongo
>db votes
>db.createCollection('voters')
>db.createCollection('IDs')


git clone https://github.com/cllfst/cllfst_vote.git

cd cllfst_vote

npm install

PASSWORD=<your password> EMAIL=<your email> npm start

Open browser at localhost:3000/

You should see the message: "Please check you email inbox !"
```
