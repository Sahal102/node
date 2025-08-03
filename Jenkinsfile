pipeline {
    agent any

    environment {
        APP_NAME = "node-app"
        DOCKER_IMAGE = "node-app:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Sahal102/node.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                    docker rm -f $APP_NAME || true
                    docker run -d --name $APP_NAME -p 80:3000 $DOCKER_IMAGE
                '''
            }
        }
    }
}
