const fetchData = async (url, method = 'GET', data = null) => {
  try {
      const headers = {
          'Content-Type': 'application/json',
      };

      const body = data ? JSON.stringify(data) : null;

      const response = await fetch(url, {
          method,
          headers,
          body,
          credentials: 'include'
      });

    //   if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //   }

      return response
  } catch (error) {
      console.error('Error in API request:', error);
      throw error;
  }
};

export default fetchData
