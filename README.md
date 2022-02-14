# Northcoders News API

## Setup

Note that you will need to create two files in order to access the `nc_news` and `nc_news_test` databases in this project. Each of these files will need to set the `PGDATABASE` environmental variable to their respective local locations.
 
```
.env.development
.env.test
```

These files will each need these lines of code respectively:

```
PGDATABASE=nc_news
```

and

```
PGDATABASE=nc_news_test
```