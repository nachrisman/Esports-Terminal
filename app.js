var passportLocalMongoose = require('passport-local-mongoose'), 
	methodOverride		  = require('method-override'),
	LocalStrategy         = require('passport-local'),	
	bodyParser            = require('body-parser'),
	passport 		      = require('passport'),
	flash				  = require('connect-flash'),
	User			      = require('./models/user'),
	Event 				  = require('./models/event'),
	Article 			  = require('./models/article'),
	Game 				  = require('./models/game'),
	mongoose              = require('mongoose'),
	express               = require('express'),
	app                   = express();


var adminRoutes 	= require('./routes/admin'),
	newsRoutes  	= require('./routes/news'),
	eventRoutes 	= require('./routes/events'),
	accountRoutes 	= require('./routes/account'),
	indexRoutes 	= require('./routes/index');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect('mongodb://estadmin:estadmin@ds125555.mlab.com:25555/esports_terminal');
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

//Passport Config
app.use(require('express-session')({
	secret: 'eSports is the future',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/admin', adminRoutes),
app.use('/news', newsRoutes),
app.use('/events', eventRoutes),
app.use('/account', accountRoutes),
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log('SERVER RUNNING');
});