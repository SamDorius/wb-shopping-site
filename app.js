import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import session from 'express-session';
import users from './users.json' assert { type: 'json' };
import stuffedAnimalData from './stuffed-animal-data.json' assert { type: 'json' };

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

function getAnimalDetails(animalId) {
  return stuffedAnimalData[animalId];
}

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/all-animals', (req, res) => {
  res.render('all-animals.html.njk', { animals: Object.values(stuffedAnimalData) });
});

app.get('/animal-details/:animalId', (req, res) => {
  let animalDetails = getAnimalDetails(req.params.animalId);
  res.render('animal-details.html.njk', { animal: animalDetails });
});

app.get('/add-to-cart/:animalId', (req, res) => {
  // TODO: Finish add to cart functionality
  // The logic here should be something like:
  // - check if a "cart" exists in the session, and create one (an empty
  // object keyed to the string "cart") if not
  // - check if the desired animal id is in the cart, and if not, put it in
  // - increment the count for that animal id by 1
  // - redirect the user to the cart page
    let sess = req.session
    let animalId = req.params.animalId;
    if(!sess.cart)
    {
      sess.cart = {};
    }

    if (!(animalId in sess.cart))
    {
      sess.cart[animalId] = 0;
    }
    sess.cart[animalId] += 1;
    console.log(sess.cart)

    res.redirect('/cart')
});

app.get('/cart', (req, res) => {
  // TODO: Display the contents of the shopping cart.
  if(!req.session.cart)
  {
    req.session.cart = {};
  }
  // The logic here will be something like:

  // - get the cart object from the session
  let cart = req.session.cart;
  // - create an array to hold the animals in the cart, and a variable to hold the total
  let animals = [];
  let total = 0;
  // cost of the order

  // - loop over the cart object, and for each animal id:
  //   - get the animal object by calling getAnimalDetails
  //   - compute the total cost for that type of animal
  //   - add this to the order total
  //   - add quantity and total cost as properties on the animal object
  //   - add the animal object to the array created above
  // - pass the total order cost and the array of animal objects to the template
  for (let animalId in cart)
  {
    let animalDetails = getAnimalDetails(animalId)
    let qty = cart[animalId]
    animalDetails.qty = qty;

    let subtotal = qty * animalDetails.price;
    animalDetails.subtotal = subtotal;

    total += subtotal;
    animals.push(animalDetails);
  }
  // Make sure your function can also handle the case where no cart has
  // been added to the session

  res.render('cart.html.njk',
  {
    animals: animals,
    total: total
  });
});

app.get('/checkout', (req, res) => {
  // Empty the cart.
  req.session.cart = {};
  res.redirect('/all-animals');
});

app.get('/login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.post('/process-login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
