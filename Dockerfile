FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 3000

CMD ["./start.sh"]
