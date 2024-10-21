const express=require('express')
const path = require('path');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const session = require('express-session');

const { Company, Candidates, Intership, Application } = require('./models/models');

const PORT= 5767;
const app = express();

mongoose.connect("mongodb://localhost:27017/job");
app.set('view engine', 'ejs');
app.use(session({
    secret: 'hey',
    resave: false,
    saveUninitialized: true
}));

 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

 
 
 

app.get('/', (req, res) => {
    const user = req.session.user || null;
    const successMessage = req.session.successMessage;
    res.render('home', { user, successMessage });
});
app.get('/posting', async (req, res) => {
    try {
         
        const items = await Intership.find().populate('postedBy');
        const user = req.session.user || null;
        res.render('posting', { items, user });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/candidate', (req, res) => {
    res.render('candidate');
});

app.get('/company', (req, res) => {
    res.render('company');
});
app.get('/about',(req,res) =>{
    res.render('about')
})

app.post('/candidates', async (req, res) => {
    if (!req.body || !req.body.password || !req.body.cpassword) {
        return res.send('Invalid request.');
    }

    if (req.body.password !== req.body.cpassword) {
        return res.send('Passwords do not match.');
    }

    try {
        const newUser = new Candidates({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        });

        await newUser.save();
        res.send('User saved to the database!');
    } catch (err) {
        res.send('Error saving user to the database.');
    }
});

app.post('/companys', async (req, res) => {
    if (!req.body || !req.body.password || !req.body.cpassword) {
        res.send("Invalid request");
    }
    if (req.body.password != req.body.cpassword) {
        res.send("password do not match.");
    }
    try {
        const newUser = new Company({
            companyname: req.body.companyname,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        });
        await newUser.save();
        res.send('User saved to the database!');
    } catch (err) {
        res.send('Error saving user to the database.');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/logins', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Company.findOne({ email, password });
        const user1 = await Candidates.findOne({ email, password });

        if (user) {
            req.session.user = { id: user._id, type: 'Company' };
            res.redirect('/posting');
        } else if (user1) {
            req.session.user = { id: user1._id, type: 'Candidate' };
            res.redirect('/posting');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error occurred during login:', error);
        res.send('Error occurred during login: ' + error.message);
    }
});
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.type === 'Company') {
        return res.redirect('/company-dashboard');
    } else if (req.session.user.type === 'Candidate') {
        return res.redirect('/candidate-dashboard');
    } else {
        // Handle other user types if needed
        return res.redirect('/');
    }
});

app.get('/company-dashboard', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Company') {
        return res.redirect('/login');
    }

    try {
        const internships = await Intership.find({ postedBy: req.session.user.id });
        const user = await Company.findById(req.session.user.id);
        res.render('company-dashboard', { internships, user });
    } catch (error) {
        console.error('Error fetching company internships:', error);
        res.status(500).send('Error fetching company internships');
    }
});
app.get('/candidate-dashboard', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Candidate') {
        return res.redirect('/login');
    }

    try {
        const applications = await Application.find({ candidate: req.session.user.id }).populate('internship');
        const user = await Candidates.findById(req.session.user.id);
        res.render('candidate-dashboard', { applications, user });
    } catch (error) {
        console.error('Error fetching candidate applications:', error);
        res.status(500).send('Error fetching candidate applications');
    }
});

 

app.get('/edit-internship/:id', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Company') {
        return res.redirect('/login');
    }

    try {
        const internship = await Intership.findById(req.params.id);
        if (internship.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send('Unauthorized');
        }
        res.render('edit-internship', { internship });
    } catch (error) {
        console.error('Error fetching internship:', error);
        res.status(500).send('Error fetching internship');
    }
});

app.post('/edit-internship/:id', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Company') {
        return res.redirect('/login');
    }

    try {
        const internship = await Intership.findById(req.params.id);
        if (internship.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send('Unauthorized');
        }

        internship.job_title = req.body.job_title;
        internship.company_name = req.body.company_name;
        internship.location = req.body.location;
        internship.description = req.body.description;
        internship.requirements = req.body.requirements;
        internship.skills = req.body.skills;
        internship.duration = req.body.duration;
        internship.start_date = req.body.start_date;
        internship.application_deadline = req.body.application_deadline;

        await internship.save();
        res.redirect('/company-dashboard');
    } catch (error) {
        console.error('Error updating internship:', error);
        res.status(500).send('Error updating internship');
    }
});

app.post('/delete-internship/:id', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Company') {
        return res.redirect('/login');
    }

    try {
        const internship = await Intership.findById(req.params.id);
        if (internship.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send('Unauthorized');
        }

        await internship.deleteOne();
        res.redirect('/company-dashboard');
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).send('Error deleting internship');
    }
});

app.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const user = req.session.user.type === 'Company'
        ? await Company.findById(req.session.user.id)
        : await Candidates.findById(req.session.user.id);

    res.render('profile', { user });
});

app.post('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { name, email, bio } = req.body;
    const update = { name, email, bio };

    if (req.session.user.type === 'Company') {
        await Company.findByIdAndUpdate(req.session.user.id, update);
    } else {
        await Candidates.findByIdAndUpdate(req.session.user.id, update);
    }

    res.redirect('/profile');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/internship', (req, res) => {
    res.render('internships');
});

app.post('/internships', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Company') {
        return res.redirect('/login');
    }

    try {
        const newIntern = new Intership({
            job_title: req.body.job_title,
            company_name: req.body.company_name,
            location: req.body.location,
            description: req.body.description,
            requirements: req.body.requirements,
            skills: req.body.skills,
            duration: req.body.duration,
            start_date: req.body.start_date,
            application_deadline: req.body.application_deadline,
            postedBy: req.session.user.id
        });

        await newIntern.save();
        // Redirect to the company dashboard after posting
        res.redirect('/company-dashboard');
    } catch (error) {
        console.error('Error posting internship:', error);
        res.send('Error posting internship');
    }
});



app.get('/intern_ships', async (req, res) => {
    try {
        const items = await Intership.find();
        res.render('home', { items });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/internships/:id', async (req, res) => {
    try {
        const internship = await Intership.findById(req.params.id);
        const user = req.session.user || null;
        res.render('post', { internship, user });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/apply/:id', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Candidate') {
        return res.redirect('/login');
    }

    try {
        const internshipId = req.params.id;
        const candidateId = req.session.user.id;

     
        const existingApplication = await Application.findOne({ candidate: candidateId, internship: internshipId });

        if (existingApplication) {
            return res.send('You have already registered for this internship.');
        }

       
        const application = new Application({
            candidate: candidateId,
            internship: internshipId,
            applicationDate: new Date()
        });

        await application.save();
        req.session.successMessage = 'You have successfully applied for this internship!';
        res.redirect('/');  
    } catch (error) {
        console.error('Error applying for internship:', error);
        res.status(500).send('Error applying for internship');
    }
});

app.post('/cancel-application/:id', async (req, res) => {
    if (!req.session.user || req.session.user.type !== 'Candidate') {
        return res.redirect('/login');
    }

    try {
        const applicationId = req.params.id;
        await Application.findByIdAndDelete(applicationId);
        res.redirect('/candidate-dashboard');
    } catch (error) {
        console.error('Error canceling application:', error);
        res.status(500).send('Error canceling application');
    }
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${port}`);
});
