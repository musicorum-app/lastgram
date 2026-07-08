# lastgram

> **Warning**
> Still in development, not ready for production!
> Consult the [issue board](https://musicorum.jetbrains.space/p/main/issue-boards/lastgram) for more information.

## to fix before production

- [ ] groupln: show what users are listening to in the group (add a modifiedAt property that gets updated when the user runs a command on the group so we only query the first 10 users of the group)
- [ ] centralize artist/album/track scrobble on fm client functions (possibly on the middleware?)
- [ ] add privacy mode
- [ ] on `(platforms.telegram): The Telegram API returned an error: Bad Request: wrong type of the web page content` show the URL in question
- [ ] add duotone command
- [ ] match command
- [ ] add cli command to sync telegram commands
- [ ] replace i18next?