import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export async function analyzeImage(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'analysis.jpg');
  const res = await axios.post(`${BASE_URL}/analyze`, formData);
  return res.data.problems;
}
