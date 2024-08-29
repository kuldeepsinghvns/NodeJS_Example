const express = require ("express");
const server =express();
const hostname ='127.0.0.1';
const port = 3000;
server.use(express.urlencoded({ extended: true }));
server.get("/",(req,res)=>{
   res.send(`
    <form action="submit" method="post">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name"/> <br/>
        <label htmlFor="email">Email:</label>
        <input type="text" name="email" id="email"/><br />
        <button type="submit">submit</button>
    </form>
   `);
});
server.post("/submit",(req,res)=>{
    const {name,email}=req.body;
    console.log(req.body);
    res.send(`Name:${name},Email:${email}`);
});

server.listen(port,hostname,()=>{
    console.log(`server running at http://${hostname}:${port}/`);

});