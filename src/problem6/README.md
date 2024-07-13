# Scoreboard API Service
This API service is designed to handle live updates to a scoreboard, displaying the top 10 user scores. The service ensures secure and efficient score updates and retrievals.

## Software Requirements
1. We have a website with a score board, which shows the top 10 user’s scores.
2. We want live update of the score board.
3. User can do an action (which we do not need to care what the action is), completing this action will increase the user’s score.
4. Upon completion the action will dispatch an API call to the application server to update the score.
5. We want to prevent malicious users from increasing scores without authorisation.

## Assumptions
- The system focuses solely on the scoreboard feature.
- Designed for 1 million daily active users (DAU).
- For ties in scores, only the last 10 users to update their scores are displayed.

### Database design
User:
- user_id: varchar
- email: varchar
- ...

Score:
- user_id: varchar
- score: int
- created_at: datetime
- updated_at: datetime

## API endpoint
### 1. Increase score:
PUT /score/increment
Authentication required to perform this API.

This api use to increase the user score.

Every time a user created, we will insert a record to Score tables to store that user's score
```sql
INSERT INTO score(user_id, score) VALUES('user_id_1', 0);
```

Update user's score with this sql:
```sql
UPDATE score SET score = score + 1 WHERE user_id = 'user_id_1'
```

### 2. View score board:
GET /score/top10
Retrieves the top 10 user scores.
Response:
```json
{
  "data": [
    { "userId": "string", "score": "number" },
    { "userId": "string2", "score": "number" },
    ...
  ]
}
```

The sql to select top 10 user scores:
```sql
SELECT user_id, score
FROM score
ORDER BY score DESC
LIMIT 10;
```


### 3. Websocket event to listen score changed
event_name: score_board_updated

FE should listen this event and re-retrieve top 10 users scores when this event is fired


### Execute flow
// Image here

## Improvements
### Performance Optimization for Top 10 Retrieval
The query to retrieve the top 10 users may become slow with a large number of users. To improve performance, use Redis to cache the top 10 scores.
Steps:
- 1.	Cache Initialization: Store the top 10 user scores in Redis.
- 2.	Score Update Handling: After updating a user’s score in the database, update the Redis cache.

After update a user's score, add that score to redis sorted set.
```bash
ZADD top10_scores <score> <user_id>
```
And trim to only keep top 10 highest scores
```bash
ZREMRANGEBYRANK top10_scores 10 -1
```

Update the api get top 10 users to read data from redis for read faster.

```bash
ZREVRANGE top10_scores 0 9 WITHSCORES
```
Note: Handle cache invalidation to ensure data consistency between Redis and the database.