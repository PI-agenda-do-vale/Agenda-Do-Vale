FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Install Node.js (needed to build the SPA)
RUN apt-get update \
    && apt-get install -y curl gnupg ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN dotnet restore "AgendaDoVale.API/AgendaDoVale.API.csproj"
RUN dotnet publish "AgendaDoVale.API/AgendaDoVale.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV PORT=8080
ENV ASPNETCORE_URLS=http://+:${PORT}

EXPOSE ${PORT}

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AgendaDoVale.API.dll"]
