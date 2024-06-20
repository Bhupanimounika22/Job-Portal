const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCandidateSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cpassword: { type: String, required: true }
});

const UserCompanySchema = new mongoose.Schema({
    companyname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    cpassword: { type: String, require: true }
});

const InternshipSchema = new mongoose.Schema({
    job_title: { type: String, required: true },
    company_name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    skills: { type: [String], required: true },
    duration: { type: String, required: true },
    start_date: { type: String, required: true },
    application_deadline: { type: String, required: true },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
});
 
const applicationSchema = new Schema({
    candidate: { type: Schema.Types.ObjectId, ref: 'Candidate' },
    internship: { type: Schema.Types.ObjectId, ref: 'Internship' },
    applicationDate: { type: Date, default: Date.now }
});
applicationSchema.index({ candidate: 1, internship: 1 }, { unique: true });

const Company = mongoose.model('Company', UserCompanySchema);
const Candidates = mongoose.model('Candidates', UserCandidateSchema);
const Intership = mongoose.model('Internship', InternshipSchema);
const Application = mongoose.model('Application', applicationSchema);

module.exports.Company = Company;
module.exports.Candidates = Candidates;
module.exports.Intership = Intership;
module.exports.Application = Application;
