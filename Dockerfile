#zbvs/kiwizzle:kiwizzle-front-1.0.0
FROM node:16-buster
RUN npm config set registry https://registry.npmjs.org/
RUN npm install -g serve
RUN mkdir /app
WORKDIR /app
ADD ./kiwizzle-front /app/
ENTRYPOINT ["bash","/app/front-entry.sh"]
