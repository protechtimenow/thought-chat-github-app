# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create data directories
RUN mkdir -p data/installations data/webhooks logs

# Create non-root user for security
RUN addgroup -g 1001 -S thoughtchat && \
    adduser -S thoughtchat -u 1001 -G thoughtchat

# Change ownership of app directory
RUN chown -R thoughtchat:thoughtchat /app
USER thoughtchat

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]