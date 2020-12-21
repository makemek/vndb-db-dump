Dump all character data from [vndb](https://vndb.org) in json format.
The entire operation takes around 3 hours because vndb starts to throttle its api endpoint once the amount of api requests reach 200.
The program has to wait for 10 minutes before resuming the operation.

# Installation
```
npm run build
```
Built files are located in `dist` folder.


# Usage
Available options provided using environment variables

**START_ID**

Type: Number

Default: 1

character's id begining range (inclusive)

**TO_ID**

Type: Number

character's id ending range (inclusive)

**USE_MIN_WAIT**

Type: Boolean

Default: false

Wait based on `minwait` response by vndb api.
The operation can continue for a few requests before vndb starts throttling again.
Waiting for `fullwait` (10 minutes) is more preferable which is the default option.
