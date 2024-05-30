# Pappers

This project is a Node.js / Express.js backend to interact with Pappers API.

## If you want to try it use :

### `docker compose up`

To run the app on port 3000

A Pappers API functioning key is needed in a .env file : `API_KEY='your_api_key'`

A webhook.site URL is needed in a .env fil : `WEBHOOK='webhook.site/url'`

## You can use two routes :

### GET `/company/:siren`

Fetch a company with a certain SIREN, and get all companies linked to each person in the company.
All data is then sent to the webhook.

### GET `/jobs`

Get all jobs in progress
