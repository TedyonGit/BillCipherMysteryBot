const axios = require("axios");
const fs = require('fs');
const { open } = require('node:fs/promises'); 

class ColorClass
{
    White = "\x1b[37m";
    Cyan = "\x1b[36m";
    Magenta = "\x1b[35m";
    Blue = "\x1b[34m";
    Yellow = "\x1b[33m";
    Green = "\x1b[32m";
    Red = "\x1b[31m";
    Black = "\x1b[30m";
};

class ConsoleOutputClass {
    Output(color, type, information) 
    {
        console.log(`${Colors.White}[${color}${type}${Colors.White}] ${information}`);
    }
};

const Colors = new ColorClass;
const Console = new ConsoleOutputClass;
async function CreateRequest(code)
{
    await axios({
        method: 'post',
        url: 'https://codes.thisisnotawebsitedotcom.com/',
        timeout: 10000,
        data: {
            code: `${code}`,
        },
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.5",
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundarycJ0eXjdky0thwdFB",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Brave\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "Referer": "https://thisisnotawebsitedotcom.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    }).then(async function (response) {
        // handle success
        if(response.status == 200)
        {
            Console.Output(Colors.Green, "SUCCESS", code);
            const data = fs.readFileSync("WorkingCodes.txt", "utf8");
            fs.writeFileSync("WorkingCodes.txt", `${data}${code}\n`);
        }
      })
      .catch(function (error) {
        Console.Output(Colors.Red, "INVALID", code);
        return;
        // handle error
        //console.log(error);
      });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function Main()
{
    fs.writeFileSync("WorkingCodes.txt", ``);
    const file = await open('ReadWords.txt'); 
      
    for await (const line of file.readLines()) { 
        Console.Output(Colors.Yellow, "CHECKING", line);
        await CreateRequest(line);
        await sleep(500);
    } 
    Console.Output(Colors.Blue, "FINISHED", `All the keywords were checked!`);
}

Main();