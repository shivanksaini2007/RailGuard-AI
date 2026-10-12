export async function fetchDemoStatus() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos/1'
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function createIncidentOnServer(incident) {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incident),
    }
  );

  if (!response.ok) {
    throw new Error('Create failed');
  }

  return response.json();
}
