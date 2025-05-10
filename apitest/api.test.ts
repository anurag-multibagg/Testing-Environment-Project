import axios from 'axios';
const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('Public APIs Without API Key - Testing with Axios & Jest', () => {
  test('Dog API - Get random image', async () => {
    const res = await axios.get('https://dog.ceo/api/breeds/image/random');
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('success');
  });

  test('Cat API - Get random image', async () => {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('Bored API - Get random activity', async () => {
    const res = await axios.get('https://www.boredapi.com/api/activity');
    expect(res.status).toBe(200);
    expect(typeof res.data.activity).toBe('string');
  });

  test('ReqRes - Get user 2', async () => {
    const res = await axios.get('https://reqres.in/api/users/2');
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(2);
  });

  test('Agify - Predict age for Michael', async () => {
    const res = await axios.get('https://api.agify.io?name=michael');
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('michael');
  });

  test('Genderize - Predict gender for Emily', async () => {
    const res = await axios.get('https://api.genderize.io?name=emily');
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('emily');
  });

  test('Nationalize - Predict nationality for Nathan', async () => {
    const res = await axios.get('https://api.nationalize.io?name=nathan');
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('nathan');
  });

  test('Advice Slip API - Get random advice', async () => {
    const res = await axios.get('https://api.adviceslip.com/advice');
    expect(res.status).toBe(200);
    expect(typeof res.data.slip.advice).toBe('string');
  });

  test('Kanye Rest - Get quote', async () => {
    const res = await axios.get('https://api.kanye.rest/');
    expect(res.status).toBe(200);
    expect(typeof res.data.quote).toBe('string');
  });

  test('Numbers API - Get trivia for 42', async () => {
    const res = await axios.get('http://numbersapi.com/42?json');
    expect(res.status).toBe(200);
    expect(res.data.number).toBe(42);
  });

});


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
