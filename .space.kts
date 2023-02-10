/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/
job("Build and push Docker") {
    startOn {
        // trigger the job on every push to the master branch
        gitPush {
            branchFilter {
                + "refs/heads/main"
            }
        }
    }

    host("Get build version") {
        shellScript {
            content = "BUILD_VERSION=\$(cat package.json|grep version|head -1|awk -F: '{ print \$2 }'|sed 's/[\", ]//g')"
        }
    }

    host("Build and push a Docker image") {
        dockerBuildPush {
            // by default, the step runs not only 'docker build' but also 'docker push'
            // to disable pushing, add the following line:
            // push = false

            // path to Docker context (by default, context is working dir)
            // path to Dockerfile relative to the project root
            // if 'file' is not specified, Docker will look for it in 'context'/Dockerfile
            file = "Dockerfile"
            // build-time variables
            // args["HTTP_PROXY"] = "http://10.20.30.2:1234"
            // image labels
            labels["vendor"] = "musicorum"
            // to add a raw list of additional build arguments, use
            // extraArgsForBuildCommand = listOf("...")
            // to add a raw list of additional push arguments, use
            // extraArgsForPushCommand = listOf("...")
            // image tags
            val repository = "musicorum.registry.jetbrains.space/p/main/containers/lastgram"
            tags {
                // use current job run number as a tag - '0.0.run_number'
                +"$repository:\$BUILD_VERSION"
                +"$repository:latest"
            }
        }
    }
    container("Deploy to stage", image = "gradle:7.1-jre11") {
        kotlinScript { api ->
            // ...

            api.space().projects.automation.deployments.schedule(
                project = api.projectIdentifier(),
                targetIdentifier = TargetIdentifier.Key("stage"),
                version = "\$BUILD_VERSION",
            )
        }
    }
}