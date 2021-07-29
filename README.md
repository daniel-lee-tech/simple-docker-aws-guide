# Deploying a Docker Container to AWS ECR Repositories

## Creating your Docker Image

Create a Docker Image using a Dockerfile.
After writing up your Dockerfile, build your Docker Image by running this in the terminal. Think of a good Docker Image Name that you can use for the following shell commands.

```bash
cd <PATH_TO_DOCKERFILE>
docker built -t <DOCKER_IMAGE_NAME> .

# example
cd ~/code/docker-folder
docker build -t simple-docker-image
```
## Verifying your Docker Image

### Check Docker Built Correctly
You can verify if your Docker Image was built correctly if you run this following command.

```bash
docker images --filter reference=<DOCKER_IMAGE_NAME>

# example
docker images --filter reference=simple-docker-image
```

If successful, you should see your docker image listed.

### Check Docker Image actually works
Run your docker image locally to make sure it works, like so:

```bash
docker run -it -p <HOST_PORT>:<DOCKER_PORT> <DOCKER_IMAGE_NAME>

# example
docker run it -p 80:80 simple-docker-image
```

In my example, I open up `localhost:80` and I see my container is running. Once verified you can stop the docker container like so:

```bash
docker container stop <DOCKER_IMAGE_NAME>

# example
docker container stop simple-docker-image
```

## Pushing Docker Image to AWS

Make sure your have your AWS CLI installed and configured with your access key(s).

### Create Repository to Hold Your Container

You have to create a repository on AWS that will hold your Docker Image. You need to come up with a name for your repository and a region where you want the repository to reside. You can do this like so:

```bash
aws ecr create-repository --repository-name <YOUR_REPOSITORY_NAME> --region <AWS_REGION>

# example
aws ecr create-repository --repositry-name simple-docker-repo --region ap-northeast-2
```

You should see an output that looks like this:

```json
{
    "repository": {
        "registryId": "<AWS_ACCOUNT_ID>",
        "repositoryName": "<YOUR_REPOSITORY_NAME",
        "repositoryArn": "arn:aws:ecr:<AWS_REGION>:<AWS_ACCOUNT_ID>:repository/<YOUR_REPOSITORY_NAME>",
        "createdAt": 1505337806.0,
        "repositoryUri": "<AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/<YOUR_REPOSITORY_NAME>"
    }
}
```

Keep track of the value for `repository.repositoryUri` from the above JSON output. You will need it for the next command.

### Tag and Push your Docker Image

The next command will let Docker know where to push your Docker Image.

```bash
docker tag <DOCKER_IMAGE_NAME> <repository.repositoryUri>
```

### Authenticate and Login with AWS

You will need the registry URI of where your ECS repositories reside on AWS. To get this uri you just need to splice off the last "/" and everything following it from <repository.repositoryUri>.

```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <repository.repositoryUri>

# example
aws ecr get-login-password | docker login --username AWS --password-stdin 423432424.dkr.ecr.ap-northeast-2.amazonaws.com
```

### Finally

Push to AWS using this command and your <repository.repositoryUri>:

```bash
docker push <repository.repositoryUri>
```
