# Použijeme oficiální Node.js obraz s Debianem (Bullseye)
FROM node:18-bullseye

# Nastavíme pracovní adresář
WORKDIR /usr/src/app

# Zkopírujeme package.json a package-lock.json
COPY package*.json ./

# Nainstalujeme závislosti
RUN npm install

# Zkopírujeme zbytek aplikace
COPY . .

# Nainstalujeme potřebné knihovny pro Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm-dev \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    gnupg \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Otevřeme port 3000
EXPOSE 3000

# Spustíme server
CMD ["node", "server.js"]