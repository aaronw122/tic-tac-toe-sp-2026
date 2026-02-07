FROM oven/bun:1 AS base

WORKDIR /usr/src/app

FROM base AS install

RUN mkdir -p /temp/dev

COPY package.json bun.lock /temp/dev/

RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN chown -R bun:bun /usr/src/app

USER bun

EXPOSE 5173/tcp

CMD ["bun", "run", "server.ts"]
