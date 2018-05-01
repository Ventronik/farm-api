const db = require('../../db')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getOne(studentId){
  return db('students').where({ id: studentId }).first()
}

function getAll(){
  return db('students')
}

function create(name, cohort_id){
  return (
    db('students')
    .insert({ name, cohort_id })
    .returning('*')
    .then(function([data]){
      return data
    })
  )
}

function update(studentId, name){
  return (  //these parantheses are not necessary.
    db('students')
    .update({ name }) //This will insert the name provided into the database.
    .where({ id: instructorId }) //Where is very important, with out it will update ALL THE NAMES!!!
    .returning('*') // instead of giving back info about the insertion(INSERT 0 1), this code will return what was added.
    .then(function([data]){ //This is a deconstruction that will strip the data out of the array that it comes in. THis makes it easier on your controller page
      return data
    })
  )
}

function remove(studentId){
  return (
    db('students')
    .del() // this actually deletes it from the table in the database
    .where({ id: studentId })
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

function getAllInstructors(studentId){
  return (
    db('students')
    .select('instructors.id as instructors_id',
            'instructors.name as instructors_name',
            'cohorts.id as cohorts_id',
            'cohorts.name as cohorts_name')
    .join('cohorts', 'cohorts.id', 'students.cohorts_id')
    .join('instructors_cohorts', 'instructors_cohorts.cohorts_id', 'cohorts.id')
    .join('instructors', 'instructors.id', 'instructors_cohorts.instructors_id')
    .where('students.id', studentId)
  )
}

module.exports = {
  getOne,
  getAll,
  getAllInstructors
}
