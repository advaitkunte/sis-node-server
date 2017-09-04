var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

//defining the schema of the DB
var SisSchema = mongoose.Schema({
    usn: {type:String, index:true},
    name: String,
    dob: String,
    courses: [{
        _id: false,
        code: String,
        name: String,
        attendance: {
            _id: false,
            percentage: Number,
            attended: Number,
            absent: Number,
            remaining: Number
        },
        cie: String,
        tests: [String],
        assignments: [String]
    }]
});

//creating a model

SisSchema.statics.exists = function(usn, callback) {
    this.model('Student').count({usn: usn}, function (err, count) {
        if(err) {
            console.log("Student Count error")
            callback(err, null)
            return;
        }
        if(count > 0)  {
            callback(null, true);
        }else {
            callback(null, false);
        }
    } );
}
SisSchema.statics.insertStudent = function(student, callback)  {
    //var student = mongoose.models('student', SisSchema);
    var student = new this(student);
    student.save(function(err, doc) {
        if(err) {
            console.log("error inserting student");
            callback(err, doc);
        } else {
            console.log("New student inserted into DB");
            callback(null, doc);
        }
    });
 }
SisSchema.statics.updateStudent = function(student, callback) {
    var usn = student.usn;
    var query = {usn: usn};
    console.log(student);
    this.update(query, student, function(err, numAffected)  {
        if(err) {
            console.log("Error Updating student in DB");
            callback(err, null)
        }else {
            console.log("Student updated in db");
            callback(null, numAffected)
        }
    });
}

SisSchema.plugin(timestamps);

module.exports = mongoose.model('Student', SisSchema);
