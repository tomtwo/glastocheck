# glastocheck

A small serverless 

## Prerequisites:
[serverless](https://serverless.com)

## Setup
### install dependencies

`yarn`

### provide some config in `config.js`:

```
    {
        TELEGRAM_TOKEN: 'YOUR_TELEGRAM_BOT_TOKEN'
    }
```

## Testing

### invoke locally to test using `serverless`

`serverless invoke local -f check`

## Deployment

### deploy to run check every 15 minutes on aws lambda:

- `serverless deploy`


## License
ISC