# support-pipe
A messenger application that improves the way team members can ask for help.

## How it works

1. Users post issues when they need help.
1. Those issues are presented to potential helpers.
1. You can decide whether you want to help someone or skip that issue so that someone more qualified will help that person.
1. Once you decide to help someone, you get into a chat with him. All other app functionality is then blocked. The focus should be on fixing the issue together.
1. Once you are done fixing the issue, the person posting the issue can close it so that both persons can get back to posting their issues or helping others.

## Getting Started

### Starting The Application

1. Make sure you have node, maven and docker installed. Versions that work for sure are: 
    - node 12.19.0
    - maven 3.6.3
    - docker 20.10.7
1. Run `docker-compose up` in the root of the project and wait for all containers to start successfully. Make sure no container errored out during startup.
1. Run `mvnw quarkus:dev` or `mvn quarkus:dev` in the project `support-pipe-quarkus`.
1. Run `npm ci && npm run start` in the project `support-pipe-app`.

### Getting familiar with the application

I suggest opening three different browsers and registering a new user for each of them. Then just simulate that some users need help while others reject or accept their requests for help (aka. issues). Everything should be updated in near real-time. For example. suppose person A posts an issue. Person B looks at the issue and wants to decide whether or not to help. In the meantime, person C already decided to help. That means that person B is potentially not needed any more for that issue and that issue automatically disappears from his screen and is replaced with another open issue.

## Troubleshooting

problem | solution
--- | ---
keycloak complains on startup that admin user already exists | [solution](https://stackoverflow.com/a/61071811/12244272)