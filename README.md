Steam game's reviews analyzer

![Index page](./prototype/main-index.png)

# Usage

## Setup

```bash
python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

## Local Development

modify the **appid** you want to fetch in `main.py`

```bash
python main.py
```

## Client

Client part developed with React. located on `/client`

### Local Development

```bash
cd ./client

# start local dev server
pnpm dev
# or
npm run dev
```

# Steam related resouces

- [All supported languages constants](https://partner.steamgames.com/doc/store/localization)
