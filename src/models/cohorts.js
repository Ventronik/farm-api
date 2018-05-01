const db = require('../../db')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getOne(cohortId){
  return db('cohorts').where({ id: cohortId }).first()
}

function getAll(){
  return db('cohorts')
}

function create(name){
  return (
    db('cohorts')
    .insert({ name })
    .returning('*')
    .then(function([data]){
      return data
    })
  )
}

function update(cohortId, name){
  return (  //these parantheses are not necessary.
    db('cohorts')
    .update({ name }) //This will insert the name provided into the database.
    .where({ id: cohortId }) //Where is very important, with out it will update ALL THE NAMES!!!
    .returning('*') // instead of giving back info about the insertion(INSERT 0 1), this code will return what was added.
    .then(function([data]){ //This is a deconstruction that will strip the data out of the array that it comes in. THis makes it easier on your controller page
      return data
    })
  )
}

function remove(cohortId){
  return (
    db('cohorts')
    .del() // this actually deletes it from the table in the database
    .where({ id: cohortId })
    .returning('*')
    .then(function([data]){
      delete data.id //only delete the id from the data
      return data
    })
  )
}

//////////////////////////////////////////////////////////////////////////////
// Nested CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getAllStudents(cohortId){
  return (
    db('cohorts')
    .join('students', 'students.cohorts_id', 'cohorts.id' ) //the first 2 can be in any order
    //as we are building a new ephemeral table so we pull in students, then match students by there cohorts ID to the cohorts table and the id there.
    .where('cohorts.id', cohortId)
  )
}

function getAllInstructors(cohortId){
  return (
    db('cohorts')
    .select('instructors.id as instructors_id',
            'instructors.name as instructors_name',
            'cohorts.id as cohorts_id',
            'cohorts.name as cohorts_name')
    .join('instructors_cohorts', 'instructors_cohorts.cohorts_id', 'cohorts.id')
    .join('instructors', 'instructors.id', 'instructors_cohorts.instructors_id')
    .where('cohorts.id', cohortId)
  )
}

module.exports = {
  getOne,
  getAll,
  create,
  update,
  remove,
  getAllStudents,
  getAllInstructors
}
