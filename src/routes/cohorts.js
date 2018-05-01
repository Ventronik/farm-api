const express = require('express')
const router = express.Router()
const cohortsController = require('../controllers/cohorts')
const instructorsController = require('../controllers/instructors')

//////////////////////////////////////////////////////////////////////////////
// Basic CRUD Methods
//////////////////////////////////////////////////////////////////////////////

router.get('/', cohortsController.getAll)

router.get('/:cohortId', cohortsController.getOne)

router.post('/', cohortsController.create)

router.put('/:cohortId',
            cohortsController.checkIfCohortExists,
            cohortsController.update)

router.delete('/:cohortId',
            cohortsController.checkIfCohortExists,
            cohortsController.remove)

//////////////////////////////////////////////////////////////////////////////
// Nested CRUD Methods
//////////////////////////////////////////////////////////////////////////////

router.get('/:cohortId/students',
            cohortsController.checkIfCohortExists,
            cohortsController.getAllStudents)

router.get('/:cohortId/instructors',
            cohortsController.checkIfCohortExists,
            cohortsController.getAllInstructors)

router.put('/:cohortId/instructors/:instructorId',
            cohortsController.checkIfCohortExists,
            instructorsController.checkIfInstructorExists,
            instructorsController.addInstructorToCohort)

router.delete('/:cohortId/instructors/:instructorId',
            cohortsController.checkIfCohortExists,
            instructorsController.checkIfInstructorExists,
            instructorsController.deleteInstructorFromCohort)

module.exports = router
