FROM node:latest
COPY . /f/Jypt
RUN cd /f/Jypt; npm install
EXPOSE 7770
CMD ["node", "/f/Jypt/app.js"]