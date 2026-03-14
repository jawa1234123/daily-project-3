const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bodyParser = require("body-parser")

const app = express()
const db = new sqlite3.Database("database.db")

app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

// Membuat database alumni
db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS alumni(
id INTEGER PRIMARY KEY AUTOINCREMENT,
nama TEXT,
jurusan TEXT,
tahun INTEGER,
pekerjaan TEXT,
perusahaan TEXT,
status TEXT
)
`)

})

// Halaman login
app.get("/",(req,res)=>{
res.render("login")
})

// Proses login
app.post("/login",(req,res)=>{

const {username,password}=req.body

if(username==="admin" && password==="admin"){
res.redirect("/dashboard")
}else{
res.send("Login gagal")
}

})

// Dashboard
app.get("/dashboard",(req,res)=>{

db.all("SELECT * FROM alumni",[],(err,data)=>{

let bekerja=data.filter(a=>a.status==="Bekerja").length
let studi=data.filter(a=>a.status==="Studi Lanjut").length
let usaha=data.filter(a=>a.status==="Wirausaha").length

res.render("dashboard",{data,bekerja,studi,usaha})

})

})

// Tambah alumni
app.get("/tambah",(req,res)=>{
res.render("tambah")
})

app.post("/tambah",(req,res)=>{

const {nama,jurusan,tahun,pekerjaan,perusahaan,status}=req.body

db.run(`
INSERT INTO alumni(nama,jurusan,tahun,pekerjaan,perusahaan,status)
VALUES(?,?,?,?,?,?)
`,
[nama,jurusan,tahun,pekerjaan,perusahaan,status],
()=>res.redirect("/dashboard"))

})

// Edit alumni
app.get("/edit/:id",(req,res)=>{

db.get("SELECT * FROM alumni WHERE id=?",[req.params.id],(err,data)=>{
res.render("edit",{data})
})

})

app.post("/edit/:id",(req,res)=>{

const {nama,jurusan,tahun,pekerjaan,perusahaan,status}=req.body

db.run(`
UPDATE alumni
SET nama=?,jurusan=?,tahun=?,pekerjaan=?,perusahaan=?,status=?
WHERE id=?
`,
[nama,jurusan,tahun,pekerjaan,perusahaan,status,req.params.id],
()=>res.redirect("/dashboard"))

})

// Hapus alumni
app.get("/delete/:id",(req,res)=>{

db.run("DELETE FROM alumni WHERE id=?",[req.params.id],()=>{
res.redirect("/dashboard")
})

})

// Laporan tracer study
app.get("/laporan",(req,res)=>{

db.all("SELECT * FROM alumni",[],(err,data)=>{

let bekerja=data.filter(a=>a.status==="Bekerja").length
let studi=data.filter(a=>a.status==="Studi Lanjut").length
let usaha=data.filter(a=>a.status==="Wirausaha").length

res.render("laporan",{bekerja,studi,usaha})

})

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log("Server running on port " + PORT)
})