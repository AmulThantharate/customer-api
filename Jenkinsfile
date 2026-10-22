pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'qa', 'prod'],
            description: 'Environment to deploy to'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
                echo 'Checkout completed.'
            }
        }

        stage("Get a git commit sha"){
           steps {
             script {
               env.GIT_COMMIT_SHA = sh(
                    script: "git rev-parse --short HEAD",
                    returnStdout: true
               ).trim()
             }
             echo "GIT_COMMIT_SHA: ${env.GIT_COMMIT_SHA}"
           }
        }

        stage('Build') {
            steps {
                script {
                    def application = 'customer-api'
                    def applicationVersion = '1.0.0'

                    echo "Application: ${application}"
                    echo "Version: ${applicationVersion}"
                    echo 'Installing Node.js dependencies...'

                    sh 'npm install'
                    sh 'node --check app.js'

                    echo 'Build checks completed.'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing customer-api...'
                sh 'npm test'
                echo 'Tests completed.'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def application = 'customer-api'
                    def applicationVersion = '1.0.0'
                    def environment = params.ENVIRONMENT

                    echo "Application: ${application}"
                    echo "Version: ${applicationVersion}"
                    echo "Environment: ${environment}"

                    if (environment == 'dev') {
                        echo 'Development deployment started.'
                    } else if (environment == 'qa') {
                        echo 'QA deployment started.'
                    } else if (environment == 'prod') {
                        echo 'Production deployment requires approval.'
                    } else {
                        error("Invalid environment: ${environment}")
                    }

                    echo "Processing environment: ${environment}"

                    echo 'Deployment simulation completed.'
                    echo 'No actual deployment was performed.'
                }
            }
        }
        stage("Docker Build Image and Push") {
            steps {
                script {
                    def applicationName = 'customer-api'
                    def commitSHA = env.GIT_COMMIT_SHA
                    def registry = env.DOCKER_REGISTRY ?: 'docker.io'

                    withCredentials([usernamePassword(
                        credentialsId: 'DOCKER_CRED',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo "\$DOCKER_PASS" | docker login ${registry} -u "\$DOCKER_USER" --password-stdin
                            docker build -t ${registry}/\$DOCKER_USER/${applicationName}:${commitSHA} .
                            docker push ${registry}/\$DOCKER_USER/${applicationName}:${commitSHA}
                        """
                    }
                }
            }
        }
        stage("Run the Container") {
            steps{
                script {
                  sh """
                    docker run -d --name customer-api \
                    -p 3000:3000 \
                    --name cst 
                    ${registry}/\$DOCKER_USER/${applicationName}:${commitSHA}
                  """
                }
            }
        }
    }
}
