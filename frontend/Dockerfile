# pull official base image
FROM node:10.16.3
# set working directory
WORKDIR /frontend
# add app
COPY . ./
RUN npm install 
RUN npm install react-scripts@3.4.0
# start app
CMD ["npm", "start"]