const mongoose = require("mongoose");
const { Task } = require("../../src/models/task");

// Connect to a test database
// "mongodb+srv://tms_user:s3cret@bellevueuniversity.lftytpq.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity";
beforeAll(async () => {
  const connectionString =
    "mongodb+srv://tms_user:s3cret@bellevueuniversity.lftytpq.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity";

  try {
    await mongoose.connect(connectionString, {
      dbName: "tms",
    });
    console.log("task.spec.js Connection to the database instance was successful");
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
});

// Clear the database before each test
beforeEach(async () => {
  await Task.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log("Database connection closed");
});

describe("Task Model Test", () => {
 
  it("should create a task successfully", async () => {
    const taskData = {
      title: "Complete project documentation",
      description: "Write the documentation for the project",
      status: "In Progress",
      priority: "High",
      dueDate: "2021-01-10T00:00:00.000Z",
      dateCreated: "2021-01-01T00:00:00.000Z",
      dateModified: "2021-01-05T00:00:00.000Z",
      projectId: 1000,
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask.title).toBe(taskData.title);
  
  });
 
  ////A task must have a title, status, and priority 
  it("should fail to create a task without required fields", async () => {
    const taskData = {
      description: "Write the documentation for the project",
      priority: "High",
      dueDate: "2021-01-10T00:00:00.000Z",
      dateCreated: "2021-01-01T00:00:00.000Z",
      dateModified: "2021-01-05T00:00:00.000Z",
      projectId: 1000,
    };

    const task = new Task(taskData);

    let err;

    try {
      await task.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors["status"]).toBeDefined();
  });

  it("should update a task's status successfully", async () => {
    const taskData = {
      title: "Complete project documentation",
      description: "Write the documentation for the project",
      status: "In Progress",
      priority: "High",
      dueDate: "2021-01-10T00:00:00.000Z",
      dateCreated: "2021-01-01T00:00:00.000Z",
      dateModified: "2021-01-05T00:00:00.000Z",
      projectId: 1000,
    };
    const task = new Task(taskData);
    const savedTask = await task.save();
    savedTask.status = "Completed";
    const updatedTask = await savedTask.save();
    expect(updatedTask.status).toBe("Completed");
  });

  it("should fail to create a task with a title shorter than 3 characters", async () => {
    const taskData = {
      title: "Co",
      description: "Write the documentation for the project",
      status: "In Progress",
      priority: "High",
      dueDate: "2021-01-10T00:00:00.000Z",
      dateCreated: "2021-01-01T00:00:00.000Z",
      dateModified: "2021-01-05T00:00:00.000Z",
      projectId: 1000,
    };
    const task = new Task(taskData);
    let err;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["title"]).toBeDefined();
    expect(err.errors["title"].message).toBe(
      "Task title must be at least 3 characters"
    );
  });

  it("should fail to create a task with a name longer than 100 characters", async () => {
    const taskData = {
      title: "R".repeat(101),

      description: "Write the documentation for the project",
      status: "In Progress",
      priority: "High",
      dueDate: "2021-01-10T00:00:00.000Z",
      dateCreated: "2021-01-01T00:00:00.000Z",
      dateModified: "2021-01-05T00:00:00.000Z",
      projectId: 1000,
    };
    const task = new Task(taskData);
    let err;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["title"]).toBeDefined();
    expect(err.errors["title"].message).toBe(
      "Task title cannot exceed 100 characters"
    );
  });


  it("should fail to create a task with an invalid status", async () => {
    const taskData = {
        title: "Complete project documentation",
        description: "Write the documentation for the project",
       
        priority: "High",
        dueDate: "2021-01-10T00:00:00.000Z",
        dateCreated: "2021-01-01T00:00:00.000Z",
        dateModified: "2021-01-05T00:00:00.000Z",
        projectId: 1000,
      status: "InvalidStatus",
    };
    const task = new Task(taskData);
    let err;
    try {
      await task.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors["status"]).toBeDefined();
    expect(err.errors["status"].message).toBe(
      "`InvalidStatus` is not a valid enum value for path `status`."
    );
  });
  
});

