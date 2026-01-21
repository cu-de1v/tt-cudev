FROM python:3.11-slim

# install yt-dlp + ffmpeg
RUN pip install --no-cache-dir yt-dlp \
 && apt-get update \
 && apt-get install -y ffmpeg \
 && apt-get clean

# install node
RUN apt-get install -y nodejs npm

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
