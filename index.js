var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Class2018",
    database: "bamazon"
});

displayItems();
userInput();
// TODO: Find out where to put "connection.end();" to end the connection without an error
// maybe re-open a connection for each function?

function displayItems() {

    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
        console.log(res[i]);
        console.log("-----------------------------------");
      }
    });
  }

function userInput() {

    var questions = [
        {
          type: 'input',
          name: 'productItemID',
          message: "What's the item_id of the product you want to buy?"
        },
        {
          type: 'input',
          name: 'productQuantity',
          message: "How many would you like?"
        }
    ];

    inquirer.prompt(questions).then(answers => {

        connection.query("SELECT * FROM products WHERE item_id =" + answers.productItemID, function(err, res) {
            if (err) throw err;

            if (res[0].stock_quantity === 0) {
                console.log("Sorry we are out of stock");
            } else if (res[0].stock_quantity < answers.productItemID) {
                console.log("Sorry we do not have that much in stock, the number remaining is " + res[0].stock_quantity);
            } else {

                // TODO: write a update statement to edit the database
                // and show the customer the cost of their cart
                console.log("You just bought " + answers.productItemID + " items");
            }
        });
    });
}
