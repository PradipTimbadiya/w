const http=require('http');
const fs=require('fs');
const requests=require('requests');

const file=fs.readFileSync('home.html','utf-8');

const replaceVal=(tempval,realval)=>{
    let temp=tempval.replace("{%tempval%}",realval.main.temp);
    temp=temp.replace("{%tempmin%}",realval.main.temp_min);
    temp=temp.replace("{%tempmax%}",realval.main.temp_max);
    temp=temp.replace("{%location%}",realval.name);
    temp=temp.replace("{%country%}",realval.sys.country);
    // temp=temp.replace("{%tempstatus%}",realval.sys.country);
    // console.log(temp);
    return temp;
}

const server=http.createServer((req,res)=>{
    if(req.url=="/")
    {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=e094ce30f0a9a22453a241a78447efb4")
        .on("data",(chunk)=>{
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            const realTimeData=arrData.map((val)=>{
               return replaceVal(file,val);
            })
            .join("");
            // console.log(realTimeData);
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err)
            {
                res.write('data not found')
            }
            res.end();
        })
    }
})

server.listen(8000,'127.0.0.1');