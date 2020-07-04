FROM node:lts-alpine
MAINTAINER Network Reconnaissance Lab <baker@cs.uky.edu>

USER root
RUN apk add --no-cache clamav\
 clamav-libunrar;
# cron;

#Setup clamav
COPY conf /etc/clamav
RUN mkdir -p  /var/log/clamav
RUN touch /var/log/clamav/freshclam.log
RUN touch /var/log/clamav/clamd.log
RUN mkdir -p /var/lib/clamav/
RUN mkdir -p /run/clamav/
RUN chown node /var/log/clamav /var/log/clamav/freshclam.log /var/log/clamav/clamd.log /var/lib/clamav/ /run/clamav/
RUN chmod 600 /var/log/clamav/freshclam.log /var/log/clamav/clamd.log
RUN echo '53 * * * *   /usr/bin/freshclam --quiet' > /etc/crontabs/root

USER node
RUN freshclam
RUN crond -l 2

EXPOSE 3310

CMD ["clamd"]