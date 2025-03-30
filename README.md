# Planorama

In order to run backend-service you must add environment variable
TOKEN_SECRET: The secret key used for token creation.
REFRESH_TOKEN_EXPIRE_TIME: Format: [Duration.parse()](https://docs.oracle.com/javase/8/docs/api/java/time/Duration.html)
The time refresh token is valid.
TOKEN_EXPIRE_TIME: Format: [Duration.parse()](https://docs.oracle.com/javase/8/docs/api/java/time/Duration.html)
The time access token is valid.

REFRESH_TOKEN_EXPIRE_TIME=PT1H;TOKEN_EXPIRE_TIME=PT1H;TOKEN_SECRET=matanWasHereAndNotAnyMore