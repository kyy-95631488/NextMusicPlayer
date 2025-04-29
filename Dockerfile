FROM node:20-slim

# Install dependencies
RUN apt update && \
    apt install -y ffmpeg python3-venv python3-pip && \
    python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install yt-dlp && \
    apt clean && rm -rf /var/lib/apt/lists/*

ENV PATH="/venv/bin:$PATH"

# Set workdir
WORKDIR /app

# Copy package files first to install dependencies (Docker cache optimization)
COPY package.json pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

# Copy remaining files
COPY . .

# Expose port if needed (default for Next.js)
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
