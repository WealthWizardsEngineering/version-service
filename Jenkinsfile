#!groovy

def err = null
def serviceName = 'version-service'
currentBuild.result = "SUCCESS"
env.MAKEFILE_SUDO_COMMAND = "sudo -n"
def lastCommitter = ''
def buildVersion = '';

fileLoader.withGit('https://bitbucket.org/wealth-wizards/jenkinsfile-commons.git', 'master', 'b75efdbe-575f-4d19-aff1-dc4c321ddfaf', '') {
    docker = fileLoader.load('docker');
    k8s = fileLoader.load('k8s');
}

node {

  env.MAKEFILE_SUDO_COMMAND = "sudo -n"

  def nodeHome = tool name: 'node-6.2.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
  env.NODE_ENV = "test"
  env.PATH = "$env.PATH:$nodeHome/bin"

  def proto = 'https://'
  def repo = 'bitbucket.org/wealth-wizards/'+serviceName+'.git'
  def gitExcludedUsers = 'wealthwizardsjenkins'


  try {

        stage 'Checkout'
          step([$class: 'WsCleanup'])

          checkout([$class: 'GitSCM', branches: [[name: env.BRANCH_NAME]], doGenerateSubmoduleConfigurations: false,
            extensions: [[$class: 'UserExclusion', excludedUsers: gitExcludedUsers]], submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: 'b75efdbe-575f-4d19-aff1-dc4c321ddfaf',
            name: 'origin', refspec: 'refs/heads/'+env.BRANCH_NAME+':refs/remotes/origin/'+env.BRANCH_NAME,
            url: proto+repo]]])

        lastCommitter = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true)
        if(lastCommitter == 'wealthwizardsjenkins') {
          return;
        }

        try { bitbucketStatusNotify ( buildState: 'INPROGRESS' ) } catch(all){ println "Bitbucket INPROGRESS notify failure" }

        stage 'Install'

          sh 'make install'

        stage 'Dependency check'

          sh 'make dependency-check'

        stage 'Lint'

          sh 'make lint'

        stage 'Unit test'

          sh "make unit-test"

          step([$class: 'JUnitResultArchiver', testResults: 'unit-test-report.xml'])

        stage 'Component test'

          sh "make component-test"

          step([$class: 'JUnitResultArchiver', testResults: 'component-test-report.xml'])

          publishHTML(target:[allowMissing: true, alwaysLinkToLastBuild: false, keepAll: false, reportDir: "coverage/lcov-report", reportFiles: 'index.html', reportName: "Coverage Report"])

        if (env.BRANCH_NAME == "master") {
          stage 'Tag and bump version'
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: '74a22d50-4bd7-49a3-bc84-2ffe7c9ff597', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD']]) {
               sh "git config --global user.email ${env.JENKINS_EMAIL}"
               sh "git config --global user.name ${gitExcludedUsers}"
               buildVersion = sh(script: 'npm version patch', returnStdout: true);
               buildVersion = buildVersion.substring(1);
            }
        }

        stage 'Build docker image'

          docker.build(serviceName)

        if(env.BRANCH_NAME == "master") {

          stage 'Push docker image into repository'

            docker.push(serviceName, serviceName, buildVersion)

          stage 'Deploy to ST'

            k8s.config('st')
            k8s.rollout(serviceName, 'st', env.DOCKER_REGISTRY, buildVersion)

        }

        if (env.BRANCH_NAME == "master") {
          withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: '74a22d50-4bd7-49a3-bc84-2ffe7c9ff597', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD']]) {
             sh "git config --global user.email ${env.JENKINS_EMAIL}"
             sh "git config --global user.name ${gitExcludedUsers}"
             sh "git push https://${env.GIT_USERNAME}:${env.GIT_PASSWORD}@${repo} HEAD:master"
             sh "git push https://${env.GIT_USERNAME}:${env.GIT_PASSWORD}@${repo} --tags"
          }
        }

        try { bitbucketStatusNotify ( buildState: 'SUCCESSFUL' ) } catch(all){ println "Bitbucket SUCCESSFUL notify failure" }

    } catch (caughtError) {

        err = caughtError
        currentBuild.result = "FAILURE"
        try { bitbucketStatusNotify ( buildState: 'FAILED' ) } catch(all){ println "Bitbucket FAILED notify failure" }

        sh "git reset --hard"

    } finally {

        try { sh 'sudo -n docker-compose down -v' } catch(all){}
        try { sh 'make clean-up' } catch(all){}

        if (err) {
            throw err
        }
    }
}
