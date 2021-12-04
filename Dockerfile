# This image has node already configured.
FROM docker.elastic.co/logstash/logstash:7.15.2

# A VERY BAD practice, but it works... (for now)
# All the file system contents are copied over (using multi-stage builds)
COPY --from=node:14 / /

# Set root user, to prevent any permission denied error.
USER root

# Set the working directory for any subsequent RUN, CMD, COPY
# and other commands. If the dir does not exist, create it.
WORKDIR /app

# Copy files from the local file system into the container's
# filesystem, in the path specified. Since WORKDIR points to
# /usr/src/app, the package*.json will be copied to that dir.
COPY . .

# Install npm dependencies and build app.
RUN npm install --production
RUN npm run build

# Port 5000 is inteded to be exposed. This line is for doc
# purposes. To actually expose the port, use the option -p
# when running «docker container run».
EXPOSE 5000

RUN rm -f /usr/share/logstash/pipeline/logstash.conf

RUN rm -f /usr/share/logstash/config/logstash.yml

ADD logstash/ /usr/share/logstash/pipeline/

ENTRYPOINT logstash & \
    npm run start
