FROM node:16-alpine
RUN mkdir /server
WORKDIR /server
COPY ./ ./
RUN npm i
EXPOSE 3000
CMD npm start