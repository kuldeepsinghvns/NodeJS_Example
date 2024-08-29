const mysql=require('mysql');
const ejs= require('ejs');
const fs=require('fs');
const http = require('http');
const { error } = require('console');

// create mysql connection 

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    port:'3306',
    password:'',
    database:'node'
});

// connect to my sql server

connection.connect((error)=>{
    if(error) throw error;
    console.log("connected to my sql server");

    // Query the table
    connection.query('SELECT * FROM data', (error, results) => {
        if (error) throw error;
        
    
        // Read the EJS template file
        fs.readFile('views/template.ejs', 'utf8', (error, template) => {
          if (error) throw error;
          
    
          // Render the EJS template with data from the MySQL table
          const html = ejs.render(template, { data: results });
          
    
          // Save the rendered HTML to a file
          fs.writeFile('output.html', html, 'utf8', (error) => {
            if (error) throw error;
            console.log('HTML file generated successfully');
    
    
            // Create a simple HTTP server
            const server = http.createServer((req, res) => {
              // Read the generated HTML file
              fs.readFile('output.html', 'utf8', (error, content) => {
                if (error) {
                  res.writeHead(500);
                  res.end('Error reading HTML file');
                } else {
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.end(content);
                }
              });
            });
    
            // Start the server on port 3000
            server.listen(3000, () => {
              console.log('Server running at http://localhost:3000/');
            });
    
            // Close the MySQL connection
            connection.end((error) => {
              if (error) throw error;
              console.log('Disconnected from MySQL server');
            });
          });
        });
    });
});