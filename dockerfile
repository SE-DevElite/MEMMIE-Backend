FROM node:18.3.0-alpine3.14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Expose the port the application will listen on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]