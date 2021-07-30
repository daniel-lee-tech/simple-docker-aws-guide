const prompt = require('prompt-sync')();
const fs = require('fs');

// const path = prompt("Give me a folder path to output completed task json,: ");
const fileName = prompt("Give me a name to call the outputted json file, (exclude file extention): ")

const family = prompt("Family name for task defintion? ");
const numContainers = Number(prompt("How many containers ? (Max 10) "));
let containerDefintions = [];
let requiresCompatibilities = ["FARGATE", "EC2"]
let cpu = "256";
let memory = "512";


for (let i = 0; i < numContainers; i++) {
    console.log(`container ${i + 1}`);
    let containerDefinition = createContainerDefinition();
    containerDefintions.push(containerDefinition);
}

const taskDefinition = (JSON.stringify({
    family,
    "networkMode": "awsvpc",
    containerDefintions,
    requiresCompatibilities,
    cpu,
    memory,
}, null, 4))

fs.writeFile(`${fileName}.json`, taskDefinition, function (err) {
    if (err) return console.log(err);
    console.log(`Check this file ${fileName} for output`);
  })

function createContainerDefinition() {
    const name = prompt("Name of container: ");
    const image = prompt("Image name or url: ");
    const containerPort = prompt('What port should be open on the container: ');
    const hostPort = prompt('What port should be open on the host: ');
    const protocol = prompt('What protocol should this use, most used: tcp: ');
    const essential = Boolean(prompt('Is this essential, default true, input `true` or `false`: '));

    return {
        name,
        image,
        "portMappings": [
            {
                containerPort,
                hostPort,
                protocol
            }
        ],
        essential,
        //     "entryPoint": [
        //         "sh",
        // "-c"
        //     ], 
        //     "command": [
        //         "/bin/sh -c \"echo '<html> <head> <title>Amazon ECS Sample App</title> <style>body {margin-top: 40px; background-color: #333;} </style> </head><body> <div style=color:white;text-align:center> <h1>Amazon ECS Sample App</h1> <h2>Congratulations!</h2> <p>Your application is now running on a container in Amazon ECS.</p> </div></body></html>' >  /usr/local/apache2/htdocs/index.html && httpd-foreground\""
        //     ]
    }

}