# leaderboard
A RESTful leaderboard service with CORS support.

# Tutorial
To use leaderboard, simply clone the repository and run *index.js* with Node.

Note: Looking over *config.json* and updating it to match your needs is strongly recommended.

## Requests
| Method | URL             | Description                                                           |
| ------ | --------------- | -----------                                                           |
| GET    | /top/*n*?*guid* | Gets the top *n* users; setting the "owned" property based on *guid*. |
| GET    | /rank/*guid*    | Gets the player rank based on *guid*.                                 |
| POST   | /score/*guid*   | Sets the users score.                                                 |
