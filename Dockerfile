FROM node:20-slim

RUN apt update && \
    apt install -y ffmpeg python3-pip && \
    pip3 install yt-dlp

WORKDIR /app
COPY . .

RUN pnpm install

CMD ["npm", "run", "dev"]
