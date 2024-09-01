import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: POSTGRES_USER, 
  host: POSTGRES_HOST, 
  database: PG_DB,
  password: PG_PASS, 
  port: PG_PORT
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
}catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const editId = req.body.updatedItemId;
  const editTitle = req.body.updatedItemTitle;
  try{
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [editTitle, editId]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});
 
app.post("/delete", async(req, res) => {
  const delItem = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = $1", [delItem]);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }
});
 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
