# syntax=docker/dockerfile:1

FROM golang:1.24-alpine AS build

WORKDIR /src

# Cache dependency downloads separately from application source changes.
COPY go.mod go.sum ./
RUN go mod download

COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /server .

FROM alpine:3.21

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app
COPY --from=build /server ./server

USER app

EXPOSE 8000

ENTRYPOINT ["./server"]
