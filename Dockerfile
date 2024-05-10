# Use Node.js 20 on Alpine Linux 3.18 as the base image
FROM node:20-alpine3.18 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using Yarn
RUN yarn install --production
COPY . .
RUN yarn build

# Expose the port Next.js is running on (usually 3000)
EXPOSE 3001

# Command to run the Next.js application
CMD ["yarn", "start", "-p", "3001"]
