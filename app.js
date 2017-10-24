var passportLocalMongoose = require('passport-local-mongoose'), 
	methodOverride		  = require('method-override'),
	LocalStrategy         = require('passport-local'),	
	bodyParser            = require('body-parser'),
	passport 		      = require('passport'),
	flash				  = require('connect-flash'),
	User			      = require('./models/user'),
	mongoose              = require('mongoose'),
	express               = require('express'),
	favicon				  = require('serve-favicon'),
	app                   = express();

var adminRoutes 	= require('./routes/admin'),
	newsRoutes  	= require('./routes/news'),
	eventRoutes 	= require('./routes/events'),
	accountRoutes 	= require('./routes/account'),
	indexRoutes 	= require('./routes/index');

mongoose.Promise = global.Promise;
var url = process.env.DATABASEURL || 'mongodb://localhost/est';
mongoose.connect(url, {useMongoClient: true});

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
// app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

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