const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Mongo db connected'))
    .catch(err => console.log(err));


app.use(expressLayouts);

//View engine
app.set('view engine', 'ejs');
app.set('views', './views');


//Bodyparser
app.use(express.urlencoded({ extender: true }));

//express session middleware
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());


//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
const PORT = process.env.PORT || 3000;

//Routes
app.listen(PORT, () => {
    console.log(`Server started on port`);
});