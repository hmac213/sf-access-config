const mongoose = require('mongoose');

const uri = `mongodb+srv://hmac213:${process.env.MONGO_DB_PASSWORD}@eqlectech.theltz7.mongodb.net/eqlectechDB?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});