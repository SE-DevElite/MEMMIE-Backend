| Endpoint                               | Method | Authentication | Format                        |
| -------------------------------------- | ------ | -------------- | ----------------------------- |
| /api/users/:id                         | GET    | No             | JSON                          |
| /api/auth/profile                      | GET    | Yes            | JSON                          |
| /api/auth/facebook                     | GET    | No             | JSON                          |
| /api/auth/google                       | GET    | No             | JSON                          |
| /api/uploads                           | GET    | Yes            | JSON                          |
| /api/follows/me                        | GET    | Yes            | JSON                          |
| /api/users/create                      | POST   | No             | [JSON](#apiuserscreate)       |
| /api/auth/login                        | POST   | No             | [JSON](#apiauthlogin)         |
| /api/follows                           | POST   | Yes            | [JSON](#apifollows)           |
| /api/friendlists/create                | POST   | Yes            | [JSON](#apifriendlistscreate) |
| /api/uploads/avatar                    | POST   | Yes            | FILE                          |
| /api/albums/create                     | POST   | Yes            | [JSON](#apialbumscreate)      |
| /api/friendlists/update/:friendlist_id | PATCH  | Yes            | [JSON](#update-friendlist)    |
| /api/albums/update/:album_id           | PATCH  | Yes            | [JSON](#update-album)         |
| /api/albums/delete/:album_id           | DELETE | Yes            | -                             |
| /api/friendlists/delete/:friendlist_id | DELETE | Yes            | -                             |

## /api/users/create

```json
{
  "username": "username",
  "password": "password"
}
```

## /api/auth/login

```json
{
  "username": "username",
  "password": "password"
}
```

## /api/follows

```json
{
  "follow_id": "follow_id"
}
```

## /api/friendlists/create

```json
{
  "friendlist_name": "friendlist_name"
}
```

## /api/albums/create

```json
{
  "album_name": "album_name"
}
```

## update friendlist

/api/friendlists/update/:friendlist_id

```json
{
  "friendlist_name": "friendlist_name"
}
```

## update album

/api/albums/update/:album_id

```json
{
  "album_name": "album_name"
}
```
