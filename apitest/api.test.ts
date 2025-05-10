import axios from "axios";
const BASE_URL = "https://jsonplaceholder.typicode.com";

describe("Dog API - Get random image", () => {
  test("should return a random dog image", async () => {
    try {
      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      expect(res.status).toBe(200);
      expect(res.data.status).toBe("success");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Dog API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Cat API - Get random image", () => {
  test("should return an array of cat images", async () => {
    try {
      const res = await axios.get("https://api.thecatapi.com/v1/images/search");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Cat API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Bored API - Get random activity", () => {
  test("should return a random activity", async () => {
    try {
      const res = await axios.get("https://www.boredapi.com/api/activity");
      expect(res.status).toBe(200);
      expect(typeof res.data.activity).toBe("string");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Bored API failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("ReqRes - Get user 2", () => {
  test("should return user with id 2", async () => {
    try {
      const res = await axios.get("https://reqres.in/api/users/2");
      expect(res.status).toBe(200);
      expect(res.data.data.id).toBe(2);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`ReqRes API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Agify - Predict age for Michael", () => {
  test("should predict age for Michael", async () => {
    try {
      const res = await axios.get("https://api.agify.io?name=michael");
      expect(res.status).toBe(200);
      expect(res.data.name).toBe("michael");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Agify API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Genderize - Predict gender for Emily", () => {
  test("should predict gender for Emily", async () => {
    try {
      const res = await axios.get("https://api.genderize.io?name=emily");
      expect(res.status).toBe(200);
      expect(res.data.name).toBe("emily");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Genderize API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Nationalize - Predict nationality for Nathan", () => {
  test("should predict nationality for Nathan", async () => {
    try {
      const res = await axios.get("https://api.nationalize.io?name=nathan");
      expect(res.status).toBe(200);
      expect(res.data.name).toBe("nathan");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Nationalized API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Advice Slip API - Get random advice", () => {
  test("should return random advice", async () => {
    try {
      const res = await axios.get("https://api.adviceslip.com/advice");
      expect(res.status).toBe(200);
      expect(typeof res.data.slip.advice).toBe("string");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Advice Slip API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Kanye Rest - Get quote", () => {
  test("should return a Kanye quote", async () => {
    try {
      const res = await axios.get("https://api.kanye.rest/");
      expect(res.status).toBe(200);
      expect(typeof res.data.quote).toBe("string");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Kanye API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("Numbers API - Get trivia for 42", () => {
  test("should return trivia about 42", async () => {
    try {
      const res = await axios.get("http://numbersapi.com/42?json");
      expect(res.status).toBe(200);
      expect(res.data.number).toBe(42);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Numbers API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get all posts", () => {
  test("should return 100 posts", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/posts`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveLength(100);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Posts API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get all comments", () => {
  test("should return 500 comments", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/comments`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveLength(500);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Comments API Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get all albums", () => {
  test("should return 100 albums", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/albums`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveLength(100);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Albums fetch Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get all photos", () => {
  test("should return 5000 photos", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/photos`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveLength(5000);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Photos Fetched Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get all todos", () => {
  test("should return 200 todos", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todos`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveLength(200);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Todos fetch Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get all users", () => {
  test("should return 10 users", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveLength(10);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Users fetch Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get post with ID=1", () => {
  test("should return post with ID 1", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/posts/1`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("id", 1);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Post id=1 fetch Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get comments for postId=1", () => {
  test("should return comments for postId=1", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/comments`, {
        params: { postId: 1 },
      });
      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0]).toHaveProperty("postId", 1);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Comment for postId=1 Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get todos with completed=false", () => {
  test("should return incomplete todos", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todos`, {
        params: { completed: false },
      });
      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0]).toHaveProperty("completed", false);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Incomplete todos fetch Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});

describe("JSONPlaceholder - Get user with id=5", () => {
  test("should return user with ID 5", async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/5`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("id", 5);
      expect(typeof res.data.name).toBe("string");
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`User ID=5 fetch Failed: ${err.message}`);
      } else {
        throw new Error("Something failed with an unknown error");
      }
    }
  });
});
