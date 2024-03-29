FROM node AS builder

COPY . /src/

WORKDIR /src/

RUN yarn && yarn build

FROM caddy AS base

COPY --from=builder /src/build/ /srv/build

COPY ./Caddyfile /Caddyfile

CMD ["caddy", "run", "-config", "/Caddyfile"]
