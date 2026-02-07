FROM oven/bun:1 as base

WORKDIR /usr

FROM base as install

RUN mkdir -p /temp/dev

COPY package.json bun.lock /temp/dev/

RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
