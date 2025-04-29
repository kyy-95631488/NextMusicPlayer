FROM node:20-slim

# Install dependencies: ffmpeg, python3, pip, venv
RUN apt update && \
    apt install -y ffmpeg python3-venv python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Setup Python venv and install yt-dlp
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install yt-dlp

# Add yt-dlp to path
ENV PATH="/venv/bin:$PATH"

# Create app directory
WORKDIR /

# Copy files
COPY . .

# Install Node dependencies
RUN npm install -g pnpm && pnpm install

# Build the Next.js app
RUN pnpm build

# Use production server
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "start"]
