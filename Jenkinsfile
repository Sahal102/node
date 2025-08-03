pipeline {
    agent any

    environment {
        APP_NAME = "node-app"
        DOCKER_IMAGE = "node-app:latest"
        EC2_USER = "ec2-user"           // or 'ubuntu' for Ubuntu EC2
        EC2_HOST = "54.152.97.73" // replace with your EC2 public IP
        SSH_KEY = "ec2-ssh-key"         // Jenkins credentials ID (SSH key)
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Sahal102/node.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Copy & Deploy to EC2') {
            steps {
                sshagent (credentials: [env.SSH_KEY]) {
                    sh """
                        docker save $DOCKER_IMAGE > $APP_NAME.tar
                        scp -o StrictHostKeyChecking=no $APP_NAME.tar $EC2_USER@$EC2_HOST:/home/$EC2_USER/
                        ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                            docker load < /home/$EC2_USER/$APP_NAME.tar &&
                            docker rm -f $APP_NAME || true &&
                            docker run -d --name $APP_NAME -p 80:3000 $DOCKER_IMAGE
                        '
                    """
                }
            }
        }
    }
}

