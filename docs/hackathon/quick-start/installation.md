# Installation & Setup

This guide will help you install and set up OptimumP2P on your computer. We'll explain each step clearly, so don't worry if you're new to some of these tools.

## What You'll Need

Before we start, you need these programs on your computer:

### 1. Docker
Docker is like a virtual container that runs applications in an isolated environment. Think of it as a box where we put our OptimumP2P network so it doesn't interfere with other programs on your computer.

**Install Docker:**
- **Windows/Mac**: Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
- **Linux**: Follow the instructions for your distribution on [docs.docker.com](https://docs.docker.com/engine/install/)

**How to check if Docker is installed:**
Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type:
```bash
docker --version
```


### 2. Docker Compose
Docker Compose helps us run multiple Docker containers together. It usually comes with Docker Desktop, but let's verify:

```bash
docker-compose --version
```


### 3. Git (Optional but recommended)
Git helps you download and manage code. Most computers have it pre-installed.

```bash
git --version
```

## Getting the Code

You have two options to get the OptimumP2P setup files:

### Option 1: Download from this documentation
Create a new folder on your computer and save the docker-compose.yml files from the [Deployment Options](../deployment/) section.

### Option 2: Clone the development setup repository
```bash
git clone https://github.com/getoptimum/optimum-dev-setup-guide.git
cd optimum-dev-setup-guide
```

## Troubleshooting

### "Docker command not found"
- Make sure Docker is installed and running
- On Windows/Mac, start Docker Desktop application
- You might need to restart your terminal after installation

### "Permission denied" on Linux
Add your user to the docker group:
```bash
sudo usermod -aG docker $USER
```
Then log out and log back in.

### "Port already in use"
If you see port conflicts, either:
- Stop other programs using those ports
- Change the port numbers in the docker-compose.yml file

### Still having issues?
- Check Docker's own troubleshooting guide
- Make sure you have enough disk space (at least 2GB free)
- Restart your computer and try again

## System Requirements

**Minimum:**
- 4GB RAM
- 2GB free disk space
- Internet connection for downloading Docker images

**Recommended:**
- 8GB RAM
- 5GB free disk space
- Stable internet connection

You're now ready to start your OptimumP2P journey! 