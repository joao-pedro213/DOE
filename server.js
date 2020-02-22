//configurando o servidor 
const express = require("express")
const server = express()


//configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true}))


//configurando a conexão com o bando de dados

const Pool = require('pg').Pool

const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port:'5432',
    database:'doe'
})


//configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configurando a apresentaçãod a página
server.get("/", function(req, res) {
    
    db.query(`SELECT * FROM "Donors"`, function(err, result){
        if(err) return res.send("Erro de banco de dados")

        const donors = result.rows
    
        return res.render("index.html", { donors })
    })
       
    
})

server.post("/", function(req, res){
//pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

        if (name == "" || email == "" || blood == "") {
           return res.send("Erro no Banco de Dados")
     }


//colocando valores dentro banco de dados
    const query = `
        INSERT INTO "Donors" ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        
        //fluxo de erro
        if (err) return res.send("Erro no Banco de Dados")
        
        //fluxo ideal
        return res.redirect("/")
    })     

})

// ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function (){
    console.log("iniciei o servidor")
})