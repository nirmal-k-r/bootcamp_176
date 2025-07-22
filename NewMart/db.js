const mongoose = require('mongoose');

// Replace 'mongodb://localhost:27017/mydatabasename' with your MongoDB connection string
const mongoURI = 'mongodb+srv://rsp:coderfaculty12345@rspcluster.hqkr1yq.mongodb.net/Newmart?retryWrites=true&w=majority&appName=rspcluster';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  
module.exports = mongoose