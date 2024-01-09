const paypal = require("paypal-rest-sdk")

var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}			

const paymentController = async (req, res) => {
  try {
    var payment = {
      intent: "authorize",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://127.0.0.1:3000/success",
        cancel_url: "http://127.0.0.1:3000/err",
      },
      transactions: [
        {
          amount: {
            total: 39.0,
            currency: "USD",
          },
          description: " a book on mean stack ",
        },
      ],
    };

    createPay(payment)
      .then((transaction) => {
        var id = transaction.id;
        var links = transaction.links;
        var counter = links.length;
        while (counter--) {
          if (links[counter].method == "REDIRECT") {
            // redirect to paypal where user approves the transaction
            return res.redirect(links[counter].href);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/err");
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { paymentController };
