// app/routes.js

dbconnection = require("../sql/dbconnection.js");

module.exports = function(app, passport) {

    // redirects http to https
    app.all('*', ensureSecure);

    // =====================================
    // LOGIN ===============================
    // =====================================
    app.get('/', inSession, function(req, res) {
        res.render('index.ejs');
    });

    app.post('/', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/' // redirect back to the login page if there is an error
    }));

    // =====================================
    // HOME ================================
    // =====================================
    app.get('/home', isLoggedIn, function(req, res) {
        res.render('home.ejs', {
            user : req.user // get the user out of the session and pass to the template
        });
    });

    // =====================================
    // MYBINDER ============================
    // =====================================
    app.get('/myBinder', isLoggedIn, function(req, res) {
        res.render('myBinder.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ADMIN ===============================
    // =====================================
    app.get('/admin', isLoggedIn, function(req, res) {
        res.render('admin.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ADMIN ASSN. ORG. ====================
    // =====================================
    app.get('/adminAssignOrganizer', isLoggedIn, function(req, res) {
        res.render('adminAssignOrganizer.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ADMIN VIEW ==========================
    // =====================================
    app.get('/adminView', isLoggedIn, function(req, res) {
        res.render('adminView.ejs', {
            user : req.user
        });
    });

    // =====================================
    // TESTER ==============================
    // =====================================
    app.get('/tester', isLoggedIn, dbconnection.getPerson, function(req, res) {
        res.render('tester.ejs', {
            user : req.user,
            recordset : res.recordset
        });
    });

    // =====================================
    // TESTERADAM ==========================
    // =====================================
    app.get('/testerAdam', isLoggedIn, function(req, res) {
        var passedVariable = req.query.valid;
        console.log(passedVariable);
        res.render('testerAdam.ejs', {
            user : req.user
        });
    });

    app.post('/testerAdam', isLoggedIn, function(req, res) {
        var string = encodeURIComponent(req.body.input);
        res.redirect('/testerAdam/?valid=' + string);
    });

    // =====================================
    // UPLOADDOC ===========================
    // =====================================
    app.get('/uploadDoc', isLoggedIn, dbconnection.uploadDoc, function(req, res) {
        res.render('testerAdam.ejs', {
            user : req.user,
            data : res.file
        });
    });

    // =====================================
    // 2013BINDER ==========================
    // =====================================
    app.get('/2013Binder', isLoggedIn, dbconnection.getDoc, function(req, res) {
        res.render('2013Binder.ejs', {
            user : req.user,
            documents : res.doc
        });
    });

    app.post('/2013Binder', isLoggedIn, function(req, res) {
        console.log(req.body);
        //res.redirect('/2013Binder');
    });

    // =====================================
    // FILLEDBINDER ========================
    // =====================================
    app.get('/filledBinderExample', isLoggedIn, function(req, res) {
        res.render('filledBinderExample.ejs', {
            user : req.user
        });
    });

    // =====================================
    // BINDERSUBMISSION ==========================
    // =====================================
    app.get('/binderSubmission', isLoggedIn, function(req, res) {
        res.render('binderSubmission.ejs', {
            user : req.user
        });
    });

    // =====================================
    // newBinder ==========================
    // =====================================
    app.get('/newBinder', isLoggedIn, dbconnection.createNewBinder, function(req, res) {
        res.render('newBinder.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ORGANIZER ===========================
    // =====================================
    app.get('/organizer', isLoggedIn, function(req, res) {
        res.render('organizer.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ORGANIZER EDIT ======================
    // =====================================
    app.get('/organizerEdit', isLoggedIn, function(req, res) {
        res.render('organizerEdit.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ORGANIZER VIEW ======================
    // =====================================
    app.get('/organizerView', isLoggedIn, function(req, res) {
        res.render('organizerView.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ORGANIZE EXAMPLE ====================
    // =====================================
    app.get('/organizerExample', isLoggedIn, function(req, res) {
        res.render('organizerExample.ejs', {
            user : req.user
        });
    });

    // =====================================
    // ORGANIZER ===========================
    // =====================================
    app.get('/organizerSubmit', isLoggedIn, function(req, res) {
        res.render('organizerSubmit.ejs', {
            user : req.user
        });
    });

    // =====================================
    // EVALUATION ==========================
    // =====================================
    app.get('/evaluation', isLoggedIn, function(req, res) {
        res.render('evaluation.ejs', {
            user : req.user
        });
    });

    // =====================================
    // EVALUATION EXAMPLE ==================
    // =====================================
    app.get('/evaluationExample', isLoggedIn, dbconnection.getDoc, dbconnection.getAnno, function(req, res) {
        res.render('evaluationExample.ejs', {
            user : req.user,
            documents : res.doc,
            annotations : res.anno
        });
    });

    // =====================================
    // DYNAMICBINDER =======================
    // =====================================
    app.get('/dynamicBinder', isLoggedIn, dbconnection.getDynamicBinder, function(req, res) {
        res.render('dynamicBinder.ejs', {
            user : req.user,
            data : res.data,
            binders : res.binders
        });
    });

    app.post('/dynamicBinder', isLoggedIn, function(req, res) {
        var string = encodeURIComponent(req.body.input);
        res.redirect('/Binder/?binder=' + string);
    });

    // =====================================
    // BINDER ==============================
    // =====================================

    app.get('/Binder', isLoggedIn, dbconnection.getBinderFiles, function(req, res) {
        res.render('binderTemplate.ejs', {
            user : req.user,
            binderFiles : res.binderFiles
        });
    });

    /*
    app.get('/Binder', isLoggedIn, dbconnection.getBinderFiles, function(req, res) {
        //Binder id saved in req.query.Binder
        if (req.query.binder == null) {
            res.redirect('/dynamicBinder');
        } else {
            res.render('binderTemplate.ejs', {
                user : req.user,
                binderFiles : res.binderFiles
            });
        }
    });
    */

    app.post('/Binder', isLoggedIn, dbconnection.getExample, function(req, res) {
        res.redirect('/Binder');
    });

    // =====================================
    // HELP ================================
    // =====================================
    app.get('/help', isLoggedIn, function(req, res) {
        res.render('help.ejs', {
            user : req.user
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // 404 =================================
    // =====================================
    app.get('*', function(req, res){
        res.redirect('/home');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    // if they aren't redirect them to the index page
    if (req.isAuthenticated()) {
        req.session.lastAccess = new Date().getTime();
        return next();
    } else {
        res.redirect('/');
    }
}

// route middleware to redirect to /home if in session
function inSession(req, res, next) {
    // if user is authenticated redirect them to the home page
    // if they aren't, carry on
    if (req.isAuthenticated()) {
        res.redirect('/home');
    } else {
        return next();
    }
}

// route middleware to redirect http to https
function ensureSecure(req, res, next){
    if(req.secure){
        return next();
    } else {
        res.redirect('https://'+req.host+req.url); // handle port numbers if non 443
    }
}
