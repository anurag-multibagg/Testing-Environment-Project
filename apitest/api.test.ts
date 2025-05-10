import axios from 'axios';
const BASE_URL = 'https://jsonplaceholder.typicode.com';
//anurag




//soumendu
describe('JSONPlaceholder API GET tests', () => {
  it('should return 100 posts', async () => {
    const res = await axios.get(`${BASE_URL}/posts`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(100);
  });

  it('should return 500 comments', async () => {
    const res = await axios.get(`${BASE_URL}/comments`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(500);
  });

  it('should return 100 albums', async () => {
    const res = await axios.get(`${BASE_URL}/albums`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(100);
  });

  it('should return 5000 photos', async () => {
    const res = await axios.get(`${BASE_URL}/photos`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(5000);
  });

  it('should return 200 todos', async () => {
    const res = await axios.get(`${BASE_URL}/todos`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(200);
  });

  it('should return 10 users', async () => {
    const res = await axios.get(`${BASE_URL}/users`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveLength(10);
  });

  it('should fetch a specific post with id=1', async () => {
    const res = await axios.get(`${BASE_URL}/posts/1`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id', 1);
  });

  it('should fetch comments for postId=1 and return 5 comments', async () => {
    const res = await axios.get(`${BASE_URL}/comments`, { params: { postId: 1 } });
    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('postId', 1);
  });

  it('should return all todos completed=false', async () => {
    const res = await axios.get(`${BASE_URL}/todos`, { params: { completed: false } });
    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('completed', false);
  });

  it('should fetch user with id=5 and validate name', async () => {
    const res = await axios.get(`${BASE_URL}/users/5`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id', 5);
    expect(typeof res.data.name).toBe('string');
  });
});
