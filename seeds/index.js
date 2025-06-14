const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Campground.deleteMany({});
  const camp = new Campground({
    title: 'Mountain View',
    location: 'Colorado',
    price: 20,
    description: 'A scenic campground in the mountains.'
  });
  await camp.save();
  console.log('Seeded 1 campground');
};

seedDB().then(() => {
  mongoose.connection.close();
});
