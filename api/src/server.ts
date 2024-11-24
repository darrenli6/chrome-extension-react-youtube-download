import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";

import { HttpsProxyAgent } from 'https-proxy-agent';


const proxyUrl = "http://127.0.0.1:7890";
const agent = new HttpsProxyAgent(proxyUrl);

async function fetchVideoInfo(url: string, timeout: number = 10000) : Promise<ytdl.videoInfo>{
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Request timed out"));
        }, timeout);

        ytdl.getInfo(url, { requestOptions: { agent } })
            .then(info => {
                clearTimeout(timer);
                resolve(info);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
}


const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true,
}));

app.post("/api/download", async (req, res) => {
    const { url,quality } = req.body;
    try{
        console.log(url,quality);
        const videoInfo = await fetchVideoInfo(url);
        console.log(videoInfo);
        const format = ytdl.chooseFormat(videoInfo.formats,{
            quality: quality || "highest",
            filter: "videoandaudio",
        });
         


        console.log(videoInfo);
        res.status(200).json({
            message: "success",
            download: format.url,
        });
    }catch(error){
        console.log(error,"  server is not running");
        res.status(500).send({ error: "Failed to fetch video information" });

    }
  
});

app.get("/", async (req, res) => {
    console.log("server is running");
    res.send("server is running");
});


app.listen(5001, () =>  console.log("Server is running on port 5001"));