FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production

ARG COMMIT_ID
ARG COMMIT_MSG
ENV COMMIT_ID=$COMMIT_ID
ENV COMMIT_MSG=$COMMIT_MSG

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 3000

CMD ["./start.sh"]
