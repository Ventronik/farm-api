const db = require('../../db')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

function getAll(){
  return db('instructors')
}

function getOne(instructorId){
  return db('instructors').where({ id: instructorId }).first()
}

function create(name){
  return (
    db('instructors')
    .insert({ name })
    .returning('*')
    .then(function([data]){
      return data
    })
  )
}

function update(instructorId, name){
  return (  //these parantheses are not necessary.
    db('instructors')
    .update({ name }) //This will insert the name provided into the database.
    .where({ id: instructorId }) //Where is very important, with out it will update ALL THE NAMES!!!
    .returning('*') // instead of giving back info about the insertion(INSERT 0 1), this code will return what was added.
    .then(function([data]){ //This is a deconstruction that will strip the data out of the array that it comes in. THis makes it easier on your controller page
      return data
    })
  )
}

function remove(instructorId){
  return (
    db('instructors')
    .del() // this actually deletes it from the table in the database
    .where({ id: instructorId })
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

function getAllCohorts(instructorId){
  return (
    db('instructors')
    .select('instructors.id as instructors_id',
            'instructors.name as instructors_name',
            'cohorts.id as cohorts_id',
            'cohorts.name as cohorts_name')
    .join('instructors_cohorts', 'instructors_cohorts.instructors_id', 'instructors.id')
    .join('cohorts', 'cohorts.id', 'instructors_cohorts.cohorts_id')
    .where('instructors.id', instructorId)
  )
}

function addInstructorToCohort(instructorId, cohortId){
  return (
    db('instructors_cohorts').where({instructors_id: instructorId, cohorts_id: cohortId})
    .then(function([data]){
      if(!data){
        return (
          db('instructors_cohorts')
          .insert({instructors_id: instructorId, cohorts_id: cohortId})
          .returning('*')
          .then(function([data]){
            return data
          })
        )
      }
      else {
        return data
      }
    })
  )
}

function deleteInstructorFromCohort(instructorId, cohortId){
  return (
    db('instructors_cohorts')
    .del()
    .where({ instructors_id: instructorId, cohorts_id: cohortId })
    .returning('*')
    .then(function([data]){
      if(data){
        delete data.id
        return data
      }
      else {
        return { instructors_id: instructorId, cohorts_id: cohortId }
      }
    })
  )
}

function getAllStudents(instructorId){
  return (
    db('instructors')
    .select('instructors.id as instructors_id',
            'instructors.name as instructors_name',
            'cohorts.id as cohorts_id',
            'cohorts.name as cohorts_name',
            'students.id as students_id',
            'students.name as students_name')
    .join('instructors_cohorts', 'instructors_cohorts.instructors_id', 'instructors.id')
    .join('cohorts', 'cohorts.id', 'instructors_cohorts.cohorts_id')
    .join('students', 'students.cohorts_id', 'cohorts.id')
    .where('instructors.id', instructorId)
  )
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getAllCohorts,
  addInstructorToCohort,
  deleteInstructorFromCohort,
  getAllStudents
}
