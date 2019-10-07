FROM arm32v7/node

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get -y install sudo curl python-openssl libnss3-tools zenity gconf-service libasound2 libatk1.0-0 libc6 \
      libcurl3 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
      libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
      libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
      libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
      libappindicator1 libnss3 lsb-release xdg-utils wget

RUN sudo su

ENV RUNLEVEL 1

RUN wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/14480448/+files/chromium-codecs-ffmpeg-extra_65.0.3325.181-0ubuntu0.14.04.1_armhf.deb
RUN dpkg -i chromium-codecs-ffmpeg-extra_65.0.3325.181-0ubuntu0.14.04.1_armhf.deb

RUN wget https://launchpad.net/~chromium-team/+archive/ubuntu/stable/+build/14480448/+files/chromium-browser_65.0.3325.181-0ubuntu0.14.04.1_armhf.deb
RUN dpkg -i chromium-browser_65.0.3325.181-0ubuntu0.14.04.1_armhf.deb

ENV CHROMIUM_EXECUTABLE /usr/bin/chromium-browser