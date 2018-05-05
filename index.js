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

        connection.query("SELECT item_id, price, stock_quantity FROM products", function(err, res) {
            if (err) throw err;
            
            var selectProduct = answers.productItemID - 1;

            if (res[selectProduct].stock_quantity === 0) {
                console.log("Sorry we are out of stock");
            } else if (res[selectProduct].stock_quantity < answers.productQuantity) {
                console.log("Sorry we do not have that much in stock, the number remaining is " + res[selectProduct].stock_quantity);
            } else {
                var updateStock = res[selectProduct].stock_quantity - answers.productQuantity;
                var itemPrice = res[selectProduct].price;
                var totalPrice = answers.productQuantity * itemPrice;
                var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
                // TODO: write a update statement to edit the database
                // and show the customer the cost of their cart
                connection.query(query, [updateStock, answers.productItemID], function(err, res) {
                    if (err) throw err;

                    console.log("You just bought " + answers.productQuantity + " items");
                    console.log("Your total cost is: " + totalPrice);

                });               
            }

            connection.end();
        });
    });
}
