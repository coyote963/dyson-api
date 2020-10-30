FROM node:12.18.3
SHELL ["/bin/bash", "-c"]
WORKDIR /opt/app-root/src/
COPY . .
RUN npm install --dev --verbose
EXPOSE 8081
CMD ["npm", "run", "start"]