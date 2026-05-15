#!/usr/bin/env bash
set -euo pipefail

# Build frontend
echo "Building frontend..."
cd AgendaDoVale.API/ClientApp
npm ci --silent
npm run build --silent
cd ../..

# Publish .NET app
echo "Publishing API..."
dotnet restore "AgendaDoVale.API/AgendaDoVale.API.csproj"
dotnet publish "AgendaDoVale.API/AgendaDoVale.API.csproj" -c Release -o /app/publish

# Run the published app
echo "Starting API..."
exec dotnet /app/publish/AgendaDoVale.API.dll
