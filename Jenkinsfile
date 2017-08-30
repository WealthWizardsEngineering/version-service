#!groovy

fileLoader.withGit('https://bitbucket.org/wealth-wizards/jenkinsfile-commons.git', 'master', 'b75efdbe-575f-4d19-aff1-dc4c321ddfaf', '') {
  build = fileLoader.load('build');
}

def result = build.build('version-service');
