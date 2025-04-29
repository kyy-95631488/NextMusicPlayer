FROM node:20-slim

# Install required packages
RUN apt update && \
    apt install -y ffmpeg python3-venv python3-pip

# Buat virtual environment dan install yt-dlp di dalamnya
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install yt-dlp

# Tambahkan /venv/bin ke PATH agar yt-dlp bisa dipanggil langsung
ENV PATH="/venv/bin:$PATH"

# Set working directory dan copy file
WORKDIR /app
COPY . .

RUN npm install -g pnpm && pnpm install

CMD ["npm", "run", "dev"]
