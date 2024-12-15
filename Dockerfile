# Wybierz bazowy obraz Node.js
FROM node:18

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki zależności
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj cały kod backendu
COPY . .

# Otwórz port dla backendu
EXPOSE 5001

# Uruchom serwer
CMD ["node", "app.js"]
