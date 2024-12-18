// Developer: Meher Salim
// File: project-update.spec.js
// Description: Unit testing for creating a new project
// Credits: Lean, Mean, and Pragmatic - A Guide to Full-Stack JavaScript Development

const request = require('supertest');
const app = require('../../../src/app/app');
const { Project } = require('../../../src/models/project');

jest.mock('../../../src/models/project');

describe('PATCH /api/projects/:projectId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a project successfully', async () => {
    Project.findOne.mockResolvedValue({
      set: jest.fn(),
      save: jest.fn().mockResolvedValue({ projectId: 1 })
    });

    const response = await request(app).patch('/api/projects/1').send({ 
      name: "Project Alpha",
      description: "Initial phase of the project"
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Project updated successfully');
  });

  it('should return validation errors for invalid data', async () => {
    const response = await request(app).patch('/api/projects/1').send({
      name: 'UG',
      description: 'testing errors',
      startDate: '2024-12-01T00:00:00.000Z',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('data must NOT have additional properties');
  });

  it('should return 404 if the project does not exist', async () => {
    Project.findOne.mockResolvedValue(null);
  
    const response = await request(app).patch('/api/projects/1').send({
      name: "Project Alpha",
      description: "Initial phase of the project",
    });
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Project not found');
  });
  
  it('should handle internal server errors', async () => {
    Project.findOne.mockRejectedValue(new Error('Database error'));
  
    const response = await request(app).patch('/api/projects/1').send({
      name: "Project Alpha",
      description: "Initial phase of the project",
    });
  
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
    expect(Project.findOne).toHaveBeenCalledWith({ projectId: '1' });
  });
});