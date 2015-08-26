
export BEARER=MY_TOKEN_FROM_THE_CONSOLE

curl https://api.runkeeper.com/fitnessActivities?pageSize=100        -H "Authorization: Bearer $BEARER" > page1.json
curl https://api.runkeeper.com/fitnessActivities?pageSize=100&page=2 -H "Authorization: Bearer $BEARER" > page2.json
curl https://api.runkeeper.com/fitnessActivities?pageSize=100&page=3 -H "Authorization: Bearer $BEARER" > page3.json
curl https://api.runkeeper.com/fitnessActivities?pageSize=100&page=4 -H "Authorization: Bearer $BEARER" > page4.json
curl https://api.runkeeper.com/fitnessActivities?pageSize=100&page=5 -H "Authorization: Bearer $BEARER" > page5.json

jq '.items' page*.json | grep uri | sed 's/^.*"\///g' | sed 's/"//g' > urls.txt

mkdir fitnessActivities

while read p; do
  curl https://api.runkeeper.com/$p -H "Authorization: Bearer $BEARER" > $p.json
done < urls.txt
