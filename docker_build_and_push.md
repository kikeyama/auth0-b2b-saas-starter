# Login ECR

```bash
export AWS_ACCOUNT_ID=

aws ecr get-login-password --region ap-northeast-1 \
| docker login \
    --username AWS \
    --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com
```

# Build

```bash
docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/saastart:latest .
```

# Add tag

```bash
export COMMIT_ID=

docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/saastart:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/saastart:${COMMIT_ID}
```

# Push to Registry

```bash
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/saastart:latest
```

# Remove Local Image

```bash
docker image rm ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/saastart
```
