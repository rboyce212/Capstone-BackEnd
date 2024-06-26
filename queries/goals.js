const db = require("../db/dbConfig");

// get all goals
const getGoals = async (userprofile_id) => {
  try {
    const goals = await db.any(
      "SELECT * FROM goals WHERE userprofile_id=$1 ORDER BY target_date ASC",
      userprofile_id
    );
    // console.log("queries for all the goals: ",goals);
    return goals;
  } catch (err) {
    // console.log(err);
    return err;
  }
};

const getGoal = async (id, userprofile_id) => {
  try {
    const goal = await db.one(
      "SELECT * FROM goals WHERE goal_id=$1 AND userprofile_id=$2",
      [id, userprofile_id]
    );
    return goal;
  } catch (error) {
    return error;
  }
};

const createGoal = async (goal) => {
  try {
    const { name, description, completed, target_date, userprofile_id, interest_id ,progress} =
      goal;
    const newGoal = await db.one(
      "INSERT INTO goals (name, description, completed, target_date, created_at, userprofile_id, interest_id ,progress) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *",
      [name, description, completed, target_date, new Date(), userprofile_id, interest_id,progress]
    );
    return newGoal;
  } catch (error) {
    return error;
  }
};

const updateGoal = async (id, goal) => {
  try {
    const { name, description, completed, target_date, userprofile_id,progress } = goal;
    const updatedGoal = await db.one(
      "UPDATE goals SET name=$1, description=$2, completed=$3, target_date=$4, created_at=$5, userprofile_id=$6, progress=$7 WHERE goal_id=$8 RETURNING *",
      [name, description, completed, target_date, new Date(), userprofile_id, progress, id]
    );
    return updatedGoal;
  } catch (error) {
    // console.log(error)
    return error;
  }
};

const markGoalAsCompleted = async (id, goalId) => {
  try {
    const { completed } = goalId;
    const updateGoalToComplete = await db.query(
      "UPDATE goals SET completed = $1 WHERE goal_id = $2",
      [true, id]
    );
    return updateGoalToComplete;
  } catch (error) {
    return error;
  }
};
const deleteGoal = async (id) => {
  try {
    const deletedGoal = await db.one(
      "DELETE FROM goals WHERE goal_id=$1 RETURNING *",
      id
    );
    return deletedGoal;
  } catch (error) {
    return error;
  }
};
const addProgress = async (id, progress) => {
  try {
    const updatedGoal = await db.one(
      "UPDATE goals SET progress = $1 WHERE goal_id = $2 RETURNING *",
      [progress, id]
    );
    return updatedGoal;
  } catch (error) {
    return error;
  }
};

module.exports = { getGoals, getGoal, createGoal, updateGoal, deleteGoal, markGoalAsCompleted,addProgress };
