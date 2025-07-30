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
You should see something like `Docker version 20.10.x`

### 2. Docker Compose
Docker Compose helps us run multiple Docker containers together. It usually comes with Docker Desktop, but let's verify:

```bash
docker-compose --version
```
You should see something like `docker-compose version 1.29.x`

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

## Choose Your Setup

OptimumP2P can run in two ways:

1. **P2P Network Only** - Direct peer-to-peer communication (more advanced)
2. **P2P Network with Gateway** - Includes a web-friendly layer (recommended for beginners)

For your first time, we recommend starting with the **Gateway setup** because:
- It's easier to test and see results
- You can use simple web tools to send messages
- It includes helpful monitoring tools

## Quick Test

Let's do a simple test to make sure everything works:

1. Create a new folder called `optimum-test`:
```bash
mkdir optimum-test
cd optimum-test
```

2. Create a simple test file:
```bash
echo "version: '3.8'
services:
  test:
    image: hello-world" > docker-compose.yml
```

3. Run the test:
```bash
docker-compose up
```

If you see "Hello from Docker!" message, everything is working correctly.

4. Clean up:
```bash
docker-compose down
```

## What's Next?

Now that you have everything installed:

1. **Learn the basics**: Read [Core Concepts](./concepts.md) to understand how OptimumP2P works
2. **Try it out**: Follow [First Message Example](./first-message.md) to send your first message
3. **Build something**: Check out [Client Development](../clients/) to create your own application

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