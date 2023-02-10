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

    kaniko {
        beforeBuildScript {
            content = "export BUILD_VERSION=\$(cat package.json|grep version|head -1|awk -F: '{ print \$2 }'|sed 's/[\", ]//g')"
        }

        build {
            dockerfile = "Dockerfile"
            labels["vendor"] = "musicorum"
        }

        push("musicorum.registry.jetbrains.space/p/main/containers/lastgram") {
            tags {
                +"\$BUILD_VERSION-\$JB_SPACE_EXECUTION_ID"
                +"latest"
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