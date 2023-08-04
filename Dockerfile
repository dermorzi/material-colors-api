FROM denoland/deno:latest

VOLUME "/app"

WORKDIR "/app"

CMD ["deno", "task", "dev"]